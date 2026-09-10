import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CheckCircle, Copy, Check, Search, Home } from 'lucide-react';

export const SubmissionSuccessModal = ({ isOpen, complaint, onTrack, onGoHome }) => {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(complaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-teal-200 text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 bg-teal-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <CheckCircle className="w-10 h-10 text-teal-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {t.success.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          {t.success.subtitle}
        </p>

        {/* Complaint ID Box */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200">
          <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
            {t.success.yourId}
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-wider">
              {complaint.id}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white shadow-sm border border-teal-200 text-teal-700 hover:bg-teal-50 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-700 font-semibold mt-1 animate-pulse">
              {t.success.copied}
            </p>
          )}
          <p className="text-[10px] text-slate-500 mt-2">
            {t.success.copyNotice}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => onTrack(complaint.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>{t.success.trackBtn}</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>{t.success.backHomeBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
