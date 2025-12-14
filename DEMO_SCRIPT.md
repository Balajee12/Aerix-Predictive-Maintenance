# 🎬 Aerix Demo Script

Complete demonstration script for competition presentation.

## 🎯 Demo Flow (10 minutes)

### Introduction (1 minute)

"Hello! I'm presenting **Aerix** - an Agentic AI Predictive Maintenance system that predicts vehicle failures before they happen and autonomously schedules service appointments through conversational AI."

**Key Points:**
- Predicts failures using ML
- Agentic AI system with multiple specialized agents
- Voice and chat interface
- Autonomous scheduling
- Root cause analysis

---

### Part 1: Dashboard Overview (2 minutes)

**Navigate to Dashboard**

"Let me show you our main dashboard monitoring a fleet of 5 vehicles."

**Point out:**
1. **Vehicle List** - Shows all vehicles with risk indicators
   - Green = Low risk
   - Orange = Medium risk
   - Red = High risk

2. **Real-time Telemetry Chart**
   - Engine temperature
   - RPM
   - Oil pressure
   - Updates every 5 seconds

3. **High Risk Vehicles Table**
   - Vehicle MH12AB1234: 85% failure probability, Engine issue
   - Vehicle TN09GH3456: 78% failure probability, Cooling System

"Notice vehicle MH12AB1234 has a high risk score. Let's investigate."

---

### Part 2: Predictive Analysis (2 minutes)

**Click on vehicle MH12AB1234**

"Here's the detailed predictive analysis for this vehicle."

**Show:**
1. **Failure Probability**: 85% - Very high
2. **Component at Risk**: Engine
3. **Time to Failure**: 2-3 days
4. **Confidence**: 92%

**Component Risk Chart:**
- Engine: 85 (Critical)
- Cooling System: 70 (High)
- Transmission: 45 (Medium)
- Battery: 25 (Low)
- Brakes: 30 (Low)

**Recommendations:**
- Schedule immediate inspection of Engine
- Check coolant levels and pump operation
- Inspect for abnormal vibrations
- Perform diagnostic scan

"Our ML model has detected this vehicle will likely fail within 2-3 days. Now let's see how our AI assistant handles this."

---

### Part 3: Voice & Chat Assistant (3 minutes)

**Navigate to AI Assistant page**

"This is our conversational AI assistant powered by Web Speech API."

**Show features:**
- Animated avatar with pulse effect
- Male/Female voice toggle
- Real-time speech recognition

**Demo Conversation:**

**Option 1 - Voice:**
1. Click "Start Voice"
2. Say: "Check vehicle MH12AB1234"
3. AI responds: "Vehicle MH12AB1234 has 85% failure probability. Engine showing abnormal temperature and vibration. Immediate inspection recommended. Would you like me to schedule a service appointment?"
4. Say: "Yes, schedule service"
5. AI responds: "I found 5 available slots. Would you like to book one?"

**Option 2 - Chat (if voice fails):**
1. Type: "What's the status of vehicle MH12AB1234?"
2. AI analyzes and responds
3. Type: "Schedule service for this vehicle"
4. AI provides booking options

**Highlight:**
- Natural language understanding
- Context awareness
- Multi-turn conversation
- Voice synthesis with gender selection

---

### Part 4: Autonomous Scheduling (1.5 minutes)

**Navigate to Booking page**

"Now let's complete the autonomous booking process."

**Steps:**
1. Vehicle auto-selected: MH12AB1234
2. Select date: Tomorrow
3. Available time slots appear
   - 09:00 AM ✓
   - 11:00 AM ✓
   - 02:00 PM ✓
   - 04:00 PM ✗ (Booked)
   - 05:00 PM ✓

4. Select: 09:00 AM
5. Service type: Predictive Maintenance
6. Click "Book Appointment"

**Confirmation popup appears:**
- Vehicle: MH12AB1234
- Date: [Tomorrow's date]
- Time: 09:00 AM
- Booking ID: BK1234567890
- Confirmation sent to registered contact

"The system has autonomously scheduled the service appointment and sent confirmation."

---

### Part 5: RCA Report (1.5 minutes)

**Navigate to RCA Reports**

"After service, our system generates detailed Root Cause Analysis reports."

**Click on first report**

**Show sections:**

1. **Vehicle Information**
   - Vehicle ID, RCA ID, Date, Component

2. **Failure Description**
   - "Coolant pump abnormal vibration detected leading to overheating"

3. **Root Cause**
   - "Bearing wear in coolant pump due to extended operation beyond recommended service interval"

4. **Evidence & Data**
   - Vibration exceeded 4.5 mm/s (threshold: 3.0)
   - Temperature reached 105°C (normal: 85-95°C)
   - Bearing clearance at 0.8mm (spec: 0.2-0.4mm)
   - Service history shows pump not replaced in 80,000 km

5. **CAPA (Corrective & Preventive Actions)**
   - Corrective: Replace pump, flush system
   - Preventive: Implement predictive maintenance, reduce service interval

6. **Manufacturing Insights**
   - Bearing quality issue in batch #2023-Q3
   - Recommend upgraded bearing specification
   - Update assembly process

**Click "Download PDF"**

"This report can be downloaded and shared with manufacturing teams for continuous improvement."

---

## 🎯 Key Talking Points

### Technical Excellence
- **Pure HTML/CSS/JS** - No frameworks, lightweight
- **Web Speech API** - Native browser capabilities
- **Random Forest ML** - 92% accuracy
- **Agentic Architecture** - Master + 6 Worker Agents
- **Real-time Processing** - Live telemetry monitoring

### Innovation
- **Predictive Maintenance** - Prevent failures before they happen
- **Conversational AI** - Natural interaction
- **Autonomous Scheduling** - No human intervention needed
- **RCA Automation** - Instant root cause analysis
- **Manufacturing Feedback Loop** - Continuous improvement

### Business Impact
- **Reduced Downtime** - Predict failures 2-3 days in advance
- **Cost Savings** - Prevent expensive breakdowns
- **Customer Satisfaction** - Proactive service
- **Data-Driven Insights** - Manufacturing improvements
- **Scalability** - Monitor entire fleet

---

## 🎤 Q&A Preparation

### Q: How accurate is the prediction?
**A:** Our Random Forest model achieves 92% accuracy on test data. In production, we continuously retrain with real failure data to improve accuracy.

### Q: What if voice recognition fails?
**A:** The system has fallback to text chat. Both interfaces connect to the same agentic backend, ensuring consistent experience.

### Q: How does the agent system work?
**A:** We have a Master Agent that routes requests to specialized Worker Agents:
- Fault Detection Agent - Identifies anomalies
- Diagnostic Agent - Determines root cause
- Scheduler Agent - Books appointments
- Voice Agent - Handles conversation
- RCA Agent - Generates reports

### Q: Can this integrate with real vehicles?
**A:** Yes! The system is designed to accept OBD-II data. We're using simulated data for this demo, but the architecture supports real-time vehicle integration.

### Q: What about data privacy?
**A:** All data is processed locally. For production, we'd implement encryption, anonymization, and comply with data protection regulations.

### Q: How scalable is this?
**A:** The architecture is horizontally scalable. Backend and ML services can be containerized and deployed on cloud infrastructure to handle thousands of vehicles.

---

## 🏆 Closing Statement

"Aerix demonstrates how Agentic AI can transform vehicle maintenance from reactive to proactive. By combining predictive ML, conversational AI, and autonomous scheduling, we're not just preventing failures - we're creating a seamless experience that saves time, money, and improves safety.

The system is production-ready with clear paths for:
- Real vehicle integration
- Fleet management scaling
- Manufacturing feedback loops
- Mobile app deployment

Thank you!"

---

## 📋 Pre-Demo Checklist

- [ ] ML service running (port 5000)
- [ ] Backend running (port 3000)
- [ ] Frontend loaded in browser
- [ ] Microphone permission granted
- [ ] Internet connection (for Chart.js CDN)
- [ ] All pages tested
- [ ] Voice working (test beforehand)
- [ ] Charts rendering
- [ ] Booking flow working
- [ ] RCA report displaying

---

## 🎬 Backup Plan

If live demo fails:
1. Have screenshots ready
2. Prepare video recording
3. Walk through architecture diagrams
4. Show code structure
5. Explain agent logic on whiteboard

---

**Demo Duration**: 10 minutes
**Q&A**: 5 minutes
**Total**: 15 minutes

Good luck! 🚀
