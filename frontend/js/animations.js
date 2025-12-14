// Enhanced animations for glassmorphic UI
function initAnimations() {
    // Parallax effect for background elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body::before');
        if (parallax) {
            const speed = scrolled * 0.5;
            document.body.style.backgroundPosition = `0 ${speed}px`;
        }
    });

    // Feature cards hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Add ripple effect
            createRipple(card);
            
            // Animate other cards
            featureCards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'scale(0.95)';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            // Reset other cards
            featureCards.forEach((otherCard) => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1)';
            });
        });
    });

    // Workflow step animations
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }, index * 200);
            }
        });
    });

    workflowSteps.forEach(step => observer.observe(step));

    // Stats counter animation
    animateCounters();

    // Vehicle sensor pulse effect
    initSensorAnimations();

    // Navigation glow effect
    initNavEffects();
}

function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        margin-left: -50px;
        margin-top: -50px;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent) || 0;
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function initSensorAnimations() {
    const sensors = document.querySelectorAll('.sensor');
    
    sensors.forEach((sensor, index) => {
        // Random pulse intervals for more realistic effect
        const interval = 1500 + (index * 300);
        
        setInterval(() => {
            sensor.style.filter = 'drop-shadow(0 0 20px currentColor) brightness(1.5)';
            setTimeout(() => {
                sensor.style.filter = 'drop-shadow(0 0 10px currentColor) brightness(1)';
            }, 200);
        }, interval);
    });

    // Data flow animation
    const dataFlows = document.querySelectorAll('.data-flow');
    dataFlows.forEach(flow => {
        flow.style.strokeDasharray = '10 5';
        flow.style.strokeDashoffset = '0';
        
        setInterval(() => {
            flow.style.strokeDashoffset = '30';
            setTimeout(() => {
                flow.style.strokeDashoffset = '0';
            }, 1000);
        }, 3000);
    });
}

function initNavEffects() {
    const nav = document.querySelector('.glass-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.15)';
            nav.style.boxShadow = '0 8px 32px rgba(0, 255, 255, 0.3)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.1)';
            nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }
    });

    // Add click ripple effect to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const rect = link.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: 20px;
                height: 20px;
                left: ${e.clientX - rect.left - 10}px;
                top: ${e.clientY - rect.top - 10}px;
                pointer-events: none;
            `;
            
            link.style.position = 'relative';
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .feature-card {
        animation: float 6s ease-in-out infinite;
    }
    
    .feature-card:nth-child(2) { animation-delay: -2s; }
    .feature-card:nth-child(3) { animation-delay: -4s; }
    .feature-card:nth-child(4) { animation-delay: -1s; }
    .feature-card:nth-child(5) { animation-delay: -3s; }
`;

document.head.appendChild(style);

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}