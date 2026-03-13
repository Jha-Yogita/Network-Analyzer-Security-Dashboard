# Network Traffic Monitoring & Security Analyzer

A **real-time network monitoring dashboard** that captures network packets, analyzes traffic patterns, detects anomalies, and visualizes statistics through an interactive web interface.

This project combines **Scapy packet sniffing**, **Flask APIs**, **WebSockets**, and a **React dashboard** to provide live insights into network activity and security threats.

---

## Features

### Real-Time Packet Monitoring
- Capture live packets from the network
- Protocol distribution tracking:
  - TCP
  - UDP
  - ICMP

### Traffic Analytics
- Top source IPs
- Top destination IPs
- Port usage distribution
- Packet statistics

### Security Threat Detection
Automatically detects suspicious network behavior such as:

- Port scanning
- High traffic sources
- Network anomalies

Alerts are stored in the database and displayed on the dashboard.

### Historical Data
- Stores packet snapshots
- Query network activity by time range
- Analyze past traffic trends

### Real-Time Dashboard
Using **WebSockets**, the dashboard updates automatically without page refresh.

### Alert Management
- View security alerts
- Filter alerts
- Mark alerts as resolved

---

## Tech Stack

### Frontend
- React
- React Router
- CSS

### Backend
- Python
- Flask
- Flask-SocketIO
- SQLAlchemy
- Scapy

### Database
- SQLite (default)

---

## Project Structure

```
src
│
├── components
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── NetworkHealthScore.jsx
│   ├── NetworkWeather.jsx
│   ├── StatsCards.jsx
│   └── TopTalkers.jsx
│
├── pages
│   ├── Dashboard.jsx
│   ├── History.jsx
│   └── Alerts.jsx
│
├── services
│
├── App.jsx
├── main.jsx
└── index.css
```

Backend modules include:

- `packet_capture.py` – captures packets using Scapy
- `models.py` – database models
- `routes.py` – API endpoints
- `socket_events.py` – real-time packet streaming

---

## Architecture

```
Network Packets
      │
      ▼
  Scapy Sniffer
      │
      ▼
Packet Analyzer
(TCP / UDP / ICMP)
      │
      ▼
Threat Detection
      │
      ▼
 Flask Backend
   │      │
   ▼      ▼
 REST API  WebSocket
      │
      ▼
 React Dashboard
```

---

## API Endpoints

### Live Network Data

```
GET /api/live
```

Returns current packet statistics.

---

### Historical Data

```
GET /api/history?hours=24&limit=100
```

Returns stored packet snapshots.

---

### Network Statistics

```
GET /api/stats?hours=24
```

Returns aggregated traffic statistics.

Example response:

```json
{
  "total_packets": 2450,
  "avg_packets_per_minute": 42.5,
  "protocol_distribution": {
    "TCP": 1800,
    "UDP": 500,
    "ICMP": 150
  }
}
```

---

### Security Alerts

```
GET /api/alerts
```

Fetch detected security alerts.

---

### Resolve Alert

```
POST /api/alerts/{alert_id}/resolve
```

Marks an alert as resolved.

---

## Threat Detection Logic

### Port Scan Detection

Triggered when excessive SYN packets are detected from a source IP.

Example:

```python
if syn_packets > 15:
    alert = "Possible Port Scan"
```

---

### High Traffic Source

Triggered when a source IP generates unusually high traffic.

```python
if packets_from_ip > 50:
    alert = "High Traffic Source"
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/network-traffic-analyzer.git
cd network-traffic-analyzer
```

---

### 2. Backend Setup

Create virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install flask flask-sqlalchemy flask-socketio scapy
```

Run backend

```bash
python run.py
```

---

### 3. Frontend Setup

Navigate to frontend directory

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run React application

```bash
npm run dev
```

---

## Running the Project

1. Start the Flask backend
2. Start the React frontend
3. Open browser

```
http://localhost:5173
```

The dashboard will display **live network traffic statistics and alerts**.

---

## Future Improvements

- Machine learning based anomaly detection
- IP geolocation visualization
- Advanced intrusion detection
- Packet payload inspection
- Authentication and role-based access
- Network device mapping

---

