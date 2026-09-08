import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import {
  BarChart3,
  Calendar,
  Filter,
  Users,
  Clock,
  TrendingUp,
  Zap,
  CheckCircle2,
  Download,
  Flame,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { queues } = useApp();

  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Dynamic statistics based on selected timeframe
  const multiplier = timeRange === 'monthly' ? 30 : timeRange === 'weekly' ? 7 : 1;
  const totalProcessed = 1842 * multiplier;
  const avgWaitTime = timeRange === 'monthly' ? 12.8 : timeRange === 'weekly' ? 12.1 : 11.4;
  const maxQueueLength = timeRange === 'monthly' ? 58 : timeRange === 'weekly' ? 52 : 47;
  const avgServiceTime = '48 sec';

  // Chart data: Hourly traffic & inflow vs outflow
  const hourlyData = [
    { hour: '08:00', inflow: 45, outflow: 42, avgWait: 4, queueLength: 8 },
    { hour: '09:00', inflow: 92, outflow: 85, avgWait: 7, queueLength: 15 },
    { hour: '10:00', inflow: 140, outflow: 130, avgWait: 10, queueLength: 22 },
    { hour: '11:00', inflow: 185, outflow: 165, avgWait: 14, queueLength: 32 },
    { hour: '12:00', inflow: 245, outflow: 210, avgWait: 19, queueLength: 42 },
    { hour: '13:00', inflow: 280, outflow: 250, avgWait: 24, queueLength: 47 },
    { hour: '14:00', inflow: 210, outflow: 220, avgWait: 16, queueLength: 33 },
    { hour: '15:00', inflow: 175, outflow: 180, avgWait: 12, queueLength: 26 },
    { hour: '16:00', inflow: 195, outflow: 188, avgWait: 13, queueLength: 30 },
    { hour: '17:00', inflow: 230, outflow: 215, avgWait: 18, queueLength: 38 },
    { hour: '18:00', inflow: 160, outflow: 170, avgWait: 11, queueLength: 21 },
    { hour: '19:00', inflow: 95, outflow: 105, avgWait: 6, queueLength: 11 }
  ];

  // Waiting time distribution percentiles (p50, p75, p90, p99)
  const waitPercentiles = [
    { percentile: 'p50 (Median)', waitMinutes: 6.2, standard: 10 },
    { percentile: 'p75 (Upper)', waitMinutes: 11.5, standard: 15 },
    { percentile: 'p90 (Peak Line)', waitMinutes: 18.4, standard: 20 },
    { percentile: 'p99 (Outliers)', waitMinutes: 26.8, standard: 25 }
  ];

  // Queue efficiency score per location
  const efficiencyData = queues.map(q => ({
    name: q.name.split(' - ')[1] || q.name,
    efficiency: Math.min(99, Math.round(98 - (q.current_people / q.capacity) * 15)),
    capacityUtil: Math.round((q.current_people / q.capacity) * 100)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Controls & Filter Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Queue Intelligence &amp; Predictive Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical wait time modeling, spatial throughput analysis, and service rate audits.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-medium">
            {(['daily', 'weekly', 'monthly'] as const).map(period => (
              <button
                key={period}
                onClick={() => setTimeRange(period)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  timeRange === period
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Queue Filter */}
          <select
            value={selectedQueue}
            onChange={e => setSelectedQueue(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Queues</option>
            {queues.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Locations</option>
            <option value="canteen">Student Hub Food Court</option>
            <option value="hospital">Emergency &amp; Triage Wing</option>
            <option value="railway">Central Junction Booking Hall</option>
            <option value="bank">Downtown Branch Counters</option>
            <option value="gov">Civic Center Citizen Services</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="People Processed"
          value={totalProcessed.toLocaleString()}
          change={`+${timeRange === 'daily' ? '18%' : '24%'} throughput`}
          trend="up"
          trendGood={true}
          icon={<Users className="w-5 h-5 text-cyan-400" />}
          variant="cyan"
          subtext={`Cumulative (${timeRange})`}
        />
        <MetricCard
          title="Average Waiting Time"
          value={`${avgWaitTime} min`}
          change="-3.2 min vs baseline"
          trend="down"
          trendGood={true}
          icon={<Clock className="w-5 h-5 text-indigo-400" />}
          variant="indigo"
          subtext="Little's Law Average"
        />
        <MetricCard
          title="Peak Queue Length"
          value={`${maxQueueLength} ppl`}
          change="At 12:30 PM Rush"
          trend="neutral"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          variant="rose"
          subtext="Highest recorded spike"
        />
        <MetricCard
          title="Average Service Time"
          value={avgServiceTime}
          change="0.8 people/sec"
          trend="up"
          trendGood={true}
          icon={<Zap className="w-5 h-5 text-emerald-400" />}
          variant="emerald"
          subtext="Staff efficiency rating"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Hourly Flow & Wait Times */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Hourly Inflow vs Outflow Dynamic
              </h3>
              <p className="text-[11px] text-slate-400">
                Measures arrivals (&lambda;) vs departures (&mu;) to spot congestion formation
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              Throughput Curve
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="inflow" name="Arrivals (People In)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" name="Departures (People Out)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Queue Length Spikes Over Day */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Peak Queue Length Distribution &amp; Wait Time
              </h3>
              <p className="text-[11px] text-slate-400">
                Correlation between line size and average passenger wait duration
              </p>
            </div>
            <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              Congestion Curve
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="qLenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="queueLength" name="Queue Size (Persons)" stroke="#a855f7" strokeWidth={2} fill="url(#qLenGrad)" />
                <Line type="monotone" dataKey="avgWait" name="Wait Time (Mins)" stroke="#f59e0b" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Percentile Distribution & Efficiency Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Wait Time Percentiles */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40">
          <h3 className="text-sm font-bold text-white mb-1">
            Wait Time SLA Percentiles (p50 / p75 / p90 / p99)
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            90% of patrons are served within 18.4 minutes, meeting the 20-minute SLA threshold.
          </p>

          <div className="space-y-3">
            {waitPercentiles.map(wp => (
              <div key={wp.percentile} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{wp.percentile}</span>
                  <span className="font-mono font-bold text-cyan-400">{wp.waitMinutes} mins</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      wp.waitMinutes > 20 ? 'bg-rose-500' : wp.waitMinutes > 14 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(wp.waitMinutes / wp.standard) * 80}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter Efficiency Index */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/40">
          <h3 className="text-sm font-bold text-white mb-1">
            Queue Optimization &amp; Efficiency Score
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Calculated score based on Little&apos;s Law service rate and capacity compliance.
          </p>

          <div className="space-y-3">
            {efficiencyData.map(ed => (
              <div key={ed.name} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{ed.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Capacity Load: {ed.capacityUtil}%</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{ width: `${ed.efficiency}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {ed.efficiency}% Score
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
