async function loadRCAReports() {
    const reports = await apiCall('/rca');
    const rcaList = document.getElementById('rcaList');
    
    const sampleReports = reports || [
        { id: 'RCA001', vehicleId: 'MH12AB1234', date: '2024-01-15', component: 'Engine Cooling System' },
        { id: 'RCA002', vehicleId: 'DL05CD5678', date: '2024-01-14', component: 'Transmission' },
        { id: 'RCA003', vehicleId: 'KA03EF9012', date: '2024-01-13', component: 'Brake System' }
    ];

    rcaList.innerHTML = sampleReports.map(report => `
        <div class="rca-item" onclick="viewRCAReport('${report.id}', '${report.vehicleId}')">
            <strong>${report.id}</strong> - ${report.vehicleId}
            <p>${report.component} | ${report.date}</p>
        </div>
    `).join('');
}

async function viewRCAReport(rcaId, vehicleId) {
    const report = await apiCall(`/rca?vehicleId=${vehicleId}`);
    
    const sampleReport = report || {
        vehicleId: vehicleId,
        rcaId: rcaId,
        date: new Date().toISOString().split('T')[0],
        component: 'Engine Cooling System',
        failureDescription: 'Coolant pump abnormal vibration detected leading to overheating',
        rootCause: 'Bearing wear in coolant pump due to extended operation beyond recommended service interval',
        evidence: [
            'Vibration sensor readings exceeded 4.5 mm/s (threshold: 3.0 mm/s)',
            'Coolant temperature reached 105°C (normal: 85-95°C)',
            'Pump bearing clearance measured at 0.8mm (spec: 0.2-0.4mm)',
            'Service history shows pump not replaced in last 80,000 km'
        ],
        capa: {
            corrective: [
                'Replace coolant pump assembly immediately',
                'Flush and refill cooling system',
                'Inspect radiator and hoses for damage',
                'Test cooling system under load'
            ],
            preventive: [
                'Implement predictive maintenance schedule for coolant pump',
                'Add vibration monitoring to all vehicles',
                'Reduce service interval for cooling system to 60,000 km',
                'Train technicians on early warning signs'
            ]
        },
        manufacturingInsights: [
            'Bearing supplier quality issue identified in batch #2023-Q3',
            'Recommend switching to upgraded bearing specification',
            'Update assembly process to include bearing clearance verification',
            'Implement incoming quality control for pump assemblies'
        ]
    };

    displayRCAReport(sampleReport);
}

function displayRCAReport(report) {
    document.getElementById('rcaReport').style.display = 'block';
    
    document.getElementById('vehicleInfo').innerHTML = `
        <p><strong>Vehicle ID:</strong> ${report.vehicleId}</p>
        <p><strong>RCA ID:</strong> ${report.rcaId}</p>
        <p><strong>Date:</strong> ${report.date}</p>
        <p><strong>Component:</strong> ${report.component}</p>
    `;

    document.getElementById('failureDesc').innerHTML = `
        <p>${report.failureDescription}</p>
    `;

    document.getElementById('rootCause').innerHTML = `
        <p>${report.rootCause}</p>
    `;

    document.getElementById('evidence').innerHTML = `
        <ul>
            ${report.evidence.map(e => `<li>${e}</li>`).join('')}
        </ul>
    `;

    document.getElementById('capa').innerHTML = `
        <h4>Corrective Actions:</h4>
        <ul>
            ${report.capa.corrective.map(a => `<li>${a}</li>`).join('')}
        </ul>
        <h4>Preventive Actions:</h4>
        <ul>
            ${report.capa.preventive.map(a => `<li>${a}</li>`).join('')}
        </ul>
    `;

    document.getElementById('insights').innerHTML = `
        <ul>
            ${report.manufacturingInsights.map(i => `<li>${i}</li>`).join('')}
        </ul>
    `;

    window.currentRCAReport = report;
}

function downloadRCA() {
    const report = window.currentRCAReport;
    if (!report) return;

    const content = `
RCA REPORT
==========

Vehicle ID: ${report.vehicleId}
RCA ID: ${report.rcaId}
Date: ${report.date}
Component: ${report.component}

FAILURE DESCRIPTION
-------------------
${report.failureDescription}

ROOT CAUSE
----------
${report.rootCause}

EVIDENCE
--------
${report.evidence.map((e, i) => `${i + 1}. ${e}`).join('\n')}

CORRECTIVE ACTIONS
------------------
${report.capa.corrective.map((a, i) => `${i + 1}. ${a}`).join('\n')}

PREVENTIVE ACTIONS
------------------
${report.capa.preventive.map((a, i) => `${i + 1}. ${a}`).join('\n')}

MANUFACTURING INSIGHTS
----------------------
${report.manufacturingInsights.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RCA_${report.rcaId}_${report.vehicleId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
