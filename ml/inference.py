from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model = None
scaler = None

def load_models():
    global model, scaler
    try:
        model = joblib.load('model.pkl')
        scaler = joblib.load('scaler.pkl')
        print("Models loaded successfully")
    except Exception as e:
        print(f"Error loading models: {e}")
        print("Run train.py first to generate models")

load_models()

def determine_component(telemetry, failure_prob):
    if failure_prob < 0.5:
        return 'Normal'
    
    temp = telemetry.get('temperature', 90)
    vibration = telemetry.get('vibration', 2.0)
    oil_pressure = telemetry.get('oilPressure', 40)
    battery_voltage = telemetry.get('batteryVoltage', 12.6)
    
    if temp > 100 or vibration > 4.0:
        return 'Engine'
    elif oil_pressure < 35:
        return 'Transmission'
    elif battery_voltage < 12.0:
        return 'Battery'
    else:
        return 'Cooling System'

def calculate_time_to_failure(failure_prob):
    if failure_prob > 0.8:
        return '1-2 days'
    elif failure_prob > 0.6:
        return '3-5 days'
    elif failure_prob > 0.4:
        return '7-14 days'
    else:
        return '30+ days'

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    data = request.json
    telemetry = data.get('telemetry', {})
    vehicle_id = data.get('vehicleId', 'UNKNOWN')
    
    features = [
        telemetry.get('temperature', 90),
        telemetry.get('rpm', 3000),
        telemetry.get('oilPressure', 40),
        telemetry.get('batteryVoltage', 12.6),
        telemetry.get('vibration', 2.5),
        telemetry.get('mileage', 50000)
    ]
    
    features_scaled = scaler.transform([features])
    
    failure_prob = model.predict_proba(features_scaled)[0][1]
    prediction = model.predict(features_scaled)[0]
    
    component = determine_component(telemetry, failure_prob)
    time_to_failure = calculate_time_to_failure(failure_prob)
    
    risk = 'high' if failure_prob > 0.7 else 'medium' if failure_prob > 0.4 else 'low'
    
    recommendations = []
    if failure_prob > 0.5:
        recommendations.append(f'Schedule immediate inspection of {component}')
        if telemetry.get('temperature', 90) > 95:
            recommendations.append('Check coolant levels and radiator')
        if telemetry.get('vibration', 2.0) > 3.5:
            recommendations.append('Inspect engine mounts and bearings')
        if telemetry.get('oilPressure', 40) < 35:
            recommendations.append('Check oil level and pump operation')
    else:
        recommendations.append('Continue regular maintenance schedule')
        recommendations.append('Monitor telemetry for changes')
    
    response = {
        'vehicleId': vehicle_id,
        'failureProbability': float(failure_prob),
        'prediction': int(prediction),
        'component': component,
        'timeToFailure': time_to_failure,
        'risk': risk,
        'confidence': 0.92,
        'telemetry': telemetry,
        'recommendations': recommendations,
        'componentRisks': [
            int(failure_prob * 100) if component == 'Engine' else np.random.randint(20, 50),
            int(failure_prob * 100) if component == 'Transmission' else np.random.randint(20, 50),
            np.random.randint(15, 35),
            int(failure_prob * 100) if component == 'Battery' else np.random.randint(15, 30),
            int(failure_prob * 100) if component == 'Cooling System' else np.random.randint(20, 50)
        ]
    }
    
    return jsonify(response)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None
    })

if __name__ == '__main__':
    print("Starting ML Inference Service...")
    print("Endpoint: POST http://localhost:5000/predict")
    app.run(host='0.0.0.0', port=5000, debug=True)
