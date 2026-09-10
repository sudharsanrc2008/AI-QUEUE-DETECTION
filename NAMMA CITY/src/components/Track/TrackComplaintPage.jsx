import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../Common/StatusBadge';
import { PriorityBadge } from '../Common/PriorityBadge';
import { CategoryIcon } from '../Common/CategoryIcon';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ThumbsUp,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export const TrackComplaintPage = ({ initialId, onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints, upvoteComplaint, verifyComplaintByCitizen, reportStillExists, addComment } = useComplaints();
  const { user } = useAuth();

  const [searchId, setSearchId] = useState(initialId || 'NCC-2026-00125');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [showExistsPrompt, setShowExistsPrompt] = useState(false);
  const [existsReason, setExistsReason] = useState('');

  // 5-stage timeline configuration
  const STAGES = ['reported', 'verified', 'assigned', 'in_progress', 'resolved'];

  // Lookup complaint on load or search
  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      doSearch(initialId);
    } else {
      doSearch(searchId);
    }
  }, [initialId, complaints]);

  const doSearch = (idToFind) => {
    const trimmed = (idToFind || '').trim().toUpperCase();
    if (!trimmed) return;

    const found = complaints.find((c) => c.id.toUpperCase() === trimmed);
    if (found) {
      setSelectedComplaint(found);
      setSearchError(false);
    } else {
      setSelectedComplaint(null);
      setSearchError(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    doSearch(searchId);
  };

  const handleUpvote = () => {
    if (!selectedComplaint) return;
    upvoteComplaint(selectedComplaint.id);
  };

  const handleVerifyResolution = () => {
    if (!selectedComplaint) return;
    verifyComplaintByCitizen(selectedComplaint.id);
  };

  const handleReportStillExists = () => {
    if (!selectedComplaint) return;
    reportStillExists(selectedComplaint.id, existsReason);
    setShowExistsPrompt(false);
    setExistsReason('');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedComplaint) return;
    addComment(selectedComplaint.id, newCommentText, user.name, user.role === 'admin' ? 'Official' : 'Citizen');
    setNewCommentText('');
  };

  // Helper to determine stage state (completed, current, pending)
  const getStageState = (stageKey) => {
    if (!selectedComplaint) return 'pending';
    const currentIndex = STAGES.indexOf(selectedComplaint.status);
    const stageIndex = STAGES.indexOf(stageKey);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.track.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {t.track.subtitle}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={t.track.searchPlaceholder}
                className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono uppercase bg-white shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow transition-all shrink-0 active:scale-95"
            >
              {t.track.searchBtn}
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3 text-xs text-slate-500">
            <span>{t.track.recentSearches}</span>
            {['NCC-2026-00125', 'NCC-2026-00124', 'NCC-2026-00123', 'NCC-2026-00122'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchId(id);
                  doSearch(id);
                }}
                className={`px-2 py-0.5 rounded font-mono text-[11px] border transition-colors ${
                  selectedComplaint?.id === id
                    ? 'bg-teal-100 border-teal-300 text-teal-900 font-bold'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Not Found Screen */}
        {searchError && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.track.notFoundTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t.track.notFoundMsg}
            </p>
          </div>
        )}

        {/* Detailed Complaint View */}
        {selectedComplaint && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Complaint Summary Banner */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-base font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                    {selectedComplaint.id}
                  </span>
                  <StatusBadge status={selectedComplaint.status} size="lg" />
                  <PriorityBadge priority={selectedComplaint.priority} size="lg" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedComplaint.address}</span>
                </p>
              </div>

              {/* Department & Officer Details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 shrink-0 md:text-right">
                <p className="text-slate-400 font-medium">
                  {lang === 'ta' ? 'ஒதுக்கப்பட்ட துறை:' : 'Assigned Department:'}
                </p>
                <p className="font-bold text-slate-900">
                  {t.departments[selectedComplaint.department] || selectedComplaint.department}
                </p>
                <p className="text-[11px] text-slate-500">
                  <span className="font-medium">{t.track.currentOfficer}:</span> {selectedComplaint.assignedOfficer}
                </p>
              </div>
            </div>

            {/* Visual Progress Timeline (5 Stages) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
                {lang === 'ta' ? 'நேரலை முன்னேற்றப் பாதை' : 'Live Grievance Resolution Lifecycle'}
              </h3>

              {/* Timeline Horizontal / Stepper */}
              <div className="relative">
                {/* Connecting track line */}
                <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-teal-500 transition-all duration-500"
                    style={{
                      width: `${(STAGES.indexOf(selectedComplaint.status) / (STAGES.length - 1)) * 100}%`
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {STAGES.map((stageKey, idx) => {
                    const state = getStageState(stageKey);
                    const label = t.statuses[stageKey];

                    return (
                      <div
                        key={stageKey}
                        className={`flex md:flex-col items-center md:text-center gap-3 md:gap-2 p-3 md:p-0 rounded-xl md:rounded-none ${
                          state === 'current'
                            ? 'bg-teal-50/70 md:bg-transparent border border-teal-200 md:border-none'
                            : ''
                        }`}
                      >
                        {/* Step Circle Indicator */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                            state === 'completed'
                              ? 'bg-teal-600 text-white shadow-md'
                              : state === 'current'
                              ? 'bg-white text-teal-700 ring-4 ring-teal-400 font-extrabold shadow-md'
                              : 'bg-slate-100 text-slate-400 border border-slate-300'
                          }`}
                        >
                          {state === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Label & Description */}
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              state === 'current'
                                ? 'text-teal-900'
                                : state === 'completed'
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 hidden md:block">
                            {state === 'completed'
                              ? (lang === 'ta' ? 'முடிந்தது' : 'Done')
                              : state === 'current'
                              ? (lang === 'ta' ? 'தற்போது' : 'Active Stage')
                              : (lang === 'ta' ? 'நிலுவை' : 'Pending')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Latest milestone note */}
              {selectedComplaint.timeline?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    {t.track.deptNotes}
                  </h4>
                  <div className="space-y-3">
                    {selectedComplaint.timeline.slice().reverse().map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between text-xs gap-3"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block">
                            {lang === 'ta' ? 'அதிகாரி / தளம்:' : 'By:'} {item.actor}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photos: Before & After Split */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                {t.track.beforeAfter}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Photo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {lang === 'ta' ? 'புகாரளிக்கப்பட்ட புகைப்படம் (முன்)' : 'Reported Photo (Before)'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(selectedComplaint.reportedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={selectedComplaint.image}
                      alt="Reported Issue"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Resolution Photo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {t.track.resolutionProof}
                    </span>
                    {selectedComplaint.resolvedDate && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {new Date(selectedComplaint.resolvedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-center p-4">
                    {selectedComplaint.resolutionImage ? (
                      <img
                        src={selectedComplaint.resolutionImage}
                        alt="Resolution Proof"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold">
                          {lang === 'ta'
                            ? 'தீர்வு புகைப்படம் இன்னும் பதிவேற்றப்படவில்லை'
                            : 'Resolution photo will be uploaded once field crew finishes repair'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {lang === 'ta' ? 'எதிர்பார்க்கப்படும் தேதி:' : 'Target:'}{' '}
                          {new Date(selectedComplaint.expectedResolutionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Community Verification & Feedback Actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  {t.track.citizenActions}
                </h3>
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {selectedComplaint.upvotes} {t.track.upvoteCount}
                  </span>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Upvote Button */}
                <button
                  type="button"
                  onClick={handleUpvote}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedComplaint.hasUserUpvoted
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>
                    {selectedComplaint.hasUserUpvoted
                      ? (lang === 'ta' ? 'ஆதரிக்கப்பட்டது ✓' : 'Upvoted ✓')
                      : t.track.upvoteBtn}
                  </span>
                </button>

                {/* Confirm Resolution Button */}
                {selectedComplaint.status === 'resolved' ? (
                  <button
                    type="button"
                    onClick={handleVerifyResolution}
                    disabled={selectedComplaint.verifiedByCitizen}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      selectedComplaint.verifiedByCitizen
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {selectedComplaint.verifiedByCitizen
                        ? t.track.verifiedByCitizen
                        : t.track.verifyResolvedBtn}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowExistsPrompt(true)}
                    className="py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{t.track.stillExistsBtn}</span>
                  </button>
                )}

                {/* City Map link */}
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>{lang === 'ta' ? 'வரைபடத்தில் பார்க்க' : 'Locate on City Map'}</span>
                </button>
              </div>

              {/* Still Exists Input Drawer */}
              {showExistsPrompt && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2 animate-in fade-in">
                  <p className="text-xs font-bold text-amber-900">
                    {lang === 'ta'
                      ? 'பிரச்சினை இன்னும் சரியாகவில்லை என அதிகாரிகளுக்கு தெரிவிக்கவும்:'
                      : 'Flag that the issue persists on ground for immediate inspection:'}
                  </p>
                  <input
                    type="text"
                    value={existsReason}
                    onChange={(e) => setExistsReason(e.target.value)}
                    placeholder="e.g. Water leak still active near house #42..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-amber-300 bg-white"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowExistsPrompt(false)}
                      className="px-3 py-1 rounded text-xs text-slate-600 hover:bg-slate-200"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={handleReportStillExists}
                      className="px-3 py-1 rounded text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                    >
                      {lang === 'ta' ? 'முன்னுரிமையை உயர்த்துக' : 'Escalate Priority'}
                    </button>
                  </div>
                </div>
              )}

              {/* Comment Thread */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">
                  {lang === 'ta' ? 'குடிமக்கள் & அதிகாரிகள் கருத்துகள்' : 'Community & Official Discussion'}
                </h4>

                {/* Existing comments */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedComplaint.comments?.length > 0 ? (
                    selectedComplaint.comments.map((c) => (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          c.role === 'Official'
                            ? 'bg-teal-50/70 border border-teal-200'
                            : 'bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{c.author}</span>
                            {c.role === 'Official' && (
                              <span className="text-[10px] bg-teal-600 text-white font-semibold px-1.5 py-0.2 rounded">
                                Official
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      {lang === 'ta' ? 'கருத்துகள் எதுவும் இல்லை.' : 'No comments yet. Share an update below.'}
                    </p>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={t.track.commentPlaceholder}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.track.addCommentBtn}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
