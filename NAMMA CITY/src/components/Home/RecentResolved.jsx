import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../Common/StatusBadge';
import { PriorityBadge } from '../Common/PriorityBadge';
import { CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const RecentResolved = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints } = useComplaints();

  // Filter resolved issues
  const resolvedList = complaints.filter(c => c.status === 'resolved' || c.resolutionImage).slice(0, 3);

  if (resolvedList.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ta' ? 'தீர்வு காணப்பட்டவை' : 'Verified Civic Impact'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'ta' ? 'சமீபத்தில் தீர்க்கப்பட்ட பிரச்சினைகள்' : 'Recently Resolved Complaints'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {lang === 'ta'
                ? 'மாநகராட்சி அதிகாரிகளால் களப்பணி முடிக்கப்பட்டு புகைப்பட ஆதாரத்துடன் தீர்க்கப்பட்ட புகார்கள்.'
                : 'Inspected, repaired, and confirmed with before & after photographic verification.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('map')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-civic-700 hover:text-civic-800"
          >
            <span>{lang === 'ta' ? 'வரைபடத்தில் அனைத்தையும் பார்க்க' : 'View All on City Map'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedList.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Before & After Photo Split */}
                <div className="relative h-48 bg-slate-100 flex overflow-hidden">
                  <div className="w-1/2 relative border-r border-white/40">
                    <img
                      src={complaint.image}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {lang === 'ta' ? 'முன்' : 'Before'}
                    </span>
                  </div>
                  <div className="w-1/2 relative">
                    <img
                      src={complaint.resolutionImage || complaint.image}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === 'ta' ? 'தீர்வு' : 'Resolved'}</span>
                    </span>
                  </div>

                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 backdrop-blur text-slate-800 font-mono text-xs font-bold px-2 py-0.5 rounded shadow">
                      {complaint.id}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-1">
                    {complaint.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{complaint.address}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                {complaint.verifiedByCitizen && (
                  <div className="mb-3 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ta' ? 'குடிமக்களால் தீர்வு உறுதி செய்யப்பட்டது' : 'Verified by Citizens'}</span>
                  </div>
                )}

                <button
                  onClick={() => onNavigate('track', complaint.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>{lang === 'ta' ? 'முழு விவரங்களைக் காண்க' : 'Inspect Redressal Details'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
