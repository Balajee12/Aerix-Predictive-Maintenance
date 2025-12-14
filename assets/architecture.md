# Aerix System Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Vehicle Layer"
        V1[Vehicle 1]
        V2[Vehicle 2]
        V3[Vehicle N]
    end
    
    subgraph "Data Collection"
        T[Telematics Gateway]
        V1 --> T
        V2 --> T
        V3 --> T
    end
    
    subgraph "Data Pipeline"
        DP[Data Processor]
        FS[Feature Store]
        T --> DP
        DP --> FS
    end
    
    subgraph "ML Layer"
        ML[ML Model Service]
        FS --> ML
    end
    
    subgraph "Agent System"
        MA[Master Agent]
        FA[Fault Detection Agent]
        DA[Diagnostic Agent]
        SA[Scheduler Agent]
        VA[Voice Agent]
        RA[RCA Agent]
        
        ML --> MA
        MA --> FA
        MA --> DA
        MA --> SA
        MA --> VA
        MA --> RA
    end
    
    subgraph "Backend Services"
        API[REST API]
        DB[(Database)]
        
        MA --> API
        API --> DB
    end
    
    subgraph "Frontend"
        UI[Web Dashboard]
        VOICE[Voice Interface]
        CHAT[Chat Interface]
        
        API --> UI
        API --> VOICE
        API --> CHAT
    end
    
    subgraph "External Systems"
        SMS[SMS Gateway]
        EMAIL[Email Service]
        CAL[Calendar System]
        
        SA --> SMS
        SA --> EMAIL
        SA --> CAL
    end
    
    style MA fill:#667eea
    style ML fill:#f39c12
    style API fill:#27ae60
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant V as Vehicle
    participant T as Telemetry
    participant ML as ML Model
    participant MA as Master Agent
    participant FA as Fault Agent
    participant DA as Diagnostic Agent
    participant SA as Scheduler Agent
    participant U as User
    
    V->>T: Send telemetry data
    T->>ML: Process features
    ML->>ML: Predict failure
    ML->>MA: Return prediction
    MA->>FA: Check for faults
    FA->>MA: Fault detected
    MA->>DA: Request diagnosis
    DA->>MA: Return diagnosis
    MA->>U: Alert user
    U->>MA: Request service
    MA->>SA: Schedule service
    SA->>U: Confirm booking
```

## Agent Interaction Diagram

```mermaid
graph LR
    U[User Input] --> MA[Master Agent]
    
    MA --> |Detect Intent| INT{Intent Router}
    
    INT --> |Vehicle Check| FA[Fault Detection Agent]
    INT --> |Diagnosis| DA[Diagnostic Agent]
    INT --> |Schedule| SA[Scheduler Agent]
    INT --> |Voice/Chat| VA[Voice Agent]
    INT --> |RCA| RA[RCA Agent]
    
    FA --> |Fault Data| DA
    DA --> |Diagnosis| SA
    SA --> |Booking| CONF[Confirmation]
    
    VA --> |Speech| MA
    RA --> |Report| U
    
    CONF --> U
    
    style MA fill:#667eea
    style INT fill:#f39c12
```

## Component Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        HTML[HTML Pages]
        CSS[CSS Styling]
        JS[JavaScript]
        CHART[Chart.js]
        SPEECH[Web Speech API]
    end
    
    subgraph "Agent Layer"
        ORCH[Orchestrator]
        AGENTS[Worker Agents]
    end
    
    subgraph "Backend Layer"
        EXPRESS[Express.js]
        ROUTES[API Routes]
        CTRL[Controllers]
    end
    
    subgraph "ML Layer"
        FLASK[Flask Service]
        MODEL[Random Forest]
        SCALER[Feature Scaler]
    end
    
    subgraph "Data Layer"
        JSON[JSON Store]
        CACHE[In-Memory Cache]
    end
    
    HTML --> JS
    JS --> CHART
    JS --> SPEECH
    JS --> ORCH
    ORCH --> AGENTS
    AGENTS --> EXPRESS
    EXPRESS --> ROUTES
    ROUTES --> CTRL
    CTRL --> FLASK
    FLASK --> MODEL
    MODEL --> SCALER
    CTRL --> JSON
    CTRL --> CACHE
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        FE[Frontend Application]
    end
    
    subgraph "Application Server"
        BE[Node.js Backend<br/>Port 3000]
    end
    
    subgraph "ML Server"
        ML[Python ML Service<br/>Port 5000]
    end
    
    subgraph "Data Storage"
        DB[(Database)]
        FS[File System]
    end
    
    FE -->|HTTP/REST| BE
    BE -->|HTTP| ML
    BE -->|Read/Write| DB
    BE -->|Read/Write| FS
    ML -->|Load| FS
```

## Key Features

### 1. Predictive Maintenance
- Real-time telemetry monitoring
- ML-based failure prediction
- Component-level risk assessment
- Time-to-failure estimation

### 2. Agentic System
- Master Agent orchestration
- Specialized worker agents
- Intent detection and routing
- Context-aware responses

### 3. Voice & Chat Interface
- Web Speech API integration
- Male/Female voice selection
- Natural language processing
- Conversational flow

### 4. Autonomous Scheduling
- Automatic slot detection
- Calendar integration
- Confirmation workflow
- SMS/Email notifications

### 5. RCA Engine
- Root cause analysis
- Evidence collection
- CAPA generation
- Manufacturing insights

## Technology Stack

### Frontend
- HTML5
- CSS3 (with animations)
- Pure JavaScript (ES6+)
- Chart.js for visualization
- Web Speech API

### Backend
- Node.js
- Express.js
- CORS middleware
- Body-parser

### ML
- Python 3.8+
- Flask
- scikit-learn
- pandas, numpy
- joblib

### Data
- JSON file storage
- In-memory caching
- CSV for training data
