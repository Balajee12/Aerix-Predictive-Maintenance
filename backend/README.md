# Aerix Backend API

Node.js/Express backend for Aerix predictive maintenance system.

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### GET /api/alerts
Returns all vehicle alerts and statistics.

**Response:**
```json
{
  "totalVehicles": 5,
  "activeAlerts": 2,
  "predictedFailures": 2,
  "vehicles": [...]
}
```

### GET /api/predict?vehicleId=XXX
Get prediction for specific vehicle.

**Response:**
```json
{
  "vehicleId": "MH12AB1234",
  "failureProbability": 0.85,
  "component": "Engine",
  "timeToFailure": "2-3 days",
  "risk": "high",
  "recommendations": [...]
}
```

### POST /api/book
Book service appointment.

**Request:**
```json
{
  "vehicleId": "MH12AB1234",
  "date": "2024-01-20",
  "time": "09:00 AM",
  "serviceType": "predictive"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "BK1234567890",
  "message": "Booking confirmed"
}
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `ML_SERVICE_URL`: ML service URL (default: http://localhost:5000)

## Dependencies

- express: Web framework
- cors: CORS middleware
- body-parser: JSON parsing
- axios: HTTP client for ML service
