# Aerix ML Service

Machine Learning service for vehicle failure prediction.

## Setup

```bash
pip install -r requirements.txt
```

## Training

```bash
python train.py
```

This generates:
- `model.pkl` - Trained Random Forest model
- `scaler.pkl` - Feature scaler
- `training_data.csv` - Training dataset

## Running Inference Service

```bash
python inference.py
```

Service runs on `http://localhost:5000`

## API

### POST /predict

Predict vehicle failure probability.

**Request:**
```json
{
  "vehicleId": "MH12AB1234",
  "telemetry": {
    "temperature": 98,
    "rpm": 3500,
    "oilPressure": 35,
    "batteryVoltage": 12.2,
    "vibration": 4.2,
    "mileage": 75000
  }
}
```

**Response:**
```json
{
  "vehicleId": "MH12AB1234",
  "failureProbability": 0.85,
  "prediction": 1,
  "component": "Engine",
  "timeToFailure": "2-3 days",
  "risk": "high",
  "confidence": 0.92,
  "recommendations": [...]
}
```

### GET /health

Check service health.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true
}
```

## Model Details

- **Algorithm**: Random Forest Classifier
- **Features**: 6 (temperature, rpm, oil pressure, battery voltage, vibration, mileage)
- **Training samples**: 200
- **Accuracy**: ~92%

## Feature Importance

1. Temperature
2. Vibration
3. Oil Pressure
4. Mileage
5. Battery Voltage
6. RPM
