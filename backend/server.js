import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store with disk persistence fallback
const DB_FILE = path.join(__dirname, 'db_data.json');

const defaultData = {
  users: [
    { id: 'usr-1', name: 'Dr. Sarah Jenkins', email: 'admin@smartqueue.ai', password: 'password123', role: 'admin', department: 'Operations Intelligence' },
    { id: 'usr-2', name: 'Alex Rivera', email: 'operator@smartqueue.ai', password: 'password123', role: 'operator', department: 'Terminal Monitoring' },
    { id: 'usr-3', name: 'Prof. Davis (Immersion Evaluator)', email: 'viewer@smartqueue.ai', password: 'password123', role: 'viewer', department: 'AI Faculty Review' }
  ],
  queues: [
    {
      id: 'q-canteen',
      name: 'Queue A - College Canteen',
      location: 'Student Hub Food Court',
      capacity: 35,
      current_people: 14,
      avg_service_time_sec: 45,
      counters_open: 2,
      status: 'Normal',
      camera_id: 'CAM-01-HD',
      confidence: 96.8,
      zone_coords: [[40, 60], [280, 60], [280, 380], [40, 380]]
    },
    {
      id: 'q-hospital',
      name: 'Queue B - Hospital Reception',
      location: 'Emergency & Triage Wing',
      capacity: 30,
      current_people: 26,
      avg_service_time_sec: 75,
      counters_open: 3,
      status: 'Busy',
      camera_id: 'CAM-02-4K',
      confidence: 94.2,
      zone_coords: [[50, 40], [320, 40], [320, 390], [50, 390]]
    },
    {
      id: 'q-railway',
      name: 'Queue C - Railway Ticket Counter',
      location: 'Central Junction Booking Hall',
      capacity: 40,
      current_people: 39,
      avg_service_time_sec: 90,
      counters_open: 2,
      status: 'Overcrowded',
      camera_id: 'CAM-03-PTZ',
      confidence: 92.5,
      zone_coords: [[30, 80], [300, 80], [300, 420], [30, 420]]
    },
    {
      id: 'q-bank',
      name: 'Queue D - Bank Cash Desk',
      location: 'Downtown Branch Counter 1-4',
      capacity: 25,
      current_people: 9,
      avg_service_time_sec: 60,
      counters_open: 3,
      status: 'Normal',
      camera_id: 'CAM-04-AI',
      confidence: 98.1,
      zone_coords: [[60, 50], [260, 50], [260, 350], [60, 350]]
    },
    {
      id: 'q-gov',
      name: 'Queue E - Government Revenue Office',
      location: 'Civic Center Citizen Services',
      capacity: 45,
      current_people: 31,
      avg_service_time_sec: 110,
      counters_open: 2,
      status: 'Busy',
      camera_id: 'CAM-05-AI',
      confidence: 95.0,
      zone_coords: [[45, 70], [290, 70], [290, 400], [45, 400]]
    }
  ],
  alerts: [
    {
      id: 'alt-1',
      queue_id: 'q-railway',
      queue_name: 'Queue C - Railway Ticket Counter',
      alert_type: 'Overcrowding Hazard',
      message: 'Queue C has reached 39 people (97.5% of max capacity 40). Immediate line dispatch required.',
      severity: 'critical',
      status: 'active',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString()
    },
    {
      id: 'alt-2',
      queue_id: 'q-hospital',
      queue_name: 'Queue B - Hospital Reception',
      alert_type: 'High Waiting Time Threshold',
      message: 'Average waiting time in Hospital Triage surpassed 18 minutes. Consider opening Counter 4.',
      severity: 'warning',
      status: 'active',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'alt-3',
      queue_id: 'q-gov',
      queue_name: 'Queue E - Government Revenue Office',
      alert_type: 'Service Rate Slowdown',
      message: 'Processing delay detected: average service time increased by 35% over baseline.',
      severity: 'warning',
      status: 'active',
      timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString()
    },
    {
      id: 'alt-4',
      queue_id: 'q-canteen',
      queue_name: 'Queue A - College Canteen',
      alert_type: 'Camera Occlusion Resolved',
      message: 'CAM-01-HD visual occlusion cleared. Detection confidence restored to 96.8%.',
      severity: 'info',
      status: 'resolved',
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString()
    }
  ],
  settings: {
    queue_limit: 30,
    waiting_time_limit: 20,
    confidence_threshold: 75,
    camera_fps: 30,
    detection_mode: 'simulation',
    audio_alerts: true,
    auto_refresh: true,
    theme: 'dark',
    ai_tracker: 'ByteTrack',
    enable_rois: true
  }
};

let db = { ...defaultData };

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(raw);
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('Failed reading DB file, using defaults', err);
    db = { ...defaultData };
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving DB file', err);
  }
}

loadDb();

// Helper: Calculate queue status & wait time using Little's Law
function computeQueueMetrics(peopleCount, serviceTimeSec, countersOpen) {
  const safeCounters = Math.max(1, countersOpen || 1);
  const effectiveServiceRatePerMin = (60 / Math.max(15, serviceTimeSec)) * safeCounters;
  const waitTimeMinutes = Math.round((peopleCount / effectiveServiceRatePerMin) * 10) / 10;
  
  let status = 'Normal';
  if (peopleCount > 35 || waitTimeMinutes > 25) {
    status = 'Overcrowded';
  } else if (peopleCount > 20 || waitTimeMinutes > 15) {
    status = 'Busy';
  }
  return { waitTimeMinutes, status };
}

// ------------------- API ROUTES -------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '2.4.0-AI-Immersion',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    activeQueues: db.queues.length,
    activeAlerts: db.alerts.filter(a => a.status === 'active').length
  });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Use one of the Demo accounts.' });
  }
  const token = `sq-token-${user.id}-${Date.now()}`;
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }
  const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    role: role || 'operator',
    department: department || 'General Operations'
  };
  db.users.push(newUser);
  saveDb();
  res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department }
  });
});

// Queues
app.get('/api/queues', (req, res) => {
  const enriched = db.queues.map(q => {
    const { waitTimeMinutes, status } = computeQueueMetrics(q.current_people, q.avg_service_time_sec, q.counters_open);
    return {
      ...q,
      estimated_wait_min: waitTimeMinutes,
      status
    };
  });
  res.json({ success: true, queues: enriched });
});

app.post('/api/queues', (req, res) => {
  const { name, location, capacity, avg_service_time_sec, counters_open } = req.body;
  const newQueue = {
    id: `q-${Date.now()}`,
    name: name || 'New Queue Counter',
    location: location || 'General Area',
    capacity: Number(capacity) || 30,
    current_people: 0,
    avg_service_time_sec: Number(avg_service_time_sec) || 60,
    counters_open: Number(counters_open) || 1,
    status: 'Normal',
    camera_id: `CAM-${db.queues.length + 1}-AI`,
    confidence: 96.0,
    zone_coords: [[40, 50], [280, 50], [280, 360], [40, 360]]
  };
  db.queues.push(newQueue);
  saveDb();
  res.status(201).json({ success: true, queue: newQueue });
});

app.put('/api/queues/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.queues.findIndex(q => q.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Queue not found' });
  db.queues[idx] = { ...db.queues[idx], ...req.body };
  saveDb();
  res.json({ success: true, queue: db.queues[idx] });
});

// Live Detection Results Feed
app.get('/api/detections/live', (req, res) => {
  const totalPeople = db.queues.reduce((acc, q) => acc + q.current_people, 0);
  const avgWait = Math.round(
    db.queues.reduce((acc, q) => {
      const { waitTimeMinutes } = computeQueueMetrics(q.current_people, q.avg_service_time_sec, q.counters_open);
      return acc + waitTimeMinutes;
    }, 0) / db.queues.length
  );
  const avgLength = Math.round((totalPeople / db.queues.length) * 10) / 10;
  const overcrowdingCount = db.queues.filter(q => {
    const { status } = computeQueueMetrics(q.current_people, q.avg_service_time_sec, q.counters_open);
    return status === 'Overcrowded';
  }).length;

  res.json({
    timestamp: new Date().toISOString(),
    fps: 29.7,
    model: 'YOLOv8x-Queue-Opt',
    inference_latency_ms: 13.8,
    metrics: {
      totalPeopleInQueues: totalPeople,
      averageWaitingTimeMinutes: avgWait,
      activeQueuesCount: db.queues.length,
      overcrowdingAlertsCount: overcrowdingCount,
      averageQueueLength: avgLength,
      detectionAccuracy: 96.4
    },
    queues: db.queues.map(q => {
      const { waitTimeMinutes, status } = computeQueueMetrics(q.current_people, q.avg_service_time_sec, q.counters_open);
      return {
        ...q,
        estimated_wait_min: waitTimeMinutes,
        status
      };
    })
  });
});

// Telemetry ingestion from YOLO/Simulation
app.post('/api/detections/telemetry', (req, res) => {
  const { queue_id, people_count, confidence, tracked_objects } = req.body;
  const queue = db.queues.find(q => q.id === queue_id);
  if (queue) {
    queue.current_people = Number(people_count) || 0;
    if (confidence) queue.confidence = Number(confidence);
    
    // Check threshold alert
    if (queue.current_people > queue.capacity) {
      const existingAlert = db.alerts.find(a => a.queue_id === queue_id && a.status === 'active' && a.alert_type === 'Capacity Overflow');
      if (!existingAlert) {
        db.alerts.unshift({
          id: `alt-${Date.now()}`,
          queue_id: queue.id,
          queue_name: queue.name,
          alert_type: 'Capacity Overflow',
          message: `${queue.name} exceeded its maximum limit of ${queue.capacity} people (Detected: ${queue.current_people}).`,
          severity: 'critical',
          status: 'active',
          timestamp: new Date().toISOString()
        });
      }
    }
    saveDb();
  }
  res.json({ success: true, message: 'Telemetry recorded' });
});

// Alerts
app.get('/api/alerts', (req, res) => {
  const { status, severity } = req.query;
  let filtered = [...db.alerts];
  if (status && status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }
  if (severity && severity !== 'all') {
    filtered = filtered.filter(a => a.severity === severity);
  }
  res.json({ success: true, count: filtered.length, alerts: filtered });
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const alert = db.alerts.find(a => a.id === id);
  if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
  alert.status = 'resolved';
  alert.resolved_at = new Date().toISOString();
  saveDb();
  res.json({ success: true, alert });
});

app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  db.alerts = db.alerts.filter(a => a.id !== id);
  saveDb();
  res.json({ success: true, message: 'Alert removed' });
});

app.post('/api/alerts/generate-test', (req, res) => {
  const { queue_id, severity, message } = req.body;
  const q = db.queues.find(item => item.id === queue_id) || db.queues[0];
  const newAlert = {
    id: `alt-${Date.now()}`,
    queue_id: q.id,
    queue_name: q.name,
    alert_type: 'Dynamic Anomaly Trigger',
    message: message || `High surge detected in ${q.name}. Flow exceeded 15 people/minute.`,
    severity: severity || 'warning',
    status: 'active',
    timestamp: new Date().toISOString()
  };
  db.alerts.unshift(newAlert);
  saveDb();
  res.status(201).json({ success: true, alert: newAlert });
});

// Analytics
app.get('/api/analytics/summary', (req, res) => {
  res.json({
    success: true,
    summary: {
      totalPeopleProcessedToday: 1842,
      averageWaitingTimeMinutes: 11.4,
      peakQueueLength: 47,
      peakHour: '12:30 PM - 01:30 PM',
      overcrowdingIncidents: 6,
      overallQueueEfficiencyScore: 92.8,
      serviceRatePerMinute: 4.8,
      abandonmentRatePercent: 1.4
    },
    hourlyDistribution: [
      { hour: '08:00', people_in: 45, people_out: 42, avg_wait: 4, queue_length: 6 },
      { hour: '09:00', people_in: 92, people_out: 85, avg_wait: 7, queue_length: 14 },
      { hour: '10:00', people_in: 140, people_out: 130, avg_wait: 10, queue_length: 22 },
      { hour: '11:00', people_in: 185, people_out: 165, avg_wait: 14, queue_length: 31 },
      { hour: '12:00', people_in: 245, people_out: 210, avg_wait: 19, queue_length: 42 },
      { hour: '13:00', people_in: 280, people_out: 250, avg_wait: 24, queue_length: 47 },
      { hour: '14:00', people_in: 210, people_out: 220, avg_wait: 16, queue_length: 33 },
      { hour: '15:00', people_in: 175, people_out: 180, avg_wait: 12, queue_length: 25 },
      { hour: '16:00', people_in: 195, people_out: 188, avg_wait: 13, queue_length: 29 },
      { hour: '17:00', people_in: 230, people_out: 215, avg_wait: 18, queue_length: 38 },
      { hour: '18:00', people_in: 160, people_out: 170, avg_wait: 11, queue_length: 20 },
      { hour: '19:00', people_in: 95, people_out: 105, avg_wait: 6, queue_length: 10 }
    ],
    queuePerformance: db.queues.map(q => ({
      id: q.id,
      name: q.name,
      location: q.location,
      processed: Math.floor(Math.random() * 200) + 300,
      avg_wait_min: Math.floor(Math.random() * 10) + 6,
      efficiency_score: Math.floor(Math.random() * 8) + 91,
      peak_length: Math.floor(Math.random() * 15) + q.capacity - 5
    }))
  });
});

// Reports & CSV export
app.get('/api/reports/summary', (req, res) => {
  const { period = 'daily' } = req.query;
  const multiplier = period === 'monthly' ? 30 : period === 'weekly' ? 7 : 1;
  res.json({
    success: true,
    period,
    generated_at: new Date().toISOString(),
    metrics: {
      totalPeopleProcessed: 1842 * multiplier,
      averageWaitingTimeMinutes: period === 'monthly' ? 12.8 : period === 'weekly' ? 12.1 : 11.4,
      peakQueueLength: period === 'monthly' ? 58 : period === 'weekly' ? 52 : 47,
      peakHours: '12:30 PM - 02:00 PM',
      overcrowdingIncidents: 6 * multiplier,
      queueEfficiencyRating: '92.4% (Optimal)',
      costSavedThroughput: `$${(240 * multiplier).toLocaleString()}`
    },
    recommendations: [
      'Increase active service counters at Railway Ticket Counter between 12:00 and 14:00.',
      'Deploy queue barrier stanchions at Hospital Triage to enforce single-file camera visibility.',
      'Average waiting time in College Canteen dropped by 28% after introducing dual self-checkout kiosks.'
    ]
  });
});

app.get('/api/reports/export-csv', (req, res) => {
  let csv = 'Timestamp,Queue ID,Queue Name,Location,People Count,Estimated Wait Min,Status,Camera ID,Confidence\n';
  db.queues.forEach(q => {
    const { waitTimeMinutes, status } = computeQueueMetrics(q.current_people, q.avg_service_time_sec, q.counters_open);
    csv += `"${new Date().toISOString()}","${q.id}","${q.name}","${q.location}",${q.current_people},${waitTimeMinutes},"${status}","${q.camera_id}",${q.confidence}%\n`;
  });
  res.header('Content-Type', 'text/csv');
  res.attachment(`smartqueue_report_${Date.now()}.csv`);
  res.send(csv);
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDb();
  res.json({ success: true, settings: db.settings, message: 'Settings updated successfully' });
});

app.listen(PORT, () => {
  console.log(`[SmartQueue AI Backend] Server listening on port ${PORT}`);
  console.log(`[SmartQueue AI Backend] Health check: http://localhost:${PORT}/api/health`);
});
