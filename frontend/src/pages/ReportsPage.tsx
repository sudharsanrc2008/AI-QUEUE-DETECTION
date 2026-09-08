import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { queues, addToast } = useApp();

  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportDate] = useState<string>(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const multiplier = reportPeriod === 'monthly' ? 30 : reportPeriod === 'weekly' ? 7 : 1;
  const totalProcessed = 1842 * multiplier;
  const avgWaitTime = reportPeriod === 'monthly' ? 12.8 : reportPeriod === 'weekly' ? 12.1 : 11.4;
  const peakQueueLength = reportPeriod === 'monthly' ? 58 : reportPeriod === 'weekly' ? 52 : 47;
  const peakHours = '12:30 PM - 02:00 PM';
  const overcrowdingEvents = 6 * multiplier;
  const queueEfficiency = '93.6% (Grade A)';

  // Dynamic CSV Download handler
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'SmartQueue AI - Executive Audit Report\n';
    csvContent += `Generated On:,"${new Date().toISOString()}"\n`;
    csvContent += `Reporting Period:,${reportPeriod.toUpperCase()}\n`;
    csvContent += `Total Processed:,${totalProcessed}\n`;
    csvContent += `Average Waiting Time:,${avgWaitTime} mins\n`;
    csvContent += `Peak Queue Length:,${peakQueueLength} occupants\n\n`;
    
    csvContent += 'Queue ID,Queue Name,Location,Occupants,Estimated Wait (mins),Status,Active Counters,Camera ID,Confidence\n';
    queues.forEach(q => {
      csvContent += `"${q.id}","${q.name}","${q.location}",${q.current_people},${q.estimated_wait_min},"${q.status}",${q.counters_open},"${q.camera_id}",${q.confidence}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartQueue_Report_${reportPeriod}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Downloaded', `Exported ${reportPeriod} report as CSV spreadsheet.`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Executive Queue Audit Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal compliance documentation, throughput analytics, and capacity audit logs.
          </p>
        </div>

        {/* Period Selector & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-medium">
            {(['daily', 'weekly', 'monthly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  reportPeriod === p
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500 transition-all shadow-md shadow-cyan-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xl tracking-tight text-white">SmartQueue AI</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Official Report
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI Immersion Project &bull; Computer Vision Real-Time Queue Detection
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400">
            <p className="text-white font-bold">{reportDate}</p>
            <p className="capitalize">Scope: {reportPeriod} Audit</p>
            <p className="text-cyan-400">Ref: SQ-REP-{(Date.now() % 100000)}</p>
          </div>
        </div>

        {/* 6 Metric Summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Total Processed</span>
            <p className="text-xl font-bold text-white font-mono mt-1">{totalProcessed.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-400">+14% vs avg</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Avg Wait Time</span>
            <p className="text-xl font-bold text-indigo-300 font-mono mt-1">{avgWaitTime} min</p>
            <span className="text-[10px] text-cyan-400">Little&apos;s Law</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Peak Queue Length</span>
            <p className="text-xl font-bold text-amber-300 font-mono mt-1">{peakQueueLength} ppl</p>
            <span className="text-[10px] text-slate-400">Max instantaneous</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Peak Hours</span>
            <p className="text-xs font-bold text-purple-300 font-mono mt-1 leading-snug">{peakHours}</p>
            <span className="text-[10px] text-slate-400">Highest density</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Overcrowd Events</span>
            <p className="text-xl font-bold text-rose-400 font-mono mt-1">{overcrowdingEvents}</p>
            <span className="text-[10px] text-rose-400/80">SLA Exceeded</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Queue Efficiency</span>
            <p className="text-xs font-bold text-emerald-400 font-mono mt-1 leading-snug">{queueEfficiency}</p>
            <span className="text-[10px] text-emerald-400">Optimal</span>
          </div>
        </div>

        {/* Detailed Performance Table */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Monitored Counter Locations Breakdown
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Queue ID &amp; Location</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Est. Wait</th>
                  <th className="px-4 py-3">Service Time</th>
                  <th className="px-4 py-3">Open Desks</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                {queues.map(q => (
                  <tr key={q.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                      <div>{q.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{q.location}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-cyan-300 font-bold">{q.current_people} ppl</td>
                    <td className="px-4 py-3 font-mono">{q.capacity} max</td>
                    <td className="px-4 py-3 font-mono text-purple-300">{q.estimated_wait_min} min</td>
                    <td className="px-4 py-3 font-mono">{q.avg_service_time_sec}s</td>
                    <td className="px-4 py-3 font-mono text-indigo-300">{q.counters_open} desks</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        q.status === 'Overcrowded'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : q.status === 'Busy'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations & Observations */}
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-3">
          <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Prescriptive Optimization Insights
          </h4>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li>
              <strong>Railway Ticket Counter:</strong> Exceeded 90% capacity during peak noon rush. Recommend allocating a 3rd teller window from 12:00 to 14:00 to reduce wait from 32m to 14m.
            </li>
            <li>
              <strong>Hospital Reception:</strong> Triage waiting times averaged 18 minutes. Visual stanchion guidelines are recommended to prevent camera occlusion during patient check-in.
            </li>
            <li>
              <strong>College Canteen:</strong> Dual-checkout self-service implementation successfully decreased average patron wait by 28% compared to last week.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
