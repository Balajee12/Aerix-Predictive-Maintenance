let telemetryChart = null;
let componentChart = null;
let historyChart = null;

async function initTelemetryChart() {
    const ctx = document.getElementById('telemetryChart');
    if (!ctx) return;

    const data = await apiCall('/telemetry/live');
    
    telemetryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data?.labels || ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
            datasets: [{
                label: 'Engine Temp (°C)',
                data: data?.temperature || [85, 87, 89, 92, 95, 98, 102],
                borderColor: '#e74c3c',
                tension: 0.4
            }, {
                label: 'RPM (x100)',
                data: data?.rpm || [25, 28, 30, 32, 35, 38, 40],
                borderColor: '#3498db',
                tension: 0.4
            }, {
                label: 'Oil Pressure (PSI)',
                data: data?.oilPressure || [45, 44, 43, 42, 40, 38, 35],
                borderColor: '#f39c12',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });

    setInterval(updateTelemetryChart, 5000);
}

function updateTelemetryChart() {
    if (!telemetryChart) return;
    
    telemetryChart.data.datasets.forEach(dataset => {
        dataset.data.shift();
        dataset.data.push(dataset.data[dataset.data.length - 1] + (Math.random() - 0.5) * 5);
    });
    telemetryChart.update();
}

async function initComponentChart() {
    const ctx = document.getElementById('componentChart');
    if (!ctx) return;

    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get('id');
    const data = await apiCall(`/predict?vehicleId=${vehicleId}`);

    componentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Engine', 'Transmission', 'Brakes', 'Battery', 'Cooling'],
            datasets: [{
                label: 'Risk Score',
                data: data?.componentRisks || [85, 45, 30, 25, 70],
                backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#27ae60', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

async function initHistoryChart() {
    const ctx = document.getElementById('telemetryHistory');
    if (!ctx) return;

    historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Avg Engine Temp',
                data: [82, 84, 86, 88, 91, 95, 99],
                borderColor: '#e74c3c',
                fill: false
            }, {
                label: 'Vibration Level',
                data: [2.1, 2.3, 2.5, 2.8, 3.2, 3.7, 4.2],
                borderColor: '#9b59b6',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

if (document.getElementById('telemetryChart')) {
    initTelemetryChart();
}

if (document.getElementById('componentChart')) {
    initComponentChart();
}

if (document.getElementById('telemetryHistory')) {
    initHistoryChart();
}
