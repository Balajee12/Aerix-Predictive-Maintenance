class FaultDetectionAgent {
    constructor() {
        this.thresholds = {
            temperature: { max: 100, critical: 105 },
            rpm: { max: 4000, critical: 4500 },
            oilPressure: { min: 35, critical: 30 },
            batteryVoltage: { min: 12.0, critical: 11.5 },
            vibration: { max: 3.5, critical: 4.5 },
            mileage: { service: 80000, critical: 100000 }
        };
    }

    async detectFaults(vehicleId) {
        const prediction = await apiCall(`/predict?vehicleId=${vehicleId}`);
        
        if (!prediction) {
            return {
                vehicleId,
                hasFault: false,
                faults: [],
                severity: 'none'
            };
        }

        const faults = this.analyzeTelemetry(prediction.telemetry);
        
        return {
            vehicleId,
            hasFault: faults.length > 0 || prediction.failureProbability > 0.5,
            faults,
            faultProbability: prediction.failureProbability,
            component: prediction.component,
            telemetry: prediction.telemetry,
            severity: this.calculateSeverity(faults, prediction.failureProbability)
        };
    }

    analyzeTelemetry(telemetry) {
        const faults = [];

        if (telemetry.temperature > this.thresholds.temperature.critical) {
            faults.push({
                type: 'temperature',
                severity: 'critical',
                message: `Engine temperature critically high: ${telemetry.temperature}°C`,
                value: telemetry.temperature,
                threshold: this.thresholds.temperature.critical
            });
        } else if (telemetry.temperature > this.thresholds.temperature.max) {
            faults.push({
                type: 'temperature',
                severity: 'warning',
                message: `Engine temperature elevated: ${telemetry.temperature}°C`,
                value: telemetry.temperature,
                threshold: this.thresholds.temperature.max
            });
        }

        if (telemetry.vibration > this.thresholds.vibration.critical) {
            faults.push({
                type: 'vibration',
                severity: 'critical',
                message: `Abnormal vibration detected: ${telemetry.vibration} mm/s`,
                value: telemetry.vibration,
                threshold: this.thresholds.vibration.critical
            });
        } else if (telemetry.vibration > this.thresholds.vibration.max) {
            faults.push({
                type: 'vibration',
                severity: 'warning',
                message: `Elevated vibration: ${telemetry.vibration} mm/s`,
                value: telemetry.vibration,
                threshold: this.thresholds.vibration.max
            });
        }

        if (telemetry.oilPressure < this.thresholds.oilPressure.critical) {
            faults.push({
                type: 'oilPressure',
                severity: 'critical',
                message: `Oil pressure critically low: ${telemetry.oilPressure} PSI`,
                value: telemetry.oilPressure,
                threshold: this.thresholds.oilPressure.critical
            });
        } else if (telemetry.oilPressure < this.thresholds.oilPressure.min) {
            faults.push({
                type: 'oilPressure',
                severity: 'warning',
                message: `Oil pressure low: ${telemetry.oilPressure} PSI`,
                value: telemetry.oilPressure,
                threshold: this.thresholds.oilPressure.min
            });
        }

        if (telemetry.batteryVoltage < this.thresholds.batteryVoltage.critical) {
            faults.push({
                type: 'battery',
                severity: 'critical',
                message: `Battery voltage critically low: ${telemetry.batteryVoltage}V`,
                value: telemetry.batteryVoltage,
                threshold: this.thresholds.batteryVoltage.critical
            });
        } else if (telemetry.batteryVoltage < this.thresholds.batteryVoltage.min) {
            faults.push({
                type: 'battery',
                severity: 'warning',
                message: `Battery voltage low: ${telemetry.batteryVoltage}V`,
                value: telemetry.batteryVoltage,
                threshold: this.thresholds.batteryVoltage.min
            });
        }

        return faults;
    }

    calculateSeverity(faults, failureProbability) {
        const hasCritical = faults.some(f => f.severity === 'critical');
        
        if (hasCritical || failureProbability > 0.8) {
            return 'critical';
        } else if (faults.length > 0 || failureProbability > 0.5) {
            return 'warning';
        } else if (failureProbability > 0.3) {
            return 'caution';
        }
        
        return 'normal';
    }
}
