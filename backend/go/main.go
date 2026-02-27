package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Metrics
var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "endpoint", "status"},
	)

	httpRequestDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "endpoint"},
	)

	activeWebSocketConnections = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Name: "active_websocket_connections",
			Help: "Number of active WebSocket connections",
		},
	)

	messagesProcessed = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "messages_processed_total",
			Help: "Total number of messages processed",
		},
		[]string{"type"},
	)
)

func init() {
	prometheus.MustRegister(httpRequestsTotal)
	prometheus.MustRegister(httpRequestDuration)
	prometheus.MustRegister(activeWebSocketConnections)
	prometheus.MustRegister(messagesProcessed)
}

// Models
type Aircraft struct {
	Icao24      string  `json:"icao24"`
	Callsign    string  `json:"callsign"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Altitude    float64 `json:"altitude"`
	Velocity    float64 `json:"velocity"`
	Heading     float64 `json:"heading"`
	LastUpdate  int64   `json:"last_update"`
}

type Satellite struct {
	NoradID     int     `json:"norad_id"`
	Name        string  `json:"name"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Altitude    float64 `json:"altitude"`
	Velocity    float64 `json:"velocity"`
}

type StreamMessage struct {
	Type      string      `json:"type"`
	Payload   interface{} `json:"payload"`
	Timestamp int64       `json:"timestamp"`
}

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Client manager for WebSocket connections
type ClientManager struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

type Client struct {
	manager *ClientManager
	conn    *websocket.Conn
	send    chan []byte
}

func newClientManager() *ClientManager {
	return &ClientManager{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (manager *ClientManager) run() {
	for {
		select {
		case client := <-manager.register:
			manager.clients[client] = true
			activeWebSocketConnections.Inc()
			log.Printf("Client registered. Total: %d", len(manager.clients))

		case client := <-manager.unregister:
			if _, ok := manager.clients[client]; ok {
				delete(manager.clients, client)
				close(client.send)
				activeWebSocketConnections.Dec()
				log.Printf("Client unregistered. Total: %d", len(manager.clients))
			}

		case message := <-manager.broadcast:
			for client := range manager.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(manager.clients, client)
					activeWebSocketConnections.Dec()
				}
			}
		}
	}
}

func (c *Client) readPump() {
	defer func() {
		c.manager.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512 * 1024)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}

		var msg StreamMessage
		if err := json.Unmarshal(message, &msg); err == nil {
			messagesProcessed.WithLabelValues(msg.Type).Inc()
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// Generate mock aircraft data
func generateAircraftData() []Aircraft {
	airlines := []string{"UAL", "AAL", "DAL", "BAW", "DLH", "AFR", "KLM", "JAL", "ANA"}
	aircraft := make([]Aircraft, 100)

	for i := 0; i < 100; i++ {
		airline := airlines[i%len(airlines)]
		aircraft[i] = Aircraft{
			Icao24:     generateICAO24(),
			Callsign:   airline + strconv.Itoa(100+i),
			Latitude:   (float64(i%18) - 9) * 10,
			Longitude:  (float64(i%36) - 18) * 10,
			Altitude:   float64(1000 + i*100),
			Velocity:   200 + float64(i%50)*10,
			Heading:    float64(i * 4),
			LastUpdate: time.Now().Unix(),
		}
	}

	return aircraft
}

func generateICAO24() string {
	chars := "0123456789abcdef"
	result := make([]byte, 6)
	for i := range result {
		result[i] = chars[time.Now().UnixNano()%int64(len(chars))]
	}
	return string(result)
}

// Generate mock satellite data
func generateSatelliteData() []Satellite {
	names := []string{
		"ISS (ZARYA)", "HST", "STARLINK-1007", "STARLINK-1008",
		"STARLINK-1009", "STARLINK-1010", "SES-7", "GPS-IIR-M",
	}
	satellites := make([]Satellite, len(names))

	for i, name := range names {
		satellites[i] = Satellite{
			NoradID:   25544 + i,
			Name:      name,
			Latitude:  (float64(i%9) - 4.5) * 20,
			Longitude: (float64(i%18) - 9) * 20,
			Altitude:  400 + float64(i)*1000,
			Velocity:  7.66,
		}
	}

	return satellites
}

func main() {
	// Set Gin mode
	gin.SetMode(gin.ReleaseMode)

	// Create router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.Use(cors.Default())

	// Metrics middleware
	r.Use(func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start).Seconds()

		httpRequestsTotal.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			strconv.Itoa(c.Writer.Status()),
		).Inc()

		httpRequestDuration.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
		).Observe(duration)
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
			"version":   "2.0.0",
			"service":   "clawchan-stream-processor",
		})
	})

	// Prometheus metrics
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes
	api := r.Group("/api/v1")
	{
		// Aircraft endpoints
		api.GET("/aircraft/stream", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"data":  generateAircraftData(),
				"count": 100,
				"time":  time.Now().Unix(),
			})
		})

		// Satellite endpoints
		api.GET("/satellites/stream", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"data":  generateSatelliteData(),
				"count": 8,
				"time":  time.Now().Unix(),
			})
		})
	}

	// WebSocket endpoint
	manager := newClientManager()
	go manager.run()

	// Broadcast data to all clients
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for range ticker.C {
			msg := StreamMessage{
				Type:      "aircraft_update",
				Payload:   generateAircraftData()[:20],
				Timestamp: time.Now().Unix(),
			}

			data, err := json.Marshal(msg)
			if err != nil {
				continue
			}

			manager.broadcast <- data
		}
	}()

	r.GET("/ws", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("WebSocket upgrade error: %v", err)
			return
		}

		client := &Client{
			manager: manager,
			conn:    conn,
			send:    make(chan []byte, 256),
		}

		manager.register <- client

		go client.writePump()
		go client.readPump()
	})

	// Start server
	port := ":8080"
	log.Printf("🚀 Clawchan Stream Processor starting on %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
