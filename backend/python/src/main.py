"""
Clawchan Intelligence Agency - ML/AI Service
FastAPI-based machine learning service for predictive analytics
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
from datetime import datetime

import numpy as np
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from starlette.responses import Response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Prometheus metrics
PREDICTION_COUNTER = Counter(
    'ml_predictions_total',
    'Total number of ML predictions',
    ['model_type', 'status']
)

PREDICTION_LATENCY = Histogram(
    'ml_prediction_latency_seconds',
    'ML prediction latency in seconds',
    ['model_type']
)

MODEL_LOAD_TIME = Gauge(
    'ml_model_load_time_seconds',
    'Time taken to load ML models'
)

ACTIVE_PREDICTIONS = Gauge(
    'ml_active_predictions',
    'Number of active predictions'
)

# Pydantic models
class PredictionRequest(BaseModel):
    model_type: str = Field(..., description="Type of model to use")
    data: Dict[str, Any] = Field(..., description="Input data for prediction")
    parameters: Optional[Dict[str, Any]] = Field(default={}, description="Model parameters")

class PredictionResponse(BaseModel):
    prediction: Any
    confidence: float
    model_version: str
    processing_time_ms: float
    timestamp: datetime

class AircraftPredictionRequest(BaseModel):
    icao24: str
    latitude: float
    longitude: float
    altitude: float
    velocity: float
    heading: float
    historical_positions: Optional[List[Dict[str, float]]] = []

class AnomalyDetectionRequest(BaseModel):
    data_type: str
    values: List[float]
    threshold: Optional[float] = 2.0

class ThreatAssessmentRequest(BaseModel):
    source_type: str
    location: Dict[str, float]
    indicators: List[str]
    confidence_level: float = Field(ge=0.0, le=1.0)

# Model registry
class ModelRegistry:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.versions: Dict[str, str] = {}
    
    def register(self, name: str, model: Any, version: str = "1.0.0"):
        self.models[name] = model
        self.versions[name] = version
        logger.info(f"Registered model: {name} v{version}")
    
    def get(self, name: str) -> Optional[Any]:
        return self.models.get(name)
    
    def get_version(self, name: str) -> str:
        return self.versions.get(name, "unknown")

registry = ModelRegistry()

# Mock ML models for demonstration
class AircraftTrajectoryPredictor:
    """Predicts aircraft trajectories based on current state and historical data"""
    
    def predict(self, request: AircraftPredictionRequest) -> Dict[str, Any]:
        # Simplified trajectory prediction using linear extrapolation
        positions = []
        lat, lon, alt = request.latitude, request.longitude, request.altitude
        velocity_ms = request.velocity
        heading_rad = np.radians(request.heading)
        
        # Predict next 10 positions (1 minute intervals)
        for i in range(1, 11):
            # Simple linear extrapolation
            distance_km = (velocity_ms * 60 * i) / 1000  # km traveled in i minutes
            delta_lat = distance_km * np.cos(heading_rad) / 111.32
            delta_lon = distance_km * np.sin(heading_rad) / (111.32 * np.cos(np.radians(lat)))
            
            positions.append({
                "timestamp": i * 60,
                "latitude": lat + delta_lat,
                "longitude": lon + delta_lon,
                "altitude": alt,
                "confidence": max(0.95 - i * 0.05, 0.5)
            })
        
        return {
            "predicted_positions": positions,
            "estimated_arrival": positions[-1],
            "confidence_score": 0.85
        }

class AnomalyDetector:
    """Detects anomalies in time series data"""
    
    def detect(self, values: List[float], threshold: float = 2.0) -> Dict[str, Any]:
        if len(values) < 2:
            return {"anomalies": [], "mean": 0, "std": 0}
        
        mean = np.mean(values)
        std = np.std(values)
        
        anomalies = []
        for i, value in enumerate(values):
            z_score = abs((value - mean) / std) if std > 0 else 0
            if z_score > threshold:
                anomalies.append({
                    "index": i,
                    "value": value,
                    "z_score": z_score,
                    "severity": "high" if z_score > 3 else "medium"
                })
        
        return {
            "anomalies": anomalies,
            "mean": float(mean),
            "std": float(std),
            "threshold": threshold,
            "anomaly_count": len(anomalies)
        }

class ThreatAssessor:
    """Assesses threat levels based on multiple indicators"""
    
    def assess(self, request: ThreatAssessmentRequest) -> Dict[str, Any]:
        # Simplified threat assessment
        indicator_weights = {
            "unusual_activity": 0.3,
            "proximity_alert": 0.25,
            "communication_anomaly": 0.2,
            "pattern_deviation": 0.15,
            "unauthorized_access": 0.1
        }
        
        threat_score = 0
        triggered_indicators = []
        
        for indicator in request.indicators:
            weight = indicator_weights.get(indicator, 0.1)
            threat_score += weight
            triggered_indicators.append({
                "indicator": indicator,
                "weight": weight,
                "triggered": True
            })
        
        # Adjust by confidence level
        threat_score *= request.confidence_level
        
        threat_level = "low"
        if threat_score > 0.7:
            threat_level = "critical"
        elif threat_score > 0.5:
            threat_level = "high"
        elif threat_score > 0.3:
            threat_level = "medium"
        
        return {
            "threat_level": threat_level,
            "threat_score": round(threat_score, 3),
            "confidence": request.confidence_level,
            "triggered_indicators": triggered_indicators,
            "recommendations": self._get_recommendations(threat_level)
        }
    
    def _get_recommendations(self, threat_level: str) -> List[str]:
        recommendations = {
            "low": ["Continue monitoring", "Log activity"],
            "medium": ["Increase monitoring frequency", "Notify supervisor"],
            "high": ["Alert security team", "Prepare countermeasures", "Document evidence"],
            "critical": ["Immediate response required", "Activate emergency protocols", "Notify all stakeholders"]
        }
        return recommendations.get(threat_level, ["Assess situation"])

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    logger.info("Loading ML models...")
    start_time = datetime.now()
    
    # Register models
    registry.register("aircraft_trajectory", AircraftTrajectoryPredictor(), "1.0.0")
    registry.register("anomaly_detector", AnomalyDetector(), "1.0.0")
    registry.register("threat_assessor", ThreatAssessor(), "1.0.0")
    
    load_time = (datetime.now() - start_time).total_seconds()
    MODEL_LOAD_TIME.set(load_time)
    logger.info(f"Models loaded in {load_time:.2f}s")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ML service...")

# Create FastAPI app
app = FastAPI(
    title="Clawchan ML/AI Service",
    description="Machine Learning and Predictive Analytics API for Clawchan Intelligence Platform",
    version="2.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "models_loaded": len(registry.models)
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )

@app.post("/predict/trajectory", response_model=PredictionResponse)
async def predict_trajectory(request: AircraftPredictionRequest):
    """Predict aircraft trajectory"""
    import time
    start_time = time.time()
    
    try:
        ACTIVE_PREDICTIONS.inc()
        model = registry.get("aircraft_trajectory")
        if not model:
            raise HTTPException(status_code=503, detail="Model not available")
        
        result = model.predict(request)
        processing_time = (time.time() - start_time) * 1000
        
        PREDICTION_COUNTER.labels(model_type="trajectory", status="success").inc()
        PREDICTION_LATENCY.labels(model_type="trajectory").observe(time.time() - start_time)
        
        return PredictionResponse(
            prediction=result,
            confidence=result["confidence_score"],
            model_version=registry.get_version("aircraft_trajectory"),
            processing_time_ms=processing_time,
            timestamp=datetime.now()
        )
    except Exception as e:
        PREDICTION_COUNTER.labels(model_type="trajectory", status="error").inc()
        logger.error(f"Trajectory prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        ACTIVE_PREDICTIONS.dec()

@app.post("/detect/anomalies")
async def detect_anomalies(request: AnomalyDetectionRequest):
    """Detect anomalies in data"""
    import time
    start_time = time.time()
    
    try:
        model = registry.get("anomaly_detector")
        if not model:
            raise HTTPException(status_code=503, detail="Model not available")
        
        result = model.detect(request.values, request.threshold)
        processing_time = (time.time() - start_time) * 1000
        
        PREDICTION_COUNTER.labels(model_type="anomaly", status="success").inc()
        
        return {
            "result": result,
            "processing_time_ms": processing_time,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        PREDICTION_COUNTER.labels(model_type="anomaly", status="error").inc()
        logger.error(f"Anomaly detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assess/threat")
async def assess_threat(request: ThreatAssessmentRequest):
    """Assess threat level"""
    import time
    start_time = time.time()
    
    try:
        model = registry.get("threat_assessor")
        if not model:
            raise HTTPException(status_code=503, detail="Model not available")
        
        result = model.assess(request)
        processing_time = (time.time() - start_time) * 1000
        
        PREDICTION_COUNTER.labels(model_type="threat", status="success").inc()
        
        return {
            "result": result,
            "processing_time_ms": processing_time,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        PREDICTION_COUNTER.labels(model_type="threat", status="error").inc()
        logger.error(f"Threat assessment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List available models"""
    return {
        "models": [
            {
                "name": name,
                "version": registry.get_version(name),
                "status": "loaded"
            }
            for name in registry.models.keys()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
