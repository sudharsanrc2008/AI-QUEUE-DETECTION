import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { PlusCircle, Search, MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const HeroSection = ({ onSelectCategory, onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints } = useComplaints();

  const totalReports = complaints.length;
  const resolvedReports = complaints.filter(c => c.status === 'resolved').length;
  const inProgressReports = complaints.filter(c => c.status === 'in_progress').length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 92;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-civic-900 to-slate-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative background grid & blur */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              <span>
                {lang === 'ta'
                  ? 'செயற்கை நுண்ணறிவு (AI) மூலம் உடனடியாக புகார்களை ஆய்வு செய்யும் வசதி'
                  : 'AI-Powered Computer Vision & Smart Department Dispatch'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug">
              <span className="block text-white">
                {t.hero.headline}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100 mt-2">
                {t.tagline}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('report')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-2.5 group active:scale-95"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>{t.hero.ctaReport}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('track')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-teal-400" />
                <span>{t.hero.ctaTrack}</span>
              </button>

              <button
                onClick={() => onNavigate('nearby')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-teal-950/40 hover:bg-teal-950/70 text-teal-200 font-semibold text-sm border border-teal-700/50 transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.ctaNearby}</span>
              </button>
            </div>

            {/* Micro assurance */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                {lang === 'ta' ? 'உடனடி புகார் எண் (SMS / WhatsApp)' : 'Instant Complaint ID'}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                {lang === 'ta' ? 'அதிகாரப்பூர்வ மாநகராட்சி கண்காணிப்பு' : 'Direct Municipal Redressal'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                {lang === 'ta' ? '2.8 நாட்களில் தீர்வு' : '2.8 Days Avg Resolution'}
              </span>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur border border-teal-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    {lang === 'ta' ? 'நேரலை நகர்ப்புற புள்ளிவிவரங்கள்' : 'Live Civic Redressal Feed'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {lang === 'ta' ? 'இன்றைய நிலவரம்' : 'Updated Just Now'}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">{t.hero.stats.totalReported}</p>
                  <p className="text-2xl font-black text-white mt-1">
                    {totalReports + 1242}
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">
                    ↑ {lang === 'ta' ? 'இன்று +42 புகார்கள்' : '+42 logged today'}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">{t.hero.stats.resolvedCount}</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">
                    {resolvedReports + 1066}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'ta' ? 'புகைப்பட ஆதாரத்துடன்' : 'With photo proof'}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">{t.hero.stats.resolutionRate}</p>
                  <p className="text-2xl font-black text-teal-300 mt-1">
                    {resolutionRate}%
                  </p>
                  <p className="text-[10px] text-teal-400 mt-0.5">
                    {lang === 'ta' ? 'துறை வாரியான சராசரி' : 'High SLA compliance'}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">{t.hero.stats.avgTime}</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">
                    2.8 {lang === 'ta' ? 'நாட்கள்' : 'Days'}
                  </p>
                  <p className="text-[10px] text-amber-300 mt-0.5">
                    {lang === 'ta' ? 'அவசரப் புகார்கள்: < 24 மணி' : 'Emergency: < 24 hrs'}
                  </p>
                </div>
              </div>

              {/* Sample Live Banner */}
              <div className="mt-2 bg-gradient-to-r from-teal-950 to-slate-900 p-3 rounded-xl border border-teal-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🗑️</span>
                  <div>
                    <p className="text-xs font-bold text-white">
                      NCC-2026-00125 • Anna Nagar
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {lang === 'ta' ? 'குப்பை அகற்றும் பணி நடைபெறுகிறது' : 'Compactor truck on site'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('track', 'NCC-2026-00125')}
                  className="px-2.5 py-1 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded transition-colors"
                >
                  {t.common.track}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
