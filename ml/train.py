import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

np.random.seed(42)

def generate_training_data(n_samples=200):
    data = []
    
    for _ in range(n_samples):
        temp = np.random.normal(90, 15)
        rpm = np.random.normal(3000, 800)
        oil_pressure = np.random.normal(40, 10)
        battery_voltage = np.random.normal(12.6, 0.8)
        vibration = np.random.normal(2.5, 1.5)
        mileage = np.random.randint(10000, 100000)
        
        failure_score = 0
        if temp > 100: failure_score += 0.3
        if rpm > 3800: failure_score += 0.2
        if oil_pressure < 35: failure_score += 0.25
        if battery_voltage < 12.0: failure_score += 0.15
        if vibration > 4.0: failure_score += 0.3
        if mileage > 80000: failure_score += 0.2
        
        failure = 1 if failure_score > 0.6 else 0
        
        component = 'Normal'
        if failure:
            if temp > 100 or vibration > 4.0:
                component = 'Engine'
            elif oil_pressure < 35:
                component = 'Transmission'
            elif battery_voltage < 12.0:
                component = 'Battery'
            else:
                component = 'Cooling System'
        
        data.append({
            'temperature': temp,
            'rpm': rpm,
            'oilPressure': oil_pressure,
            'batteryVoltage': battery_voltage,
            'vibration': vibration,
            'mileage': mileage,
            'failure': failure,
            'component': component
        })
    
    return pd.DataFrame(data)

print("Generating training data...")
df = generate_training_data(200)

df.to_csv('training_data.csv', index=False)
print(f"Generated {len(df)} samples")
print(f"Failure rate: {df['failure'].mean():.2%}")

features = ['temperature', 'rpm', 'oilPressure', 'batteryVoltage', 'vibration', 'mileage']
X = df[features]
y = df['failure']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nTraining Random Forest model...")
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train_scaled, y_train)

train_score = model.score(X_train_scaled, y_train)
test_score = model.score(X_test_scaled, y_test)

print(f"Training accuracy: {train_score:.2%}")
print(f"Testing accuracy: {test_score:.2%}")

feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("\nModel and scaler saved successfully!")
print("Files created: model.pkl, scaler.pkl, training_data.csv")
