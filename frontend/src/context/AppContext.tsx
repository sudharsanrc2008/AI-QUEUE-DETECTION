import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Queue, Alert, AppSettings, ToastMessage, Role, QueueStatus } from '../types';

export type PageId = 'landing' | 'login' | 'dashboard' | 'detection' | 'analytics' | 'alerts' | 'reports' | 'settings';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  user: User | null;
  login: (email: string, password: string, remember?: boolean) => boolean;
  demoLogin: (role: Role) => void;
  register: (name: string, email: string, password: string, role: Role, department: string) => boolean;
  logout: () => void;
  queues: Queue[];
  updateQueue: (id: string, updates: Partial<Queue>) => void;
  adjustCounters: (id: string, delta: number) => void;
  alerts: Alert[];
  resolveAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  clearAllAlerts: () => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isSimulating: boolean;
  setIsSimulating: (active: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  triggerRushHourSurge: () => void;
  resetQueueData: () => void;
}

const defaultQueues: Queue[] = [
  {
    id: 'q-canteen',
    name: 'Queue A - College Canteen',
    location: 'Student Hub Food Court',
    capacity: 35,
    current_people: 12,
    avg_service_time_sec: 40,
    counters_open: 2,
    status: 'Normal',
    estimated_wait_min: 4,
    camera_id: 'CAM-01-HD',
    confidence: 97.4,
    zone_coords: [[40, 60], [280, 60], [280, 380], [40, 380]]
  },
  {
    id: 'q-hospital',
    name: 'Queue B - Hospital Reception',
    location: 'Emergency & Triage Wing',
    capacity: 30,
    current_people: 27,
    avg_service_time_sec: 75,
    counters_open: 3,
    status: 'Busy',
    estimated_wait_min: 18,
    camera_id: 'CAM-02-4K',
    confidence: 94.2,
    zone_coords: [[50, 40], [320, 40], [320, 390], [50, 390]]
  },
  {
    id: 'q-railway',
    name: 'Queue C - Railway Ticket Counter',
    location: 'Central Junction Booking Hall',
    capacity: 40,
    current_people: 42,
    avg_service_time_sec: 90,
    counters_open: 2,
    status: 'Overcrowded',
    estimated_wait_min: 32,
    camera_id: 'CAM-03-PTZ',
    confidence: 92.5,
    zone_coords: [[30, 80], [300, 80], [300, 420], [30, 420]]
  },
  {
    id: 'q-bank',
    name: 'Queue D - Bank Cash Desk',
    location: 'Downtown Branch Counter 1-4',
    capacity: 25,
    current_people: 8,
    avg_service_time_sec: 60,
    counters_open: 3,
    status: 'Normal',
    estimated_wait_min: 5,
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
    estimated_wait_min: 28,
    camera_id: 'CAM-05-AI',
    confidence: 95.0,
    zone_coords: [[45, 70], [290, 70], [290, 400], [45, 400]]
  }
];

const initialAlerts: Alert[] = [
  {
    id: 'alt-1',
    queue_id: 'q-railway',
    queue_name: 'Queue C - Railway Ticket Counter',
    alert_type: 'Overcrowding Hazard',
    message: 'Queue C has reached 42 people (exceeding maximum capacity of 40). Immediate line dispatch required.',
    severity: 'critical',
    status: 'active',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'alt-2',
    queue_id: 'q-hospital',
    queue_name: 'Queue B - Hospital Reception',
    alert_type: 'High Waiting Time Threshold',
    message: 'Average waiting time in Hospital Triage surpassed 18 minutes. Consider opening Counter 4.',
    severity: 'warning',
    status: 'active',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'alt-3',
    queue_id: 'q-gov',
    queue_name: 'Queue E - Government Revenue Office',
    alert_type: 'Service Rate Slowdown',
    message: 'Processing delay detected: average service time increased by 35% over baseline.',
    severity: 'warning',
    status: 'active',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'alt-4',
    queue_id: 'q-canteen',
    queue_name: 'Queue A - College Canteen',
    alert_type: 'Camera Occlusion Cleared',
    message: 'CAM-01-HD optical obstruction cleared. Detection confidence restored to 97.4%.',
    severity: 'info',
    status: 'resolved',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const defaultSettings: AppSettings = {
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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartqueue_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [queues, setQueues] = useState<Queue[]>(() => {
    const saved = localStorage.getItem('smartqueue_queues');
    return saved ? JSON.parse(saved) : defaultQueues;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('smartqueue_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('smartqueue_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Sync theme with HTML class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('smartqueue_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('smartqueue_queues', JSON.stringify(queues));
  }, [queues]);

  useEffect(() => {
    localStorage.setItem('smartqueue_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev.slice(-4), { id, title, message, type }]);

    // Play subtle audio beep if enabled
    if (settings.audio_alerts && (type === 'warning' || type === 'error')) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type === 'error' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(type === 'error' ? 320 : 580, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // AudioContext disabled by browser policy until gesture
      }
    }

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [settings.audio_alerts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const login = (email: string, password: string): boolean => {
    if (password.length < 4) {
      addToast('Login Failed', 'Password must be at least 4 characters.', 'error');
      return false;
    }
    const loggedUser: User = {
      id: 'usr-custom',
      name: email.split('@')[0].toUpperCase(),
      email,
      role: 'admin',
      department: 'Central Intelligence'
    };
    setUser(loggedUser);
    localStorage.setItem('smartqueue_user', JSON.stringify(loggedUser));
    addToast('Welcome Back', `Logged in as ${loggedUser.name}`, 'success');
    setCurrentPage('dashboard');
    return true;
  };

  const demoLogin = (role: Role) => {
    const map: Record<Role, User> = {
      admin: {
        id: 'usr-admin',
        name: 'Dr. Sarah Jenkins (Admin)',
        email: 'admin@smartqueue.ai',
        role: 'admin',
        department: 'Operations & Computer Vision'
      },
      operator: {
        id: 'usr-operator',
        name: 'Alex Rivera (Operator)',
        email: 'operator@smartqueue.ai',
        role: 'operator',
        department: 'Terminal Queue Management'
      },
      viewer: {
        id: 'usr-viewer',
        name: 'Prof. Davis (Immersion Evaluator)',
        email: 'viewer@smartqueue.ai',
        role: 'viewer',
        department: 'AI Project Evaluation Board'
      }
    };
    const logged = map[role];
    setUser(logged);
    localStorage.setItem('smartqueue_user', JSON.stringify(logged));
    addToast('Demo Access Granted', `Signed in as ${logged.name} (${role.toUpperCase()})`, 'success');
    setCurrentPage('dashboard');
  };

  const register = (name: string, email: string, password: string, role: Role, department: string): boolean => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      department: department || 'Operations'
    };
    setUser(newUser);
    localStorage.setItem('smartqueue_user', JSON.stringify(newUser));
    addToast('Account Created', `Welcome to SmartQueue AI, ${name}!`, 'success');
    setCurrentPage('dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartqueue_user');
    addToast('Signed Out', 'You have been signed out safely.', 'info');
    setCurrentPage('login');
  };

  const updateQueue = (id: string, updates: Partial<Queue>) => {
    setQueues(prev => prev.map(q => {
      if (q.id !== id) return q;
      const merged = { ...q, ...updates };
      // Recompute status & Little's Law wait time
      const effectiveServiceRate = (60 / Math.max(15, merged.avg_service_time_sec)) * Math.max(1, merged.counters_open);
      merged.estimated_wait_min = Math.max(1, Math.round((merged.current_people / effectiveServiceRate) * 10) / 10);
      let status: QueueStatus = 'Normal';
      if (merged.current_people >= merged.capacity || merged.estimated_wait_min > 25) {
        status = 'Overcrowded';
      } else if (merged.current_people > merged.capacity * 0.65 || merged.estimated_wait_min > 15) {
        status = 'Busy';
      }
      merged.status = status;
      return merged;
    }));
  };

  const adjustCounters = (id: string, delta: number) => {
    setQueues(prev => prev.map(q => {
      if (q.id !== id) return q;
      const newCounters = Math.max(1, Math.min(8, q.counters_open + delta));
      const effectiveServiceRate = (60 / Math.max(15, q.avg_service_time_sec)) * newCounters;
      const estimated_wait_min = Math.max(1, Math.round((q.current_people / effectiveServiceRate) * 10) / 10);
      let status: QueueStatus = 'Normal';
      if (q.current_people >= q.capacity || estimated_wait_min > 25) status = 'Overcrowded';
      else if (q.current_people > q.capacity * 0.65 || estimated_wait_min > 15) status = 'Busy';
      
      addToast(
        'Counter Staffing Adjusted',
        `${q.name}: ${newCounters} counter(s) open. Wait time updated to ${estimated_wait_min}m.`,
        'info'
      );
      return { ...q, counters_open: newCounters, estimated_wait_min, status };
    }));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved', resolved_at: 'Just now' } : a));
    addToast('Alert Resolved', 'Incident logged and cleared.', 'success');
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    addToast('Alert Deleted', 'Alert record removed.', 'info');
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAlerts(prev => [newAlert, ...prev]);
    addToast(`Alert: ${newAlert.alert_type}`, newAlert.message, newAlert.severity === 'critical' ? 'error' : 'warning');
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    addToast('Alerts Cleared', 'All alerts have been cleared.', 'info');
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addToast('Settings Saved', 'System preferences updated.', 'success');
  };

  const triggerRushHourSurge = () => {
    setQueues(prev => prev.map(q => {
      const surgeCount = Math.floor(Math.random() * 8) + 12;
      const newTotal = q.current_people + surgeCount;
      const effectiveServiceRate = (60 / Math.max(15, q.avg_service_time_sec)) * q.counters_open;
      const wait = Math.max(1, Math.round((newTotal / effectiveServiceRate) * 10) / 10);
      return {
        ...q,
        current_people: newTotal,
        estimated_wait_min: wait,
        status: (newTotal >= q.capacity || wait > 25 ? 'Overcrowded' : 'Busy') as QueueStatus
      };
    }));

    addAlert({
      queue_id: 'q-railway',
      queue_name: 'Multiple Queues (Surge Simulation)',
      alert_type: 'Peak Surge Detected',
      message: 'Sudden influx detected across monitored zones. Inflow exceeded 25 people/min.',
      severity: 'critical',
      status: 'active'
    });
  };

  const resetQueueData = () => {
    setQueues(defaultQueues);
    setAlerts(initialAlerts);
    addToast('Reset Complete', 'Queues and metrics restored to baseline simulation values.', 'info');
  };

  // Real-time dynamic simulation tick: simulates entering, queuing, and departures
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setQueues(prev => prev.map(q => {
        // Random arrivals & service departures based on speed
        const arrivalDelta = Math.random() > 0.45 ? (Math.random() > 0.6 ? 1 : -1) : 0;
        const newCount = Math.max(2, Math.min(q.capacity + 15, q.current_people + arrivalDelta));
        const effectiveRate = (60 / Math.max(15, q.avg_service_time_sec)) * q.counters_open;
        const wait = Math.max(1, Math.round((newCount / effectiveRate) * 10) / 10);

        let status: QueueStatus = 'Normal';
        if (newCount >= q.capacity || wait > 25) status = 'Overcrowded';
        else if (newCount > q.capacity * 0.65 || wait > 15) status = 'Busy';

        // Check for overcrowding alert trigger
        if (status === 'Overcrowded' && q.status !== 'Overcrowded') {
          addAlert({
            queue_id: q.id,
            queue_name: q.name,
            alert_type: 'Overcrowding Threshold Exceeded',
            message: `${q.name} reached ${newCount} people. Waiting time estimated at ${wait} mins.`,
            severity: 'critical',
            status: 'active'
          });
        }

        return {
          ...q,
          current_people: newCount,
          estimated_wait_min: wait,
          status
        };
      }));
    }, 4000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, addAlert]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        user,
        login,
        demoLogin,
        register,
        logout,
        queues,
        updateQueue,
        adjustCounters,
        alerts,
        resolveAlert,
        deleteAlert,
        addAlert,
        clearAllAlerts,
        settings,
        updateSettings,
        toasts,
        addToast,
        removeToast,
        isSimulating,
        setIsSimulating,
        simulationSpeed,
        setSimulationSpeed,
        triggerRushHourSurge,
        resetQueueData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
