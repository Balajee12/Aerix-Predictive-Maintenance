const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;
const ML_SERVICE_URL = 'http://localhost:5000';

app.use(cors());
app.use(bodyParser.json());

const sampleVehicles = [
    { id: 'MH12AB1234', risk: 'high', failureProbability: 0.85, component: 'Engine', timeToFailure: '2-3 days' },
    { id: 'DL05CD5678', risk: 'medium', failureProbability: 0.55, component: 'Transmission', timeToFailure: '7-10 days' },
    { id: 'KA03EF9012', risk: 'low', failureProbability: 0.15, component: null, timeToFailure: '30+ days' },
    { id: 'TN09GH3456', risk: 'high', failureProbability: 0.78, component: 'Cooling System', timeToFailure: '3-5 days' },
    { id: 'GJ01IJ7890', risk: 'low', failureProbability: 0.22, component: null, timeToFailure: '30+ days' }
];

app.get('/api/alerts', (req, res) => {
    const highRisk = sampleVehicles.filter(v => v.risk === 'high' || v.risk === 'medium');
    
    res.json({
        totalVehicles: sampleVehicles.length,
        activeAlerts: highRisk.length,
        predictedFailures: sampleVehicles.filter(v => v.risk === 'high').length,
        vehicles: sampleVehicles
    });
});

app.get('/api/predict', async (req, res) => {
    const { vehicleId } = req.query;
    
    try {
        const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
            vehicleId,
            telemetry: {
                temperature: 98,
                rpm: 3500,
                oilPressure: 35,
                batteryVoltage: 12.2,
                vibration: 4.2,
                mileage: 75000
            }
        });
        
        res.json(mlResponse.data);
    } catch (error) {
        const vehicle = sampleVehicles.find(v => v.id === vehicleId) || sampleVehicles[0];
        
        res.json({
            vehicleId,
            failureProbability: vehicle.failureProbability,
            component: vehicle.component || 'Engine',
            timeToFailure: vehicle.timeToFailure,
            risk: vehicle.risk,
            confidence: 0.92,
            telemetry: {
                temperature: 98,
                rpm: 3500,
                oilPressure: 35,
                batteryVoltage: 12.2,
                vibration: 4.2
            },
            componentRisks: [85, 45, 30, 25, 70],
            recommendations: [
                'Schedule immediate inspection of ' + (vehicle.component || 'Engine'),
                'Check coolant levels and pump operation',
                'Inspect for abnormal vibrations',
                'Perform diagnostic scan for error codes'
            ]
        });
    }
});

app.get('/api/telemetry/live', (req, res) => {
    res.json({
        labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
        temperature: [85, 87, 89, 92, 95, 98, 102],
        rpm: [25, 28, 30, 32, 35, 38, 40],
        oilPressure: [45, 44, 43, 42, 40, 38, 35]
    });
});

app.get('/api/slots', (req, res) => {
    const { date } = req.query;
    
    res.json([
        { time: '09:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '04:00 PM', available: false },
        { time: '05:00 PM', available: true }
    ]);
});

app.post('/api/book', (req, res) => {
    const { vehicleId, date, time, serviceType } = req.body;
    
    res.json({
        success: true,
        bookingId: 'BK' + Date.now(),
        vehicleId,
        date,
        time,
        serviceType,
        message: 'Booking confirmed successfully'
    });
});

app.post('/api/rca', (req, res) => {
    const { vehicleId } = req.body;
    
    res.json({
        vehicleId,
        rcaId: 'RCA' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        component: 'Engine Cooling System',
        rootCause: 'Coolant pump bearing wear due to extended operation beyond service interval',
        failureDescription: 'Abnormal vibration and overheating detected',
        evidence: [
            'Vibration exceeded 4.5 mm/s',
            'Temperature reached 105°C',
            'Bearing clearance at 0.8mm'
        ],
        capa: {
            corrective: ['Replace coolant pump', 'Flush cooling system'],
            preventive: ['Implement predictive maintenance', 'Reduce service interval']
        },
        manufacturingInsights: [
            'Bearing quality issue in batch #2023-Q3',
            'Upgrade bearing specification recommended'
        ]
    });
});

app.get('/api/rca', (req, res) => {
    res.json([
        { id: 'RCA001', vehicleId: 'MH12AB1234', date: '2024-01-15', component: 'Engine Cooling System' },
        { id: 'RCA002', vehicleId: 'DL05CD5678', date: '2024-01-14', component: 'Transmission' }
    ]);
});

app.post('/api/feedback', (req, res) => {
    const { vehicleId, technicianNotes, resolved } = req.body;
    
    res.json({
        success: true,
        message: 'Feedback recorded',
        feedbackId: 'FB' + Date.now()
    });
});

app.listen(PORT, () => {
    console.log(`Aerix Backend running on http://localhost:${PORT}`);
    console.log('API Endpoints:');
    console.log('  GET  /api/alerts');
    console.log('  GET  /api/predict?vehicleId=XXX');
    console.log('  GET  /api/telemetry/live');
    console.log('  GET  /api/slots?date=YYYY-MM-DD');
    console.log('  POST /api/book');
    console.log('  POST /api/rca');
    console.log('  GET  /api/rca');
    console.log('  POST /api/feedback');
});
