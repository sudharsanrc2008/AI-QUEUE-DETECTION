import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { departments } from '../../data/departments';
import { sampleImages } from '../../data/sampleImages';
import { StatusBadge } from '../Common/StatusBadge';
import { PriorityBadge } from '../Common/PriorityBadge';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Camera,
  Upload,
  X,
  Check,
  Building2,
  ChevronDown
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints, updateComplaintStatus, assignDepartment, updatePriority } = useComplaints();
  const { user } = useAuth();

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Officer Action Modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState('in_progress');
  const [targetDept, setTargetDept] = useState('');
  const [targetPriority, setTargetPriority] = useState('high');
  const [officerComment, setOfficerComment] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState('');

  // Stats
  const totalCount = complaints.length + 1242;
  const newCount = complaints.filter(c => c.status === 'reported').length + 82;
  const highPriorityCount = complaints.filter(c => c.priority === 'high').length + 38;
  const emergencyCount = complaints.filter(c => c.priority === 'emergency').length + 6;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length + 1064;

  // Filtered rows
  const filteredRows = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (deptFilter !== 'all' && c.department !== deptFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
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

  const handleOpenActionModal = (complaint) => {
    setSelectedComplaint(complaint);
    setTargetStatus(complaint.status);
    setTargetDept(complaint.department);
    setTargetPriority(complaint.priority);
    setOfficerComment('');
    // Auto populate sample resolution photo if category matches
    const defaultRes = sampleImages[complaint.category]?.resolutionUrl || '';
    setResolutionPhoto(complaint.resolutionImage || defaultRes);
    setModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    // Update status and photo if resolved
    updateComplaintStatus(
      selectedComplaint.id,
      targetStatus,
      officerComment || 'Officer reviewed and updated status.',
      targetStatus === 'resolved' ? resolutionPhoto : null,
      user.name
    );

    // Update department if changed
    if (targetDept !== selectedComplaint.department) {
      assignDepartment(selectedComplaint.id, targetDept, user.name, 'Department reassigned by officer.');
    }

    // Update priority if changed
    if (targetPriority !== selectedComplaint.priority) {
      updatePriority(selectedComplaint.id, targetPriority);
    }

    setModalOpen(false);
  };

  // Quick action: Direct Verify
  const handleQuickVerify = (complaint) => {
    updateComplaintStatus(
      complaint.id,
      'verified',
      'Field AE verified the issue dimensions and validity.',
      null,
      user.name
    );
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Officer Authority Header */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-amber-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.admin.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{t.admin.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {t.admin.subtitle} • {user.name} ({user.ward})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('analytics')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors"
            >
              {lang === 'ta' ? 'புள்ளிவிவர அறிக்கைகள் →' : 'SLA Analytics →'}
            </button>
          </div>
        </div>

        {/* 6 Official Redressal KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{t.admin.stats.total}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
            <span className="text-[10px] text-teal-600 font-medium">All municipal wards</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
            <p className="text-[11px] font-bold text-blue-600 uppercase">{t.admin.stats.newReports}</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{newCount}</p>
            <span className="text-[10px] text-blue-600 font-medium">Awaiting AE check</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-sm">
            <p className="text-[11px] font-bold text-orange-600 uppercase">{t.admin.stats.highPriority}</p>
            <p className="text-2xl font-black text-orange-600 mt-1">{highPriorityCount}</p>
            <span className="text-[10px] text-orange-600 font-medium">Urgent dispatch</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/30 shadow-sm">
            <p className="text-[11px] font-bold text-red-600 uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>{t.admin.stats.emergency}</span>
            </p>
            <p className="text-2xl font-black text-red-600 mt-1">{emergencyCount}</p>
            <span className="text-[10px] text-red-600 font-medium">&lt; 24h SLA target</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
            <p className="text-[11px] font-bold text-emerald-600 uppercase">{t.admin.stats.resolved}</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Verified closed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
            <p className="text-[11px] font-bold text-amber-700 uppercase">{t.admin.stats.avgSla}</p>
            <p className="text-2xl font-black text-amber-700 mt-1">2.8 d</p>
            <span className="text-[10px] text-emerald-600 font-medium">Within 72h limit</span>
          </div>
        </div>

        {/* Filters and Search Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.admin.filters.searchPlaceholder}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{t.admin.filters.allStatuses}</option>
              <option value="reported">{t.statuses.reported}</option>
              <option value="verified">{t.statuses.verified}</option>
              <option value="assigned">{t.statuses.assigned}</option>
              <option value="in_progress">{t.statuses.in_progress}</option>
              <option value="resolved">{t.statuses.resolved}</option>
            </select>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{t.admin.filters.allDepts}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {t.departments[d.id] || d.id}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{t.admin.filters.allPriorities}</option>
              <option value="emergency">{t.priorities.emergency}</option>
              <option value="high">{t.priorities.high}</option>
              <option value="medium">{t.priorities.medium}</option>
              <option value="low">{t.priorities.low}</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-bold">
            {filteredRows.length} {lang === 'ta' ? 'புகார்கள் காட்டப்படுகின்றன' : 'Complaints listed'}
          </span>
        </div>

        {/* Complaint Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t.admin.table.id}</th>
                  <th className="py-3 px-4">{t.admin.table.issue}</th>
                  <th className="py-3 px-4">{t.admin.table.location}</th>
                  <th className="py-3 px-4">{t.admin.table.priority}</th>
                  <th className="py-3 px-4">{t.admin.table.department}</th>
                  <th className="py-3 px-4">{t.admin.table.status}</th>
                  <th className="py-3 px-4">{t.admin.table.date}</th>
                  <th className="py-3 px-4 text-right">{t.admin.table.actions}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRows.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                      {complaint.id}
                    </td>

                    {/* Issue Category & Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{complaint.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{complaint.description}</p>
                    </td>

                    {/* Ward / Location */}
                    <td className="py-3.5 px-4 max-w-[180px] text-slate-600 truncate">
                      {complaint.address}
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={complaint.priority} />
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {t.departments[complaint.department] || complaint.department}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={complaint.status} />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {new Date(complaint.reportedDate).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {complaint.status === 'reported' && (
                        <button
                          onClick={() => handleQuickVerify(complaint)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold"
                          title="Verify complaint"
                        >
                          {t.admin.actions.verify}
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenActionModal(complaint)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        {lang === 'ta' ? 'நிர்வாகம்' : 'Manage'}
                      </button>

                      <button
                        onClick={() => onNavigate('track', complaint.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        title="View Public Details"
                      >
                        <Eye className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Officer Action Modal */}
      {modalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {selectedComplaint.id}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t.admin.modal.title}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-4 space-y-4 text-xs">
              {/* Target Status */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.admin.modal.updateStatus}
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="reported">{t.statuses.reported}</option>
                  <option value="verified">{t.statuses.verified}</option>
                  <option value="assigned">{t.statuses.assigned}</option>
                  <option value="in_progress">{t.statuses.in_progress}</option>
                  <option value="resolved">{t.statuses.resolved}</option>
                </select>
              </div>

              {/* Department Reassign */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.admin.modal.changeDept}
                </label>
                <select
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {t.departments[d.id] || d.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Override */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.admin.modal.changePriority}
                </label>
                <select
                  value={targetPriority}
                  onChange={(e) => setTargetPriority(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="low">{t.priorities.low}</option>
                  <option value="medium">{t.priorities.medium}</option>
                  <option value="high">{t.priorities.high}</option>
                  <option value="emergency">{t.priorities.emergency}</option>
                </select>
              </div>

              {/* Officer Note */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.admin.modal.addOfficerNote}
                </label>
                <textarea
                  rows={2}
                  value={officerComment}
                  onChange={(e) => setOfficerComment(e.target.value)}
                  placeholder={t.admin.modal.notePlaceholder}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              {/* Resolution Photo Attachment if status resolved or in progress */}
              {(targetStatus === 'resolved' || targetStatus === 'in_progress') && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <label className="block font-bold text-emerald-900 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.admin.modal.uploadResolutionPhoto}</span>
                  </label>
                  <input
                    type="text"
                    value={resolutionPhoto}
                    onChange={(e) => setResolutionPhoto(e.target.value)}
                    placeholder="Paste resolution photo URL or use default..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-emerald-300 bg-white"
                  />
                  {resolutionPhoto && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-emerald-200 bg-slate-900 max-h-32">
                      <img
                        src={resolutionPhoto}
                        alt="Resolution Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  {t.common.cancel}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm transition-all"
                >
                  {t.admin.modal.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
