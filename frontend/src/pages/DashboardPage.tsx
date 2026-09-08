import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import {
  Users,
  Clock,
  Layers,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Play,
  Pause,
  Zap,
  RotateCcw,
  Plus,
  Minus,
  Video,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    queues,
    alerts,
    isSimulating,
    setIsSimulating,
    simulationSpeed,
    setSimulationSpeed,
    triggerRushHourSurge,
    resetQueueData,
    adjustCounters,
    setCurrentPage
  } = useApp();

  const [selectedQueueFilter, setSelectedQueueFilter] = useState<string>('all');

  // Compute aggregate KPI metrics
  const totalPeople = queues.reduce((sum, q) => sum + q.current_people, 0);
  const avgWaitTime = Math.round(
    queues.reduce((sum, q) => sum + q.estimated_wait_min, 0) / (queues.length || 1)
  );
  const activeQueuesCount = queues.length;
  const overcrowdedCount = queues.filter(q => q.status === 'Overcrowded').length;
  const avgQueueLength = Math.round((totalPeople / (queues.length || 1)) * 10) / 10;
  const avgAccuracy = 96.4;

  // Real-time timeline charts data
  const queueLengthTimeline = [
    { time: '10:00', 'Queue A': 8, 'Queue B': 14, 'Queue C': 22, 'Total': 44 },
    { time: '10:15', 'Queue A': 10, 'Queue B': 18, 'Queue C': 28, 'Total': 56 },
    { time: '10:30', 'Queue A': 12, 'Queue B': 24, 'Queue C': 34, 'Total': 70 },
    { time: '10:45', 'Queue A': 15, 'Queue B': 29, 'Queue C': 41, 'Total': 85 },
    { time: '11:00', 'Queue A': 13, 'Queue B': 26, 'Queue C': 38, 'Total': 77 },
    { time: '11:15', 'Queue A': queues[0]?.current_people || 14, 'Queue B': queues[1]?.current_people || 27, 'Queue C': queues[2]?.current_people || 42, 'Total': totalPeople }
  ];

  const waitTimeTimeline = [
    { time: '10:00', 'Wait Time': 7, threshold: 20 },
    { time: '10:15', 'Wait Time': 9, threshold: 20 },
    { time: '10:30', 'Wait Time': 13, threshold: 20 },
    { time: '10:45', 'Wait Time': 18, threshold: 20 },
    { time: '11:00', 'Wait Time': 16, threshold: 20 },
    { time: '11:15', 'Wait Time': avgWaitTime, threshold: 20 }
  ];

  const enteringVsLeavingData = [
    { hour: '09:00', entering: 68, leaving: 62 },
    { hour: '10:00', entering: 110, leaving: 98 },
    { hour: '11:00', entering: 154, leaving: 132 },
    { hour: '12:00', entering: 220, leaving: 185 },
    { hour: '13:00', entering: 260, leaving: 235 },
    { hour: '14:00', entering: 190, leaving: 205 }
  ];

  const queueActivityByHour = [
    { hour: '08:00', people: 45, max_queue: 12 },
    { hour: '09:00', people: 92, max_queue: 19 },
    { hour: '10:00', people: 140, max_queue: 28 },
    { hour: '11:00', people: 185, max_queue: 38 },
    { hour: '12:00', people: 245, max_queue: 48 },
    { hour: '13:00', people: 280, max_queue: 52 },
    { hour: '14:00', people: 210, max_queue: 39 },
    { hour: '15:00', people: 175, max_queue: 31 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Busy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Overcrowded':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const filteredQueues = selectedQueueFilter === 'all'
    ? queues
    : queues.filter(q => q.status.toLowerCase() === selectedQueueFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Simulation Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Operations Control Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Live Feed Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-counter tracking, queue density surveillance, and wait time optimization.
          </p>
        </div>

        {/* Simulation Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSimulating
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Pause Engine' : 'Resume Engine'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  simulationSpeed === spd
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Simulate Surge */}
          <button
            onClick={triggerRushHourSurge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
            title="Inject an artificial influx of 15-20 people across queues to test alert dispatch"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Surge</span>
          </button>

          {/* Reset Baseline */}
          <button
            onClick={resetQueueData}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Reset queue counts to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="People in Queue"
          value={totalPeople}
          change="+12% flow"
          trend="up"
          trendGood={false}
          icon={<Users className="w-5 h-5 text-cyan-400" />}
          variant="cyan"
          subtext="Across 5 active zones"
        />
        <MetricCard
          title="Avg Waiting Time"
          value={`${avgWaitTime} min`}
          change="-2 min vs 1hr ago"
          trend="down"
          trendGood={true}
          icon={<Clock className="w-5 h-5 text-indigo-400" />}
          variant="indigo"
          subtext="Formula: W = L / λ"
        />
        <MetricCard
          title="Active Queues"
          value={activeQueuesCount}
          icon={<Layers className="w-5 h-5 text-purple-400" />}
          variant="purple"
          subtext="5 locations online"
        />
        <MetricCard
          title="Overcrowd Alerts"
          value={overcrowdedCount}
          alertBadge={overcrowdedCount > 0 ? 'Action Req' : undefined}
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          variant="rose"
          subtext={overcrowdedCount > 0 ? 'Queues over capacity' : 'Safe limits'}
        />
        <MetricCard
          title="Avg Queue Length"
          value={`${avgQueueLength} ppl`}
          change="+0.8 people"
          trend="up"
          trendGood={false}
          icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
          variant="amber"
          subtext="Density per counter"
        />
        <MetricCard
          title="Detection Accuracy"
          value={`${avgAccuracy}%`}
          change="+0.4% mAP"
          trend="up"
          trendGood={true}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          variant="emerald"
          subtext="YOLOv8x Confidence"
        />
      </div>

      {/* Real-time Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Queue Length Over Time */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Queue Length Over Time (Real-Time Area)
              </h3>
              <p className="text-[11px] text-slate-400">
                Tracking individuals inside ROI perimeter over recent intervals
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              Live Updates
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={queueLengthTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="qCGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Total" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#totalGrad)" />
                <Area type="monotone" dataKey="Queue C" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#qCGrad)" />
                <Area type="monotone" dataKey="Queue B" stroke="#22d3ee" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Waiting Time Over Time with Threshold */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Estimated Waiting Time vs Safe SLA Threshold
              </h3>
              <p className="text-[11px] text-slate-400">
                Red dashed line indicates maximum permissible threshold (20 mins)
              </p>
            </div>
            <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              SLA Compliance
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waitTimeTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <ReferenceLine y={20} label={{ value: 'SLA Max (20m)', fill: '#f43f5e', fontSize: 10 }} stroke="#f43f5e" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="Wait Time" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: People Entering vs Leaving (Throughput) */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Throughput: People Entering vs People Leaving
              </h3>
              <p className="text-[11px] text-slate-400">
                Flow balance per hour across all terminal counters
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Velocity Index
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enteringVsLeavingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="entering" name="Entering Inflow" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leaving" name="Leaving Outflow" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Queue Activity by Hour */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Queue Activity &amp; Peak Hour Distribution
              </h3>
              <p className="text-[11px] text-slate-400">
                Total persons processed vs highest recorded instantaneous queue length
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Peak Hours
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queueActivityByHour} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="people" name="Total Processed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max_queue" name="Max Queue Length" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Live Queue Status Section */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Live Queue Status &amp; Real-Time Counter Allocation
            </h2>
            <p className="text-xs text-slate-400">
              Live computer-vision metrics per location. Dynamically adjust active counters to evaluate Little&apos;s Law wait times.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {['all', 'normal', 'busy', 'overcrowded'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedQueueFilter(filter)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  selectedQueueFilter === filter
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Queues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQueues.map(q => (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                q.status === 'Overcrowded'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/30'
                  : q.status === 'Busy'
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{q.name}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>{q.location}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-cyan-400">{q.camera_id}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(q.status)}`}>
                  {q.status}
                </span>
              </div>

              {/* Progress Bar of Capacity */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Capacity Load</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {q.current_people} / {q.capacity} ({Math.round((q.current_people / q.capacity) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      q.status === 'Overcrowded'
                        ? 'bg-rose-500'
                        : q.status === 'Busy'
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, (q.current_people / q.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Detected People</span>
                  <p className="text-lg font-bold text-white font-mono">{q.current_people}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Estimated Wait</span>
                  <p className={`text-lg font-bold font-mono ${q.estimated_wait_min > 20 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {q.estimated_wait_min} min
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Counters Open</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-indigo-300 font-mono">{q.counters_open}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustCounters(q.id, -1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Close counter"
                        disabled={q.counters_open <= 1}
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => adjustCounters(q.id, 1)}
                        className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                        title="Deploy counter"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</span>
                  <p className="text-sm font-bold text-emerald-400 font-mono mt-1">{q.confidence}%</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Service: {q.avg_service_time_sec}s/person
                </span>
                <button
                  onClick={() => setCurrentPage('detection')}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Open Feed</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
