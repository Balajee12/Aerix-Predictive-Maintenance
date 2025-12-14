class DiagnosticAgent {
    constructor() {
        this.knowledgeBase = {
            'Engine': {
                symptoms: ['high temperature', 'abnormal vibration', 'power loss'],
                causes: [
                    'Coolant pump failure',
                    'Thermostat malfunction',
                    'Radiator blockage',
                    'Engine bearing wear',
                    'Piston ring damage'
                ],
                diagnosticSteps: [
                    'Check coolant level and quality',
                    'Inspect coolant pump operation',
                    'Test thermostat functionality',
                    'Examine radiator for blockages',
                    'Perform compression test'
                ]
            },
            'Transmission': {
                symptoms: ['gear shifting delays', 'fluid pressure drop', 'unusual noise'],
                causes: [
                    'Transmission fluid degradation',
                    'Clutch wear',
                    'Solenoid failure',
                    'Torque converter issues'
                ],
                diagnosticSteps: [
                    'Check transmission fluid level and condition',
                    'Test solenoid operation',
                    'Inspect clutch plates',
                    'Scan for transmission codes'
                ]
            },
            'Battery': {
                symptoms: ['voltage fluctuation', 'slow cranking', 'electrical issues'],
                causes: [
                    'Battery cell degradation',
                    'Alternator failure',
                    'Parasitic drain',
                    'Corroded terminals'
                ],
                diagnosticSteps: [
                    'Load test battery',
                    'Test alternator output',
                    'Check for parasitic drain',
                    'Inspect terminals and connections'
                ]
            },
            'Cooling System': {
                symptoms: ['overheating', 'coolant loss', 'temperature spikes'],
                causes: [
                    'Coolant pump bearing wear',
                    'Radiator leak',
                    'Thermostat stuck',
                    'Fan clutch failure'
                ],
                diagnosticSteps: [
                    'Pressure test cooling system',
                    'Inspect pump for leaks and noise',
                    'Check thermostat operation',
                    'Test fan clutch engagement'
                ]
            },
            'Brakes': {
                symptoms: ['pad wear', 'reduced stopping power', 'noise'],
                causes: [
                    'Brake pad wear beyond limit',
                    'Rotor damage',
                    'Caliper seizure',
                    'Brake fluid contamination'
                ],
                diagnosticSteps: [
                    'Measure pad thickness',
                    'Inspect rotors for scoring',
                    'Test caliper operation',
                    'Check brake fluid condition'
                ]
            }
        };
    }

    async diagnose(faultData) {
        const { component, faultProbability, telemetry, faults } = faultData;
        
        const componentInfo = this.knowledgeBase[component] || this.knowledgeBase['Engine'];
        
        const primaryCause = this.identifyPrimaryCause(component, telemetry, faults);
        const secondaryCauses = this.identifySecondaryCauses(component, telemetry);
        
        const summary = this.generateSummary(component, primaryCause, faultProbability);
        const detailedExplanation = this.generateDetailedExplanation(
            component, 
            primaryCause, 
            faults, 
            telemetry
        );
        
        const recommendation = this.generateRecommendation(faultProbability, component);
        const diagnosticPlan = componentInfo.diagnosticSteps;
        
        return {
            component,
            primaryCause,
            secondaryCauses,
            summary,
            detailedExplanation,
            recommendation,
            diagnosticPlan,
            severity: faultProbability > 0.7 ? 'high' : faultProbability > 0.4 ? 'medium' : 'low',
            urgency: this.calculateUrgency(faultProbability, faults),
            estimatedRepairTime: this.estimateRepairTime(component, faultProbability),
            estimatedCost: this.estimateCost(component, faultProbability)
        };
    }

    identifyPrimaryCause(component, telemetry, faults) {
        const componentInfo = this.knowledgeBase[component];
        if (!componentInfo) return 'Unknown component issue';

        if (component === 'Engine') {
            if (telemetry.temperature > 100 && telemetry.vibration > 4.0) {
                return 'Coolant pump bearing failure causing overheating and vibration';
            } else if (telemetry.temperature > 100) {
                return 'Cooling system malfunction - likely thermostat or radiator issue';
            } else if (telemetry.vibration > 4.0) {
                return 'Engine bearing wear or mounting issue';
            }
        } else if (component === 'Transmission') {
            if (telemetry.oilPressure < 35) {
                return 'Transmission fluid pressure loss - pump or solenoid failure';
            }
        } else if (component === 'Battery') {
            if (telemetry.batteryVoltage < 12.0) {
                return 'Battery cell degradation or alternator failure';
            }
        }

        return componentInfo.causes[0];
    }

    identifySecondaryCauses(component, telemetry) {
        const componentInfo = this.knowledgeBase[component];
        if (!componentInfo) return [];
        
        return componentInfo.causes.slice(1, 3);
    }

    generateSummary(component, cause, probability) {
        return `${component} showing ${(probability * 100).toFixed(1)}% failure probability. ${cause}.`;
    }

    generateDetailedExplanation(component, cause, faults, telemetry) {
        let explanation = `Analysis of ${component} indicates: ${cause}.\n\n`;
        
        explanation += 'Evidence:\n';
        if (faults && faults.length > 0) {
            faults.forEach(fault => {
                explanation += `- ${fault.message}\n`;
            });
        }
        
        explanation += '\nTelemetry readings:\n';
        for (const [key, value] of Object.entries(telemetry)) {
            explanation += `- ${key}: ${value}\n`;
        }
        
        return explanation;
    }

    generateRecommendation(probability, component) {
        if (probability > 0.8) {
            return `URGENT: Schedule immediate service for ${component}. Vehicle should not be operated until inspected.`;
        } else if (probability > 0.6) {
            return `Schedule service within 24-48 hours to prevent ${component} failure and potential breakdown.`;
        } else if (probability > 0.4) {
            return `Schedule service within 1 week. Monitor ${component} closely for any changes.`;
        } else {
            return `Continue regular maintenance schedule. ${component} is within acceptable parameters.`;
        }
    }

    calculateUrgency(probability, faults) {
        const hasCritical = faults && faults.some(f => f.severity === 'critical');
        
        if (hasCritical || probability > 0.8) {
            return 'immediate';
        } else if (probability > 0.6) {
            return 'high';
        } else if (probability > 0.4) {
            return 'medium';
        }
        return 'low';
    }

    estimateRepairTime(component, probability) {
        const baseTime = {
            'Engine': '4-6 hours',
            'Transmission': '3-5 hours',
            'Battery': '1-2 hours',
            'Cooling System': '2-4 hours',
            'Brakes': '2-3 hours'
        };
        
        return baseTime[component] || '2-4 hours';
    }

    estimateCost(component, probability) {
        const baseCost = {
            'Engine': '$800-$1500',
            'Transmission': '$600-$1200',
            'Battery': '$150-$300',
            'Cooling System': '$400-$800',
            'Brakes': '$300-$600'
        };
        
        return baseCost[component] || '$400-$800';
    }
}
