# 📊 GrocScan — Architecture Diagrams

These diagrams visualize exactly how data moves through the system and the step-by-step interactions between the user, the Android app, our backend, and the external APIs.

## 1. High-Level Data Flow Diagram (DFD)
This diagram shows the major components of the system and how data flows between them.

```mermaid
graph TD
    %% Entities
    U((👤 User))
    App[📱 Android App\nReact Native / Expo]
    API[☁️ GrocScan Backend\nNode.js on Cloud Run]
    Cache[(⚡ Redis Cache\n10-min TTL)]
    DB[(🗄️ PostgreSQL\nPrice History)]
    QCA[[🌐 QuickCommerce API\nExternal Provider]]
    FCM[[🔔 Firebase Cloud\nMessaging]]

    %% Flows
    U -->|Search Query,\nGPS / Pincode,\nBarcode Scan| App
    App -->|HTTP GET /api/compare| API
    
    API <-->|Read / Write\nFast Lookups| Cache
    API -->|Save Price Snapshots\nAlert Rules| DB
    
    API -->|Fetch Live Prices\n(If Cache Miss)| QCA
    QCA -->|Raw Prices\n(Blinkit, Zepto, etc.)| API
    
    API -->|Formatted & Sorted Prices| App
    App -->|Display Results & UI| U
    
    DB -.->|Trigger Price Drop| API
    API -.->|Send Push Notification| FCM
    FCM -.->|Alert Notification| App
```

---

## 2. Sequence Diagram: Product Search & Comparison
This diagram illustrates the step-by-step, chronological interaction for the core user journey: searching for a product and viewing the price comparison.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as 📱 Android App
    participant API as ☁️ Backend API
    participant Cache as ⚡ Redis Cache
    participant DB as 🗄️ PostgreSQL
    participant QCA as 🌐 QuickCommerce API

    User->>App: Types "Amul Milk" & Allows GPS
    App->>App: Detect Location (lat, lng)
    App->>API: GET /api/compare?q=amul+milk&lat=19.07&lng=72.87

    rect rgb(240, 248, 255)
        Note over API,Cache: 1. Check Fast Cache (Sub-5ms)
        API->>Cache: GET prices:amul-milk:19.07:72.87
        
        alt Cache HIT
            Cache-->>API: Returns Formatted Prices
        else Cache MISS
            Cache-->>API: Null
            
            Note over API,QCA: 2. Fetch Live Data (Only on cache miss)
            API->>QCA: GET /v1/groupsearch?q=amul+milk...
            QCA-->>API: Raw Data (Zepto: ₹25, Blinkit: ₹27, etc.)
            
            Note over API: 3. Business Logic
            API->>API: Normalize names, add delivery/platform fees
            
            Note over API,DB: 4. Store for later
            API->>Cache: SETEX prices:amul-milk (10 min TTL)
            API->>DB: INSERT INTO price_history (Async)
        end
    end

    API-->>App: Return Sorted Platform Prices (Cheapest First)
    App-->>User: Display Comparison Cards
    
    opt User Clicks Buy
        User->>App: Taps "Buy on Zepto"
        App->>User: Deep links directly to Zepto app
    end
```

---

## 3. Sequence Diagram: Price Drop Alerts (Background Flow)
This shows how the system tracks prices in the background and notifies the user.

```mermaid
sequenceDiagram
    autonumber
    participant CRON as ⏱️ Background Job
    participant API as ☁️ Backend API
    participant DB as 🗄️ PostgreSQL
    participant QCA as 🌐 QuickCommerce API
    participant FCM as 🔔 Firebase
    participant App as 📱 Android App

    CRON->>API: Trigger Alert Check (Every 30 mins)
    API->>DB: SELECT * FROM alerts WHERE active = true
    DB-->>API: Return pending alerts (e.g., "Alert me if Tata Salt < ₹20")
    
    loop For Each Alert
        API->>QCA: GET Live Price for Tata Salt
        QCA-->>API: Current Price (e.g., Zepto: ₹19)
        
        alt Current Price <= Target Price
            API->>DB: UPDATE alert SET active = false
            API->>FCM: Send Push Notification payload
            FCM->>App: 📲 "Price Drop! Tata Salt is ₹19 on Zepto"
        end
    end
```
