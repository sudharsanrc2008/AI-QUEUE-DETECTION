import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../Common/StatusBadge';
import { PriorityBadge } from '../Common/PriorityBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  Bell,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  ThumbsUp,
  User,
  Check
} from 'lucide-react';

export const CitizenDashboard = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints, notifications, markNotificationRead, markAllNotificationsRead } = useComplaints();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // all, pending, resolved, notifications
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status !== 'resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const totalUpvotes = complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (activeTab === 'pending' && c.status === 'resolved') return false;
    if (activeTab === 'resolved' && c.status !== 'resolved') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Welcome Card */}
        <div className="bg-gradient-to-r from-teal-900 to-civic-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
                  {user.ward}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-200/80 mt-0.5">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('report')}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 active:scale-95"
          >
            + {t.hero.ctaReport}
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.dashboard.stats.myReports}</span>
              <FileText className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'ta' ? 'பதிவு செய்யப்பட்ட புகார்கள்' : 'All logged civic issues'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.dashboard.stats.pending}</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingCount}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              {lang === 'ta' ? 'களப்பணியில் உள்ளவை' : 'Active work orders'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.dashboard.stats.resolved}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{resolvedCount}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {lang === 'ta' ? 'தீர்வு புகைப்பட ஆதாரத்துடன்' : 'With photo proof'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.dashboard.stats.upvotesReceived}</span>
              <ThumbsUp className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-teal-700">{totalUpvotes}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'ta' ? 'குடிமக்கள் ஆதரவு' : 'Public support endorsements'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 gap-4 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: t.dashboard.tabs.all, count: totalCount },
              { id: 'pending', label: t.dashboard.tabs.active, count: pendingCount },
              { id: 'resolved', label: t.dashboard.tabs.resolved, count: resolvedCount },
              {
                id: 'notifications',
                label: t.dashboard.tabs.notifications,
                count: notifications.filter(n => !n.read).length,
                badgeColor: 'bg-red-500 text-white'
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    tab.badgeColor || (activeTab === tab.id ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600')
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {activeTab !== 'notifications' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ta' ? 'தேடுக...' : 'Filter complaints...'}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        {/* Content Body: Complaints or Notifications */}
        {activeTab === 'notifications' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <span>{t.dashboard.notificationsTitle}</span>
              </h3>
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                {t.dashboard.markAllRead}
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.complaintId) onNavigate('track', notif.complaintId);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    notif.read
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : 'bg-teal-50/60 border-teal-200 shadow-sm ring-1 ring-teal-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {lang === 'ta' ? notif.titleTa : notif.titleEn}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      {lang === 'ta' ? notif.messageTa : notif.messageEn}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {notif.complaintId && (
                    <span className="text-xs font-mono font-bold text-teal-700 bg-white px-2 py-1 rounded border border-teal-200 shrink-0">
                      {notif.complaintId} →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={complaint.image}
                      alt={complaint.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-200"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {complaint.id}
                        </span>
                        <StatusBadge status={complaint.status} />
                        <PriorityBadge priority={complaint.priority} />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {complaint.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{complaint.address}</span>
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onNavigate('track', complaint.id)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.common.track}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">
                  {t.dashboard.noComplaints}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
