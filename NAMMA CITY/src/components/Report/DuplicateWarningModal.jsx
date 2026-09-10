import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AlertTriangle, ThumbsUp, PlusCircle, X, MapPin } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

export const DuplicateWarningModal = ({
  isOpen,
  onClose,
  existingComplaint,
  onSupportExisting,
  onSubmitAnyway
}) => {
  const { lang, t } = useLanguage();

  if (!isOpen || !existingComplaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-300">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-slate-900 text-base">
              {t.duplicate.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {t.duplicate.alertMsg}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Complaint Card */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {existingComplaint.id}
            </span>
            <StatusBadge status={existingComplaint.status} />
          </div>

          <p className="text-xs font-bold text-slate-800">
            {existingComplaint.title}
          </p>

          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{existingComplaint.address}</span>
          </p>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic bg-white p-2 rounded border border-slate-100">
            "{existingComplaint.description}"
          </p>

          <div className="mt-2 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>
              {existingComplaint.upvotes}{' '}
              {lang === 'ta' ? 'குடிமக்கள் ஆதரித்துள்ளனர்' : 'citizens have already upvoted this'}
            </span>
          </div>
        </div>

        {/* Action Choice Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => onSupportExisting(existingComplaint.id)}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{t.duplicate.supportBtn}</span>
          </button>

          <button
            onClick={onSubmitAnyway}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-slate-500" />
            <span>{t.duplicate.submitAnywayBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
