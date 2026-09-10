import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { departments } from '../../data/departments';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  PieChart,
  Layers,
  Printer
} from 'lucide-react';

export const ReportsAnalyticsPage = () => {
  const { lang, t } = useLanguage();
  const { complaints } = useComplaints();

  const [dateRange, setDateRange] = useState('month'); // week, month, year
  const [selectedDept, setSelectedDept] = useState('all');
  const [reportGenerated, setReportGenerated] = useState(false);

  // Category counts
  const categoryCounts = {
    garbage: 0,
    pothole: 0,
    streetlight: 0,
    water_leakage: 0,
    damaged_road: 0,
    drainage: 0,
    environmental: 0,
    other: 0
  };

  // Status counts
  const statusCounts = {
    reported: 0,
    verified: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0
  };

  // Priority counts
  const priorityCounts = {
    low: 0,
    medium: 0,
    high: 0,
    emergency: 0
  };

  complaints.forEach((c) => {
    if (categoryCounts[c.category] !== undefined) categoryCounts[c.category]++;
    if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
    if (priorityCounts[c.priority] !== undefined) priorityCounts[c.priority]++;
  });

  const total = complaints.length;
  const maxCategoryVal = Math.max(...Object.values(categoryCounts), 1);

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Complaint ID', 'Title', 'Category', 'Address', 'Status', 'Priority', 'Department', 'Date'];
    const rows = complaints.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      `"${c.address.replace(/"/g, '""')}"`,
      c.status,
      c.priority,
      c.department,
      c.reportedDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NammaCityCare_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'ta' ? 'மாநகராட்சி பகுப்பாய்வு' : 'Municipal SLA & Performance'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.analytics.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.analytics.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.analytics.exportCsv}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {reportGenerated && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t.analytics.reportGenerated}</span>
          </div>
        )}

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Category Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {t.analytics.categoryBreakdown}
              </h3>
              <span className="text-xs text-slate-400 font-mono">100% Wards</span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.keys(categoryCounts).map((cat) => {
                const count = categoryCounts[cat];
                const pct = Math.round((count / total) * 100) || 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {t.categories[cat] || cat}
                      </span>
                      <span className="font-bold text-slate-900">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCategoryVal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Resolution Status Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {t.analytics.statusDistribution}
              </h3>
              <span className="text-xs text-emerald-600 font-bold">92.4% Target SLA</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {Object.keys(statusCounts).map((st) => {
                const count = statusCounts[st];
                const pct = Math.round((count / total) * 100) || 0;
                return (
                  <div
                    key={st}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-semibold text-slate-500 capitalize">
                      {t.statuses[st] || st}
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-2">{count}</p>
                    <span className="text-[10px] text-teal-600 font-bold mt-0.5">{pct}% of total</span>
                  </div>
                );
              })}
            </div>

            {/* Department Performance Cards */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                {t.analytics.deptPerformance}
              </h4>
              <div className="space-y-2">
                {departments.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-semibold text-slate-800">
                      {t.departments[d.id] || d.id}
                    </span>
                    <span className="font-bold text-emerald-600">
                      Avg: {(d.slaHours * 0.08).toFixed(1)} days (SLA {d.slaHours}h)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Spread & Insights */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-teal-500/30 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'அவசரப் புகார்கள்' : 'Emergency Hazards'}
              </p>
              <p className="text-3xl font-black text-red-400 mt-1">{priorityCounts.emergency}</p>
              <p className="text-xs text-slate-400 mt-1">100% responded &lt; 24 hrs</p>
            </div>

            <div>
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'முக்கிய முன்னுரிமை' : 'High Priority'}
              </p>
              <p className="text-3xl font-black text-orange-400 mt-1">{priorityCounts.high}</p>
              <p className="text-xs text-slate-400 mt-1">Near schools / hospitals</p>
            </div>

            <div>
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'நடுத்தர முன்னுரிமை' : 'Medium Priority'}
              </p>
              <p className="text-3xl font-black text-amber-300 mt-1">{priorityCounts.medium}</p>
              <p className="text-xs text-slate-400 mt-1">Target 48h repair</p>
            </div>

            <div>
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'குறைந்த முன்னுரிமை' : 'Routine Maintenance'}
              </p>
              <p className="text-3xl font-black text-emerald-300 mt-1">{priorityCounts.low}</p>
              <p className="text-xs text-slate-400 mt-1">Scheduled road inspection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
