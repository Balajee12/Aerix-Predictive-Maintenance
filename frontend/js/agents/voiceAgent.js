class VoiceAgent {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.voices = [];
        this.selectedGender = 'female';
        
        this.initRecognition();
        this.loadVoices();
    }

    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleSpeechInput(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopListening();
        };

        this.recognition.onend = () => {
            this.stopListening();
        };
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        if (this.voices.length === 0) {
            this.synthesis.onvoiceschanged = () => {
                this.voices = this.synthesis.getVoices();
            };
        }
    }

    startListening() {
        if (!this.recognition) return;
        
        this.isListening = true;
        this.recognition.start();
        
        const avatar = document.getElementById('avatar');
        const status = document.getElementById('statusText');
        const micBtn = document.getElementById('micBtn');
        
        if (avatar) avatar.classList.add('listening');
        if (status) status.textContent = 'Listening...';
        if (micBtn) micBtn.textContent = '🎤 Listening...';
    }

    stopListening() {
        this.isListening = false;
        
        const avatar = document.getElementById('avatar');
        const status = document.getElementById('statusText');
        const micBtn = document.getElementById('micBtn');
        
        if (avatar) avatar.classList.remove('listening');
        if (status) status.textContent = 'Ready to assist';
        if (micBtn) micBtn.textContent = '🎤 Start Voice';
    }

    async handleSpeechInput(text) {
        addChatMessage(text, 'user');
        
        const response = await masterAgent.processRequest(text, 'voice');
        
        addChatMessage(response.message, 'agent');
        this.speak(response.message);
        
        if (response.nextAction === 'schedule_service') {
            setTimeout(() => {
                const followUp = "Would you like me to schedule a service appointment?";
                addChatMessage(followUp, 'agent');
                this.speak(followUp);
            }, 2000);
        }
    }

    speak(text) {
        if (!this.synthesis) return;

        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        const voice = this.voices.find(v => 
            this.selectedGender === 'female' 
                ? v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha')
                : v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel')
        );
        
        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.synthesis.speak(utterance);
    }

    setGender(gender) {
        this.selectedGender = gender;
    }
}

let voiceAgent = null;

function initVoiceAssistant() {
    voiceAgent = new VoiceAgent();
    masterAgent.agents.voice = voiceAgent;

    const micBtn = document.getElementById('micBtn');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const voiceGender = document.getElementById('voiceGender');

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            if (voiceAgent.isListening) {
                voiceAgent.stopListening();
            } else {
                voiceAgent.startListening();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => sendMessage());
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    if (voiceGender) {
        voiceGender.addEventListener('change', (e) => {
            voiceAgent.setGender(e.target.value);
        });
    }

    // Add event listeners for chat actions
    const clearChatBtn = document.getElementById('clearChat');
    const exportChatBtn = document.getElementById('exportChat');
    
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    
    if (exportChatBtn) {
        exportChatBtn.addEventListener('click', exportChat);
    }

    addChatMessage("Hello! I'm your AI assistant. I can help you check vehicle health, schedule service, or provide diagnostics. How can I assist you today?", 'agent');
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    input.value = '';
    addChatMessage(text, 'user');
    
    const response = await masterAgent.processRequest(text, 'text');
    addChatMessage(response.message, 'agent');
    
    if (voiceAgent) {
        voiceAgent.speak(response.message);
    }
}

function addChatMessage(text, sender) {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function exportChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;
    
    const messages = chatWindow.querySelectorAll('.chat-bubble');
    let chatContent = 'AERIX AI Assistant - Chat Export\n';
    chatContent += '================================\n\n';
    
    messages.forEach((message, index) => {
        const sender = message.classList.contains('user') ? 'User' : 'AI Assistant';
        const timestamp = new Date().toLocaleString();
        chatContent += `[${timestamp}] ${sender}: ${message.textContent}\n\n`;
    });
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aerix-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function clearChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;
    
    const messages = chatWindow.querySelectorAll('.chat-bubble');
    messages.forEach(message => message.remove());
    
    // Add welcome message back
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <div class="welcome-avatar">🤖</div>
        <div class="welcome-text">
            <h3>Hello! I'm your AI Assistant</h3>
            <p>I can help you with vehicle diagnostics, scheduling, and more. Try saying:</p>
            <ul class="suggestion-list">
                <li>"Check vehicle MH12AB1234"</li>
                <li>"Schedule service for my vehicle"</li>
                <li>"What's the status of my fleet?"</li>
            </ul>
        </div>
    `;
    chatWindow.appendChild(welcomeDiv);
}
