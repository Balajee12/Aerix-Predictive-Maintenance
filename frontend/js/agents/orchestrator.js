class MasterAgent {
    constructor() {
        this.agents = {
            fault: new FaultDetectionAgent(),
            diagnostic: new DiagnosticAgent(),
            scheduler: new SchedulerAgent(),
            voice: null,
            rca: new RCAAgent()
        };
        this.context = {};
    }

    async processRequest(userInput, type = 'text') {
        const intent = this.detectIntent(userInput);
        
        switch(intent) {
            case 'check_vehicle':
                return await this.handleVehicleCheck(userInput);
            case 'schedule_service':
                return await this.handleScheduling(userInput);
            case 'get_diagnosis':
                return await this.handleDiagnosis(userInput);
            case 'rca_request':
                return await this.handleRCA(userInput);
            default:
                return await this.handleGeneral(userInput);
        }
    }

    detectIntent(input) {
        const lower = input.toLowerCase();
        if (lower.includes('check') || lower.includes('status') || lower.includes('health')) {
            return 'check_vehicle';
        }
        if (lower.includes('schedule') || lower.includes('book') || lower.includes('appointment')) {
            return 'schedule_service';
        }
        if (lower.includes('diagnos') || lower.includes('problem') || lower.includes('issue')) {
            return 'get_diagnosis';
        }
        if (lower.includes('rca') || lower.includes('root cause') || lower.includes('analysis')) {
            return 'rca_request';
        }
        return 'general';
    }

    async handleVehicleCheck(input) {
        const vehicleId = this.extractVehicleId(input);
        const faultResult = await this.agents.fault.detectFaults(vehicleId);
        
        if (faultResult.hasFault) {
            const diagnosis = await this.agents.diagnostic.diagnose(faultResult);
            return {
                message: `Vehicle ${vehicleId}: ${diagnosis.summary}. ${diagnosis.recommendation}`,
                data: diagnosis,
                nextAction: 'schedule_service'
            };
        }
        
        return {
            message: `Vehicle ${vehicleId} is operating normally. All systems are healthy.`,
            data: faultResult,
            nextAction: null
        };
    }

    async handleScheduling(input) {
        const vehicleId = this.extractVehicleId(input);
        const slots = await this.agents.scheduler.getAvailableSlots();
        
        return {
            message: `I found ${slots.length} available slots. Would you like to book one?`,
            data: { vehicleId, slots },
            nextAction: 'confirm_booking'
        };
    }

    async handleDiagnosis(input) {
        const vehicleId = this.extractVehicleId(input);
        const faultResult = await this.agents.fault.detectFaults(vehicleId);
        const diagnosis = await this.agents.diagnostic.diagnose(faultResult);
        
        return {
            message: diagnosis.detailedExplanation,
            data: diagnosis,
            nextAction: 'schedule_service'
        };
    }

    async handleRCA(input) {
        const vehicleId = this.extractVehicleId(input);
        const rca = await this.agents.rca.generateRCA(vehicleId);
        
        return {
            message: `RCA Report generated for vehicle ${vehicleId}. Root cause: ${rca.rootCause}`,
            data: rca,
            nextAction: 'view_rca'
        };
    }

    async handleGeneral(input) {
        return {
            message: "I can help you check vehicle health, schedule service, or provide diagnostics. What would you like to do?",
            data: null,
            nextAction: null
        };
    }

    extractVehicleId(input) {
        const match = input.match(/\b[A-Z]{2}\d{2}[A-Z]{2}\d{4}\b/i) || 
                     input.match(/vehicle\s+(\w+)/i);
        return match ? match[0] : 'MH12AB1234';
    }
}

class FaultDetectionAgent {
    async detectFaults(vehicleId) {
        const prediction = await apiCall(`/predict?vehicleId=${vehicleId}`);
        
        return {
            vehicleId,
            hasFault: prediction?.failureProbability > 0.5,
            faultProbability: prediction?.failureProbability || 0,
            component: prediction?.component || 'Unknown',
            telemetry: prediction?.telemetry || {}
        };
    }
}

class DiagnosticAgent {
    async diagnose(faultData) {
        const { component, faultProbability, telemetry } = faultData;
        
        const diagnosticMap = {
            'Engine': 'High temperature and abnormal vibration detected. Possible coolant pump failure or thermostat malfunction.',
            'Transmission': 'Gear shifting delays and fluid pressure drop. Transmission fluid may need replacement.',
            'Brakes': 'Brake pad wear exceeds threshold. Immediate replacement recommended.',
            'Battery': 'Voltage fluctuation detected. Battery health degraded, replacement advised.',
            'Cooling System': 'Coolant temperature rising. Check radiator and coolant levels.'
        };

        const summary = diagnosticMap[component] || 'Component showing abnormal behavior.';
        
        return {
            component,
            summary,
            detailedExplanation: `Analysis shows ${component} has ${(faultProbability * 100).toFixed(1)}% failure probability. ${summary}`,
            recommendation: 'Schedule service within 48 hours to prevent breakdown.',
            severity: faultProbability > 0.7 ? 'high' : 'medium'
        };
    }
}

class SchedulerAgent {
    async getAvailableSlots() {
        const slots = await apiCall('/slots');
        return slots || [];
    }

    async bookSlot(vehicleId, date, time, serviceType) {
        const booking = await apiCall('/book', 'POST', {
            vehicleId, date, time, serviceType
        });
        return booking;
    }
}

class RCAAgent {
    async generateRCA(vehicleId) {
        const rca = await apiCall('/rca', 'POST', { vehicleId });
        return rca || {};
    }
}

const masterAgent = new MasterAgent();
