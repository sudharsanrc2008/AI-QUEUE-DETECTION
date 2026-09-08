import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertSeverity, AlertStatus } from '../types';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
  Sliders,
  Filter,
  Plus,
  Zap,
  Clock,
  Shield,
  Search,
  CheckCheck
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    resolveAlert,
    deleteAlert,
    addAlert,
    clearAllAlerts,
    settings,
    updateSettings,
    queues,
    addToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Configuration modal temporary state
  const [tempQueueLimit, setTempQueueLimit] = useState(settings.queue_limit);
  const [tempWaitLimit, setTempWaitLimit] = useState(settings.waiting_time_limit);
  const [tempConfLimit, setTempConfLimit] = useState(settings.confidence_threshold);

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.message.toLowerCase().includes(q) ||
        a.queue_name.toLowerCase().includes(q) ||
        a.alert_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      queue_limit: tempQueueLimit,
      waiting_time_limit: tempWaitLimit,
      confidence_threshold: tempConfLimit
    });
    setShowConfigModal(false);
  };

  const handleTestAlert = () => {
    const testQueue = queues[Math.floor(Math.random() * queues.length)];
    addAlert({
      queue_id: testQueue.id,
      queue_name: testQueue.name,
      alert_type: 'Capacity Threshold Exceeded',
      message: `${testQueue.name} exceeded capacity threshold of ${settings.queue_limit} people. Currently at ${testQueue.current_people + 5} detected occupants.`,
      severity: 'critical',
      status: 'active'
    });
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Intelligent Alert Dispatch &amp; Incidents
            </h1>
            {criticalCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                {criticalCount} Critical
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications for overcrowding, SLA waiting time breaches, and optical camera dropouts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTestAlert}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Trigger Test Alert</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Configure Thresholds</span>
          </button>

          {alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 transition-colors"
              title="Clear all alerts history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts by queue, keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
            {(['all', 'active', 'resolved'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s} {s === 'active' && `(${activeCount})`}
              </button>
            ))}
          </div>

          {/* Severity Filters */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Informational</option>
          </select>
        </div>

      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel border border-slate-800 bg-slate-900/20 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Incidents</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All monitored queues and camera streams are currently operating within your designated threshold specifications.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                alert.status === 'resolved'
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : alert.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Left: Severity icon + description */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {alert.alert_type}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {alert.queue_name}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded ${
                      alert.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {alert.message}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                    <span>Logged: {alert.timestamp}</span>
                    {alert.resolved_at && (
                      <>
                        <span>&bull;</span>
                        <span className="text-emerald-400">Resolved: {alert.resolved_at}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: Actions (Resolve / Delete) */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {alert.status === 'active' && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Acknowledge &amp; Resolve</span>
                  </button>
                )}

                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 bg-slate-900 border border-slate-800 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Configure Thresholds Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Configure AI Alert Thresholds</h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Queue Capacity Limit (Occupants)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={tempQueueLimit}
                    onChange={e => setTempQueueLimit(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="w-12 font-mono text-cyan-400 text-sm font-bold text-right">
                    {tempQueueLimit} ppl
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Generates critical overcrowding alert when headcount exceeds this number.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Waiting Time Limit (Minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={tempWaitLimit}
                    onChange={e => setTempWaitLimit(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="w-12 font-mono text-purple-400 text-sm font-bold text-right">
                    {tempWaitLimit} min
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  SLA compliance alert triggered if Little&apos;s Law wait calculation surpasses this value.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Optical Detection Confidence Cutoff (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={tempConfLimit}
                    onChange={e => setTempConfLimit(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="w-12 font-mono text-emerald-400 text-sm font-bold text-right">
                    {tempConfLimit}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Flags camera occlusion or degradation when detection confidence drops below cutoff.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  Apply &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
