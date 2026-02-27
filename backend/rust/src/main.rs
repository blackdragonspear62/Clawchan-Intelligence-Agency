use axum::{
    extract::{Path, Query, State, WebSocketUpgrade},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use futures::{sink::SinkExt, stream::StreamExt};
use prometheus::{Counter, Encoder, Gauge, Histogram, Registry, TextEncoder};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, RwLock},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use tokio::time::interval;
use tower_http::{compression::CompressionLayer, cors::CorsLayer, trace::TraceLayer};
use tracing::{info, warn};
use uuid::Uuid;

// Metrics
lazy_static::lazy_static! {
    static ref REGISTRY: Registry = Registry::new();
    static ref HTTP_REQUESTS_TOTAL: Counter = Counter::new(
        "http_requests_total",
        "Total number of HTTP requests"
    ).unwrap();
    static ref HTTP_REQUEST_DURATION: Histogram = Histogram::with_opts(
        prometheus::HistogramOpts::new(
            "http_request_duration_seconds",
            "HTTP request duration in seconds"
        )
    ).unwrap();
    static ref ACTIVE_CONNECTIONS: Gauge = Gauge::new(
        "active_websocket_connections",
        "Number of active WebSocket connections"
    ).unwrap();
    static ref AIRCRAFT_PROCESSED: Counter = Counter::new(
        "aircraft_processed_total",
        "Total number of aircraft processed"
    ).unwrap();
}

// Data models
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Aircraft {
    icao24: String,
    callsign: Option<String>,
    latitude: f64,
    longitude: f64,
    altitude: f64,
    velocity: f64,
    heading: f64,
    last_update: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Satellite {
    norad_id: u32,
    name: String,
    latitude: f64,
    longitude: f64,
    altitude: f64,
    velocity: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StreamMessage {
    message_type: String,
    payload: serde_json::Value,
    timestamp: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct HealthStatus {
    status: String,
    timestamp: String,
    version: String,
    uptime_seconds: u64,
}

// Application state
struct AppState {
    aircraft_data: Arc<RwLock<Vec<Aircraft>>>,
    satellite_data: Arc<RwLock<Vec<Satellite>>>,
    start_time: Instant,
}

// Generate mock aircraft data
fn generate_aircraft() -> Vec<Aircraft> {
    let airlines = vec!["UAL", "AAL", "DAL", "BAW", "DLH", "AFR", "KLM", "JAL", "ANA"];
    let mut aircraft = Vec::with_capacity(100);

    for i in 0..100 {
        let airline = airlines[i % airlines.len()];
        aircraft.push(Aircraft {
            icao24: format!("{:06x}", i * 1234567),
            callsign: Some(format!("{}{}", airline, 100 + i)),
            latitude: ((i % 18) as f64 - 9.0) * 10.0,
            longitude: ((i % 36) as f64 - 18.0) * 10.0,
            altitude: 1000.0 + (i as f64) * 100.0,
            velocity: 200.0 + ((i % 50) as f64) * 10.0,
            heading: (i * 4) as f64,
            last_update: current_timestamp(),
        });
    }

    aircraft
}

// Generate mock satellite data
fn generate_satellites() -> Vec<Satellite> {
    let names = vec![
        "ISS (ZARYA)",
        "HST",
        "STARLINK-1007",
        "STARLINK-1008",
        "STARLINK-1009",
        "STARLINK-1010",
        "SES-7",
        "GPS-IIR-M",
    ];

    names
        .iter()
        .enumerate()
        .map(|(i, name)| Satellite {
            norad_id: 25544 + i as u32,
            name: name.to_string(),
            latitude: ((i % 9) as f64 - 4.5) * 20.0,
            longitude: ((i % 18) as f64 - 9.0) * 20.0,
            altitude: 400.0 + (i as f64) * 1000.0,
            velocity: 7.66,
        })
        .collect()
}

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

// Handlers
async fn health_check(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let uptime = state.start_time.elapsed().as_secs();
    
    Json(HealthStatus {
        status: "healthy".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        version: "2.0.0".to_string(),
        uptime_seconds: uptime,
    })
}

async fn metrics_handler() -> impl IntoResponse {
    let encoder = TextEncoder::new();
    let metric_families = REGISTRY.gather();
    let mut buffer = Vec::new();
    
    encoder.encode(&metric_families, &mut buffer).unwrap();
    
    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", encoder.format_type())
        .body(buffer.into())
        .unwrap()
}

async fn get_aircraft(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let aircraft = state.aircraft_data.read().unwrap().clone();
    AIRCRAFT_PROCESSED.inc_by(aircraft.len() as f64);
    
    Json(serde_json::json!({
        "data": aircraft,
        "count": aircraft.len(),
        "time": current_timestamp(),
    }))
}

async fn get_satellites(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let satellites = state.satellite_data.read().unwrap().clone();
    
    Json(serde_json::json!({
        "data": satellites,
        "count": satellites.len(),
        "time": current_timestamp(),
    }))
}

async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(socket: axum::extract::ws::WebSocket, state: Arc<AppState>) {
    ACTIVE_CONNECTIONS.inc();
    info!("WebSocket connection established");

    let (mut sender, mut receiver) = socket.split();

    // Send initial data
    let aircraft = state.aircraft_data.read().unwrap().clone();
    let msg = StreamMessage {
        message_type: "aircraft_init".to_string(),
        payload: serde_json::to_value(&aircraft).unwrap(),
        timestamp: current_timestamp(),
    };

    if let Ok(json) = serde_json::to_string(&msg) {
        let _ = sender.send(axum::extract::ws::Message::Text(json)).await;
    }

    // Handle incoming messages
    while let Some(Ok(message)) = receiver.next().await {
        match message {
            axum::extract::ws::Message::Text(text) => {
                if let Ok(req) = serde_json::from_str::<serde_json::Value>(&text) {
                    info!("Received message: {:?}", req);
                    
                    // Echo back with timestamp
                    let response = StreamMessage {
                        message_type: "echo".to_string(),
                        payload: req,
                        timestamp: current_timestamp(),
                    };
                    
                    if let Ok(json) = serde_json::to_string(&response) {
                        let _ = sender.send(axum::extract::ws::Message::Text(json)).await;
                    }
                }
            }
            axum::extract::ws::Message::Close(_) => {
                break;
            }
            _ => {}
        }
    }

    ACTIVE_CONNECTIONS.dec();
    info!("WebSocket connection closed");
}

// Background task to update aircraft positions
async fn update_aircraft_task(state: Arc<AppState>) {
    let mut ticker = interval(Duration::from_secs(1));

    loop {
        ticker.tick().await;

        let mut aircraft = state.aircraft_data.write().unwrap();
        for ac in aircraft.iter_mut() {
            // Simple position update
            let heading_rad = ac.heading.to_radians();
            let distance_km = ac.velocity / 3600.0; // km per second
            
            ac.latitude += (distance_km * heading_rad.cos()) / 111.32;
            ac.longitude += (distance_km * heading_rad.sin()) / (111.32 * ac.latitude.to_radians().cos());
            ac.last_update = current_timestamp();
        }
    }
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Register metrics
    REGISTRY.register(Box::new(HTTP_REQUESTS_TOTAL.clone())).unwrap();
    REGISTRY.register(Box::new(HTTP_REQUEST_DURATION.clone())).unwrap();
    REGISTRY.register(Box::new(ACTIVE_CONNECTIONS.clone())).unwrap();
    REGISTRY.register(Box::new(AIRCRAFT_PROCESSED.clone())).unwrap();

    // Create app state
    let state = Arc::new(AppState {
        aircraft_data: Arc::new(RwLock::new(generate_aircraft())),
        satellite_data: Arc::new(RwLock::new(generate_satellites())),
        start_time: Instant::now(),
    });

    // Start background tasks
    let update_state = state.clone();
    tokio::spawn(update_aircraft_task(update_state));

    // Build router
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/metrics", get(metrics_handler))
        .route("/api/v1/aircraft", get(get_aircraft))
        .route("/api/v1/satellites", get(get_satellites))
        .route("/ws", get(websocket_handler))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(CompressionLayer::new())
        .with_state(state);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8081));
    info!("🚀 Clawchan High-Performance Processor starting on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
