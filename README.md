# SmartQueue AI – Real-Time AI Queue Detection & Management Platform
### AI Immersion Capstone Project: **Smart Queue Detection**

SmartQueue AI is a full-stack web application designed for real-world enterprise queue surveillance, density monitoring, waiting time forecasting, and overcrowding prevention using Computer Vision and Queuing Theory.

---

## 🌟 Key Capabilities & Features

1. **Computer Vision Queue Detection**: Real-time bounding box tracking, unique pedestrian IDs, and Region of Interest (ROI) polygon filtering.
2. **Mathematical Waiting Time Estimation**: Applies **Little's Law** ($W = L / \lambda$), calculating waiting duration based on queue length, arrival velocity, and active service desks.
3. **Overcrowding & Anomaly Alerts**: Instant visual, audio, and toast notifications when queues breach maximum capacity or exceed SLA wait thresholds.
4. **Interactive Dashboard**: Real-time SVG charts (Area, Line, Bar) powered by Recharts, tracking queue length, hourly traffic, and throughput velocity.
5. **Flexible Multi-Source Video Pipeline**:
   - **AI Simulation Mode**: High-fidelity procedural computer vision simulation with synthetic pedestrian dynamics and queue flow.
   - **Live Webcam Mode**: Connects directly to hardware webcams via HTML5 `getUserMedia`.
   - **Media Upload Mode**: Test custom CCTV video clips or queue images.
   - **YOLOv8 Python Integration**: Ready-to-run Python OpenCV script (`backend/yolo_detector.py`) for physical RTSP cameras and edge hardware.
6. **Executive Audit Reports**: Generates formal Daily, Weekly, and Monthly compliance reports with one-click **CSV spreadsheet export** and printable executive views.
7. **Role-Based Authentication & 1-Click Demo Profiles**: Preconfigured with Admin, Counter Operator, and Academic Faculty Evaluator accounts.
8. **Modern Glassmorphism UI**: Professional dark/light mode, cyber AI color accents (cyan, indigo, violet), and fully responsive mobile/desktop layouts.

---

## 🏗️ System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 SMARTQUEUE AI UI                                  |
|  - React 18 + TypeScript + Tailwind CSS                                           |
|  - HTML5 Canvas 2D Computer Vision Overlay Engine                                 |
|  - Recharts SVG Analytics Charts & Lucide Icons                                   |
|  - Dark / Light Glassmorphism Theme System                                        |
+-----------------------------------------+-----------------------------------------+
                                          | (REST API & Telemetry Ingestion)
                                          v
+-----------------------------------------------------------------------------------+
|                             EXPRESS.JS REST BACKEND                               |
|  - Port 5000: /api/auth, /api/queues, /api/detections, /api/alerts, /api/reports  |
|  - Little's Law Mathematical Service Engine                                       |
|  - Persistent JSON/SQLite Data Store                                              |
+-----------------------------------------------------------------------------------+
                                          ^
                                          | (Live Stream Telemetry)
+-----------------------------------------+-----------------------------------------+
|                    PYTHON YOLOV8 + OPENCV DETECTOR (OPTIONAL)                     |
|  - backend/yolo_detector.py                                                       |
|  - Ultralytics YOLOv8 nano/extra-large person tracking (class 0)                   |
|  - Polygon ROI cv2.pointPolygonTest line inclusion                                |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- *(Optional for hardware YOLO)*: Python 3.9+ (`pip install ultralytics opencv-python requests numpy`)

### 1. Launch All Services (One-Click Options)
- **Option A (Double-Click Batch File)**: Double-click `start.bat` in the project root.
- **Option B (Node Runner)**:
  ```bash
  node run-dev.js
  ```
- **Option C (Unified Production Server)**:
  ```bash
  cd backend && node server.js
  # Serves both REST APIs and the frontend build on http://localhost:5000
  ```

### 2. Push to GitHub (One-Click)
- Double-click `push-github.bat` or run:
  ```cmd
  push-github.bat
  ```
  *(Enter your GitHub Personal Access Token if prompted for password)*


### 2. Or Run Separately

**Backend Server:**
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5000
```

**Frontend Client:**
```bash
cd frontend
npm install
npm run dev
# Client running at http://localhost:3000
```

---

## 🔑 Demo Login Accounts

On the **Login Page**, click any 1-Click Demo pill to sign in instantly:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@smartqueue.ai` | `password123` | Full dashboard, detection, alert configurations, reports |
| **Counter Operator** | `operator@smartqueue.ai` | `password123` | Terminal monitoring, desk staffing control, incident resolution |
| **Faculty Evaluator** | `viewer@smartqueue.ai` | `password123` | Academic immersion review, audit reports, analytics inspection |

---

## 📍 Deployed Demo Locations

The application initializes with 5 representative public queue zones:
1. **Queue A - College Canteen**: Student Hub Food Court (Normal Flow)
2. **Queue B - Hospital Reception**: Emergency & Triage Wing (High Traffic)
3. **Queue C - Railway Ticket Counter**: Central Junction Booking Hall (Overcrowded Spike)
4. **Queue D - Bank Cash Desk**: Downtown Branch Counters 1-4 (Regulated Flow)
5. **Queue E - Government Revenue Office**: Civic Center Citizen Services (Bureaucracy Flow)

---

## 🎥 Running the Hardware YOLOv8 Detector (Optional)

To connect an actual USB camera or video file to the live web dashboard:
```bash
cd backend
python yolo_detector.py --source 0 --queue q-canteen
```
To process a video file:
```bash
python yolo_detector.py --source sample_queue.mp4 --queue q-hospital
```

---

## 📄 License & Academic Attribution
Created for the **AI Immersion Project** on **Smart Queue Detection**.
Licensed under the MIT License.
