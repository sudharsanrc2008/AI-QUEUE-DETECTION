import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Camera,
  Bell,
  Sun,
  Moon,
  Save,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Volume2,
  VolumeX,
  Eye,
  ShieldAlert
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, addToast } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [hasSaved, setHasSaved] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults = {
      queue_limit: 30,
      waiting_time_limit: 20,
      confidence_threshold: 75,
      camera_fps: 30,
      detection_mode: 'simulation' as const,
      audio_alerts: true,
      auto_refresh: true,
      theme: 'dark' as const,
      ai_tracker: 'ByteTrack',
      enable_rois: true
    };
    setFormData(defaults);
    updateSettings(defaults);
    addToast('Defaults Restored', 'System settings reset to default values.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            System &amp; AI Vision Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure computer vision thresholds, hardware camera FPS, and alerting protocols.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Queue Limits & Thresholds */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Queue Capacity &amp; SLA Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-300 mb-1.5">
                <span>Maximum Queue Capacity Limit</span>
                <span className="font-mono text-cyan-400 font-bold">{formData.queue_limit} persons</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={formData.queue_limit}
                onChange={e => handleChange('queue_limit', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Triggers critical overcrowding incident alert when headcount exceeds this count.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-300 mb-1.5">
                <span>Maximum Waiting Time Limit</span>
                <span className="font-mono text-purple-400 font-bold">{formData.waiting_time_limit} mins</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={formData.waiting_time_limit}
                onChange={e => handleChange('waiting_time_limit', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Threshold for Little&apos;s Law wait time estimation before supervisor warning alert.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: AI Detection & Vision Engine */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Detection &amp; Tracking Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-300 mb-1.5">
                <span>Detection Confidence Threshold</span>
                <span className="font-mono text-emerald-400 font-bold">{formData.confidence_threshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={formData.confidence_threshold}
                onChange={e => handleChange('confidence_threshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Minimum inference confidence score required to register a person bounding box.
              </p>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1.5">
                Multi-Object Tracking Algorithm
              </label>
              <select
                value={formData.ai_tracker}
                onChange={e => handleChange('ai_tracker', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="ByteTrack">ByteTrack (High FPS Low Occlusion)</option>
                <option value="DeepSORT">DeepSORT (Appearance Embedding Re-ID)</option>
                <option value="BoT-SORT">BoT-SORT (Camera Motion Compensation)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Association algorithm used to maintain persistent IDs across video frames.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Camera & Video Hardware */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Camera className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Camera &amp; Video Hardware Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">
                Camera Sampling Target FPS
              </label>
              <select
                value={formData.camera_fps}
                onChange={e => handleChange('camera_fps', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value={15}>15 FPS (Resource Optimized)</option>
                <option value={24}>24 FPS (Cinematic Standard)</option>
                <option value={30}>30 FPS (Real-time Surveillance)</option>
                <option value={60}>60 FPS (High-Speed Edge GPU)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1.5">
                Primary Surveillance Mode
              </label>
              <select
                value={formData.detection_mode}
                onChange={e => handleChange('detection_mode', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="simulation">Simulated Computer Vision Feed</option>
                <option value="webcam">Physical USB/Laptop Webcam</option>
                <option value="upload">Video / Image Upload Testing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Interface & Notifications */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Interface &amp; Notification Alerts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                {formData.theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <div>
                  <span className="font-semibold text-white block">Theme Appearance</span>
                  <span className="text-[10px] text-slate-400">Current: {formData.theme.toUpperCase()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChange('theme', formData.theme === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white capitalize"
              >
                Switch to {formData.theme === 'dark' ? 'light' : 'dark'}
              </button>
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                {formData.audio_alerts ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <div>
                  <span className="font-semibold text-white block">Audio Chime Alerts</span>
                  <span className="text-[10px] text-slate-400">Audio feedback on critical events</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.audio_alerts}
                onChange={e => handleChange('audio_alerts', e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {hasSaved && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Settings persisted successfully!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>
        </div>

      </form>

    </div>
  );
};
