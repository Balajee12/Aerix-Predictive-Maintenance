const API_BASE = 'http://localhost:3000/api';

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

async function loadHomeStats() {
    const alerts = await apiCall('/alerts');
    if (alerts) {
        document.getElementById('totalVehicles').textContent = alerts.totalVehicles || 0;
        document.getElementById('activeAlerts').textContent = alerts.activeAlerts || 0;
        document.getElementById('predictedFailures').textContent = alerts.predictedFailures || 0;
    }
}

async function loadDashboard() {
    const alerts = await apiCall('/alerts');
    if (!alerts) return;

    const vehicleList = document.getElementById('vehicleList');
    const riskTableBody = document.getElementById('riskTableBody');
    const vehicleCount = document.getElementById('vehicleCount');
    const riskCount = document.getElementById('riskCount');
    const totalPredictions = document.getElementById('totalPredictions');
    
    if (alerts.vehicles) {
        // Update vehicle count
        if (vehicleCount) vehicleCount.textContent = alerts.vehicles.length;
        
        // Update vehicle list with glassmorphic design
        vehicleList.innerHTML = alerts.vehicles.map(v => `
            <div class="vehicle-item" onclick="viewVehicle('${v.id}')">
                <div class="vehicle-info">
                    <div class="vehicle-id">${v.id}</div>
                    <div class="vehicle-component">${v.component || 'All systems normal'}</div>
                </div>
                <div class="risk-badge ${v.risk}">${v.risk.toUpperCase()}</div>
            </div>
        `).join('');

        const highRisk = alerts.vehicles.filter(v => v.risk === 'high' || v.risk === 'medium');
        
        // Update risk count
        if (riskCount) riskCount.textContent = highRisk.length;
        
        // Update predictions count
        if (totalPredictions) totalPredictions.textContent = alerts.vehicles.length * 24; // Simulated daily predictions
        
        // Update risk table with glassmorphic design
        riskTableBody.innerHTML = highRisk.map(v => `
            <tr>
                <td>${v.id}</td>
                <td><span class="risk-badge ${v.risk}">${(v.failureProbability * 100).toFixed(1)}%</span></td>
                <td>${v.component}</td>
                <td>${v.timeToFailure}</td>
                <td><span class="status-indicator ${v.risk}">${v.risk === 'high' ? 'Critical' : 'Warning'}</span></td>
                <td><button class="action-btn" onclick="bookService('${v.id}')">Schedule</button></td>
            </tr>
        `).join('');
    }

    if (alerts.activeAlerts > 0) {
        const banner = document.getElementById('alertBanner');
        if (banner) {
            document.getElementById('alertText').textContent = 
                `${alerts.activeAlerts} vehicles require immediate attention`;
            banner.style.display = 'flex';
        }
    }
}

function viewVehicle(vehicleId) {
    window.location.href = `vehicle.html?id=${vehicleId}`;
}

function bookService(vehicleId) {
    window.location.href = `booking.html?vehicle=${vehicleId}`;
}

function dismissAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}

async function loadVehicleDetails() {
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get('id');
    
    if (!vehicleId) return;

    const prediction = await apiCall(`/predict?vehicleId=${vehicleId}`);
    if (!prediction) return;

    document.getElementById('vehicleTitle').textContent = `Vehicle ${vehicleId}`;
    
    const riskBadge = document.getElementById('riskBadge');
    riskBadge.textContent = prediction.risk.toUpperCase();
    riskBadge.className = `risk-badge ${prediction.risk}`;

    const predictionDetails = document.getElementById('predictionDetails');
    predictionDetails.innerHTML = `
        <p><strong>Failure Probability:</strong> ${(prediction.failureProbability * 100).toFixed(1)}%</p>
        <p><strong>Component at Risk:</strong> ${prediction.component}</p>
        <p><strong>Time to Failure:</strong> ${prediction.timeToFailure}</p>
        <p><strong>Confidence:</strong> ${(prediction.confidence * 100).toFixed(1)}%</p>
    `;

    const recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = prediction.recommendations.map(r => 
        `<div class="vehicle-item">• ${r}</div>`
    ).join('');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('show');
}
