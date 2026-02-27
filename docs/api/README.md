# Clawchan API Documentation

## Overview

The Clawchan API provides programmatic access to real-time intelligence data including aircraft tracking, satellite monitoring, disaster alerts, and more.

## Base URL

```
Production: https://api.clawchan.io/v2
Staging: https://api-staging.clawchan.io/v2
Local: http://localhost:8080/v2
```

## Authentication

All API requests require authentication using a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.clawchan.io/v2/aircraft
```

## Rate Limiting

- **Free Tier**: 100 requests/minute
- **Pro Tier**: 1,000 requests/minute
- **Enterprise**: 10,000 requests/minute

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Aircraft Tracking

#### GET /aircraft

Returns all aircraft currently being tracked.

**Query Parameters:**
- `lat` (number): Center latitude
- `lon` (number): Center longitude
- `radius` (number): Search radius in nautical miles (default: 50)
- `limit` (number): Maximum results (default: 100, max: 1000)

**Response:**
```json
{
  "data": [
    {
      "icao24": "a1b2c3",
      "callsign": "UAL247",
      "lat": 40.7128,
      "lon": -74.0060,
      "altitude": 35000,
      "speed": 487,
      "heading": 247,
      "lastContact": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 8472,
    "returned": 100
  }
}
```

#### GET /aircraft/:icao24

Returns detailed information for a specific aircraft.

**Response:**
```json
{
  "icao24": "a1b2c3",
  "callsign": "UAL247",
  "originCountry": "United States",
  "lat": 40.7128,
  "lon": -74.0060,
  "altitude": 35000,
  "speed": 487,
  "heading": 247,
  "verticalRate": 0,
  "squawk": "7421",
  "lastContact": "2024-01-15T10:30:00Z"
}
```

#### POST /predict

Predicts aircraft trajectory using ML models.

**Request Body:**
```json
{
  "icao24": "a1b2c3",
  "lat": 40.7128,
  "lon": -74.0060,
  "altitude": 35000,
  "speed": 487,
  "heading": 247
}
```

**Response:**
```json
{
  "icao24": "a1b2c3",
  "predictedPositions": [
    {
      "lat": 40.7500,
      "lon": -73.9800,
      "altitude": 35000,
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ],
  "confidence": 0.94,
  "computationTimeMs": 12.4
}
```

### Satellite Tracking

#### GET /satellites

Returns all tracked satellites.

**Query Parameters:**
- `category` (string): Filter by category (iss, gps, starlink, etc.)
- `visible` (boolean): Only visible satellites
- `lat` (number): Observer latitude (required if visible=true)
- `lon` (number): Observer longitude (required if visible=true)

**Response:**
```json
{
  "data": [
    {
      "noradId": "25544",
      "name": "ISS (ZARYA)",
      "lat": 51.5074,
      "lon": -0.1278,
      "altitude": 408,
      "velocity": 7.66,
      "category": "iss"
    }
  ]
}
```

### Disaster Monitoring

#### GET /disasters

Returns active disaster events.

**Query Parameters:**
- `type` (string): Filter by type (earthquake, wildfire, flood, etc.)
- `severity` (string): Filter by severity (low, moderate, high, critical)
- `country` (string): Filter by country code

**Response:**
```json
{
  "data": [
    {
      "id": "eq-2024-001",
      "type": "earthquake",
      "severity": "high",
      "magnitude": 7.2,
      "location": {
        "lat": 35.6762,
        "lon": 139.6503
      },
      "depth": 10,
      "tsunamiRisk": true,
      "affectedPopulation": 5000000
    }
  ]
}
```

## WebSocket API

For real-time updates, connect to our WebSocket endpoint:

```javascript
const ws = new WebSocket('wss://api.clawchan.io/ws')

ws.onopen = () => {
  // Subscribe to aircraft updates
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'aircraft' }))
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('New aircraft data:', data)
}
```

## GraphQL API

Access the GraphQL playground at: `https://api.clawchan.io/graphql/playground`

Example query:

```graphql
query GetAircraftWithinRadius($lat: Float!, $lon: Float!, $radius: Float!) {
  aircraftWithinRadius(lat: $lat, lon: $lon, radius: $radius) {
    icao24
    callsign
    lat
    lon
    altitude
    speed
    heading
  }
}
```

## Error Handling

All errors follow the standard format:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded the rate limit. Please try again later.",
    "details": {
      "limit": 100,
      "reset": 1640995200
    }
  }
}
```

## SDKs

Official SDKs are available for:

- [JavaScript/TypeScript](https://github.com/clawchan/clawchan-js)
- [Python](https://github.com/clawchan/clawchan-python)
- [Go](https://github.com/clawchan/clawchan-go)
- [Rust](https://github.com/clawchan/clawchan-rust)

## Support

For API support, contact: api-support@clawchan.io
