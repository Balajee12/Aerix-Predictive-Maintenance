# 🚀 Aerix Quick Start Guide

Get Aerix up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js
node --version  # Should be v16+

# Check Python
python --version  # Should be 3.8+

# Check npm
npm --version
```

## Step-by-Step Setup

### 1️⃣ Train ML Model (2 minutes)

```bash
cd ml
pip install -r requirements.txt
python train.py
```

✅ You should see: "Model and scaler saved successfully!"

### 2️⃣ Start ML Service (30 seconds)

```bash
# In ml directory
python inference.py
```

✅ Service running on http://localhost:5000

### 3️⃣ Start Backend (1 minute)

Open a NEW terminal:

```bash
cd backend
npm install
npm start
```

✅ Backend running on http://localhost:3000

### 4️⃣ Open Frontend (30 seconds)

Option A - Direct:
- Open `frontend/index.html` in Chrome/Edge

Option B - Local Server:
```bash
cd frontend
python -m http.server 8080
```
- Visit http://localhost:8080

## 🎯 Test the System

### Test 1: Dashboard
1. Click "View Dashboard"
2. See 5 vehicles with risk scores
3. Check real-time charts

### Test 2: Voice Assistant
1. Click "Talk to AI"
2. Click "🎤 Start Voice"
3. Say: "Check vehicle MH12AB1234"
4. Listen to response

### Test 3: Booking
1. Go to Booking page
2. Select vehicle "MH12AB1234"
3. Pick tomorrow's date
4. Select "09:00 AM"
5. Click "Book Appointment"

### Test 4: RCA Report
1. Go to RCA Reports
2. Click first report
3. View detailed analysis
4. Click "Download PDF"

## 🐛 Troubleshooting

### ML Service won't start?
```bash
cd ml
python train.py  # Generate models first
```

### Backend errors?
```bash
cd backend
npm install  # Reinstall dependencies
```

### Voice not working?
- Use Chrome or Edge browser
- Allow microphone permission
- Check browser console

### Port already in use?
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📊 Expected Output

### ML Training
```
Generating training data...
Generated 200 samples
Failure rate: 35.00%
Training Random Forest model...
Training accuracy: 95.00%
Testing accuracy: 92.50%
Model and scaler saved successfully!
```

### Backend Start
```
Aerix Backend running on http://localhost:3000
API Endpoints:
  GET  /api/alerts
  GET  /api/predict?vehicleId=XXX
  POST /api/book
  ...
```

### ML Service Start
```
Starting ML Inference Service...
Models loaded successfully
Endpoint: POST http://localhost:5000/predict
 * Running on http://0.0.0.0:5000
```

## 🎉 Success Checklist

- [ ] ML model trained (model.pkl exists)
- [ ] ML service running on port 5000
- [ ] Backend running on port 3000
- [ ] Frontend opens in browser
- [ ] Dashboard shows 5 vehicles
- [ ] Voice assistant responds
- [ ] Booking works
- [ ] RCA report displays

## 🆘 Still Having Issues?

1. Check all three services are running
2. Open browser console (F12)
3. Check for error messages
4. Verify ports 3000 and 5000 are free
5. Try restarting all services

## 📞 Quick Commands Reference

```bash
# Start ML Service
cd ml && python inference.py

# Start Backend
cd backend && npm start

# Start Frontend Server
cd frontend && python -m http.server 8080
```

---

**Time to complete**: ~5 minutes
**Difficulty**: Easy
**Browser**: Chrome/Edge recommended

Happy testing! 🚗✨
