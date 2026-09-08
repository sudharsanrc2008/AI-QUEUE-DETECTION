export type Role = 'admin' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
}

export type QueueStatus = 'Normal' | 'Busy' | 'Overcrowded';

export interface Queue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_people: number;
  avg_service_time_sec: number;
  counters_open: number;
  status: QueueStatus;
  estimated_wait_min: number;
  camera_id: string;
  confidence: number;
  zone_coords?: [number, number][];
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'resolved';

export interface Alert {
  id: string;
  queue_id: string;
  queue_name: string;
  alert_type: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  resolved_at?: string;
}

export interface TrackedPerson {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  confidence: number;
  waitTimeSec: number;
  inRoi: boolean;
  color: string;
  speed: number;
  history: [number, number][];
}

export interface DetectionTelemetry {
  timestamp: string;
  fps: number;
  model: string;
  inference_latency_ms: number;
  metrics: {
    totalPeopleInQueues: number;
    averageWaitingTimeMinutes: number;
    activeQueuesCount: number;
    overcrowdingAlertsCount: number;
    averageQueueLength: number;
    detectionAccuracy: number;
  };
}

export interface AppSettings {
  queue_limit: number;
  waiting_time_limit: number;
  confidence_threshold: number;
  camera_fps: number;
  detection_mode: 'simulation' | 'webcam' | 'upload';
  audio_alerts: boolean;
  auto_refresh: boolean;
  theme: 'dark' | 'light';
  ai_tracker: string;
  enable_rois: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
