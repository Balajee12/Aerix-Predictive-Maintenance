# 🚗 Aerix - Agentic AI Predictive Maintenance System

A complete working prototype of an AI-powered predictive maintenance and autonomous scheduling system for vehicles.

## 🎯 Overview

Aerix uses machine learning to predict vehicle failures before they happen, and employs an agentic AI system to interact with customers via voice/chat and automatically schedule service appointments.

## ✨ Features

### 1. Predictive Maintenance
- Real-time vehicle telemetry monitoring
- ML-based failure prediction (Random Forest)
- Component-level risk assessment
- Time-to-failure estimation
- Visual dashboard with live charts

### 2. Agentic AI System
- **Master Agent**: Orchestrates all worker agents
- **Fault Detection Agent**: Identifies anomalies in telemetry
- **Diagnostic Agent**: Provides root cause analysis
- **Voice Agent**: Handles conversational interactions
- **Scheduler Agent**: Autonomously books service slots
- **RCA Agent**: Generates detailed failure reports

### 3. Voice & Chat Assistant
- Web Speech API integration (no external libraries)
- Male/Female voice selection
- Real-time speech-to-text
- Text-to-speech responses
- Animated avatar with pulse effect
- Natural conversation flow

### 4. Service Booking
- Calendar-based date selection
- Available time slot display
- Automatic booking confirmation
- Service type selection

### 5. RCA Reports
- Root cause analysis
- Evidence collection
- CAPA (Corrective & Preventive Actions)
- Manufacturing insights
- Downloadable reports

## 🏗️ Architecture

```
Vehicle → Telemetry → Data Pipeline → Feature Store 
    → ML Model → Master Agent 
    → Worker Agents (Fault, Diagnostic, Voice, Schedule, RCA)
    → Backend API → Frontend Dashboard
```

See [Architecture Documentation](assets/architecture.md) for detailed diagrams.

## 📁 Project Structure

```
aerix/
├── frontend/
│   ├── index.html              # Landing page
│   ├── pages/
│   │   ├── dashboard.html      # Vehicle fleet dashboard
│   │   ├── vehicle.html        # Vehicle detail page
│   │   ├── voice.html          # Voice & chat assistant
│   │   ├── booking.html        # Service booking
│   │   └── rca.html            # RCA reports
│   ├── css/
│   │   └── styles.css          # Complete styling
│   └── js/
│       ├── main.js             # Core functions
│       ├── chart.js            # Telemetry charts
│       └── agents/
│           ├── orchestrator.js # Master agent
│           ├── voiceAgent.js   # Voice/chat agent
│           ├── schedulerAgent.js # Booking agent
│           └── rcaAgent.js     # RCA agent
├── backend/
│   ├── app.js                  # Express server
│   ├── package.json            # Dependencies
│   └── sample_data.json        # Sample telemetry
├── ml/
│   ├── train.py                # Model training
│   ├── inference.py            # Flask inference service
│   └── requirements.txt        # Python dependencies
├── assets/
│   └── architecture.md         # Architecture diagrams
└── README.md                   # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Python (3.8+)
- Modern web browser (Chrome/Edge recommended for Web Speech API)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install ML Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### Step 3: Train ML Model

```bash
cd ml
python train.py
```

This will generate:
- `model.pkl` - Trained Random Forest model
- `scaler.pkl` - Feature scaler
- `training_data.csv` - Training dataset (200 samples)

### Step 4: Start ML Service

```bash
cd ml
python inference.py
```

ML service will run on `http://localhost:5000`

### Step 5: Start Backend Server

```bash
cd backend
npm start
```

Backend API will run on `http://localhost:3000`

### Step 6: Open Frontend

Open `frontend/index.html` in your browser, or use a local server:

```bash
cd frontend
python -m http.server 8080
```

Then visit `http://localhost:8080`

## 🧪 Testing the System

### 1. Test Dashboard
1. Navigate to Dashboard
2. View vehicle list with risk scores
3. Check real-time telemetry charts
4. View high-risk vehicles table

### 2. Test Prediction
1. Click on any vehicle
2. View detailed prediction analysis
3. Check component risk breakdown
4. Review recommendations

### 3. Test Voice Assistant
1. Go to AI Assistant page
2. Click "Start Voice" button
3. Say: "Check vehicle MH12AB1234"
4. Listen to AI response
5. Try: "Schedule service for this vehicle"
6. Toggle between male/female voice

### 4. Test Chat
1. Type in chat: "What's the status of vehicle MH12AB1234?"
2. AI will analyze and respond
3. Follow conversation flow for booking

### 5. Test Booking
1. Go to Booking page
2. Select vehicle
3. Choose date
4. Select time slot
5. Click "Book Appointment"
6. View confirmation

### 6. Test RCA
1. Go to RCA Reports
2. Click on any report
3. View detailed analysis
4. Download report

## 📊 API Endpoints

### Backend (Port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all vehicle alerts |
| GET | `/api/predict?vehicleId=XXX` | Get prediction for vehicle |
| GET | `/api/telemetry/live` | Get live telemetry data |
| GET | `/api/slots?date=YYYY-MM-DD` | Get available time slots |
| POST | `/api/book` | Book service appointment |
| POST | `/api/rca` | Generate RCA report |
| GET | `/api/rca` | List all RCA reports |
| POST | `/api/feedback` | Submit technician feedback |

### ML Service (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Predict vehicle failure |
| GET | `/health` | Check service health |

## 🤖 Agent System

### Master Agent
- Receives user input (text/voice)
- Detects intent
- Routes to appropriate worker agent
- Maintains conversation context

### Worker Agents

1. **Fault Detection Agent**
   - Analyzes telemetry data
   - Detects anomalies
   - Calculates failure probability

2. **Diagnostic Agent**
   - Identifies root cause
   - Provides detailed explanation
   - Recommends actions

3. **Scheduler Agent**
   - Fetches available slots
   - Books appointments
   - Sends confirmations

4. **Voice Agent**
   - Speech recognition (Web Speech API)
   - Text-to-speech synthesis
   - Gender-based voice selection

5. **RCA Agent**
   - Generates root cause analysis
   - Collects evidence
   - Suggests CAPA

## 🎨 Frontend Features

### Pure HTML/CSS/JS
- No frameworks (React, Vue, Angular)
- Vanilla JavaScript ES6+
- CSS animations (pulse effect)
- Responsive design
- Chart.js for visualization

### Web Speech API
- `webkitSpeechRecognition` for STT
- `SpeechSynthesisUtterance` for TTS
- Voice selection by gender
- Real-time transcription

## 📈 ML Model

### Algorithm
Random Forest Classifier

### Features
- Temperature (°C)
- RPM
- Oil Pressure (PSI)
- Battery Voltage (V)
- Vibration (mm/s)
- Mileage (km)

### Output
- Failure probability (0-1)
- Component at risk
- Time to failure
- Risk level (high/medium/low)
- Recommendations

### Performance
- Training accuracy: ~95%
- Testing accuracy: ~92%

## 🎯 Competition Highlights

### Visual Appeal
- Modern gradient design
- Smooth animations
- Interactive charts
- Responsive layout

### Technical Excellence
- Complete agentic system
- Real ML integration
- Voice/chat capabilities
- End-to-end workflow

### Innovation
- Autonomous scheduling
- Conversational AI
- Predictive maintenance
- RCA automation

## 🔧 Troubleshooting

### Voice not working?
- Use Chrome or Edge browser
- Allow microphone permissions
- Check browser console for errors

### ML service not responding?
- Ensure Python service is running on port 5000
- Check if model.pkl exists
- Run train.py if models are missing

### Backend errors?
- Verify Node.js is installed
- Check if port 3000 is available
- Run `npm install` again

### Charts not displaying?
- Check internet connection (Chart.js CDN)
- Open browser console for errors
- Verify API responses

## 📝 Sample Data

The system includes sample data for 5 vehicles:
- MH12AB1234 (High Risk - Engine)
- DL05CD5678 (Medium Risk - Transmission)
- KA03EF9012 (Low Risk)
- TN09GH3456 (High Risk - Cooling System)
- GJ01IJ7890 (Low Risk)

## 🚀 Future Enhancements

- Real vehicle OBD-II integration
- Mobile app (React Native)
- SMS/Email notifications
- Multi-language support
- Advanced LSTM models
- IoT sensor integration
- Blockchain for service records

## 👥 Team

Built for competition by [Your Team Name]

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- Chart.js for visualization
- Web Speech API for voice
- scikit-learn for ML
- Express.js for backend

---

**Note**: This is a prototype for demonstration purposes. For production use, implement proper authentication, database, error handling, and security measures.

## 📞 Support

For issues or questions, please check:
1. Browser console for errors
2. Backend/ML service logs
3. API endpoint responses
4. Architecture documentation

---

**Built with ❤️ for predictive maintenance innovation**
