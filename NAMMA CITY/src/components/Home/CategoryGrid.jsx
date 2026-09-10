import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CategoryIcon } from '../Common/CategoryIcon';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid = ({ onSelectCategory }) => {
  const { lang, t } = useLanguage();

  const categories = [
    { id: 'garbage', name: t.categories.garbage, desc: t.categoryDescriptions.garbage, emoji: '🗑️', color: 'hover:border-emerald-500 hover:shadow-emerald-100 group-hover:text-emerald-700' },
    { id: 'pothole', name: t.categories.pothole, desc: t.categoryDescriptions.pothole, emoji: '🕳️', color: 'hover:border-amber-500 hover:shadow-amber-100 group-hover:text-amber-700' },
    { id: 'streetlight', name: t.categories.streetlight, desc: t.categoryDescriptions.streetlight, emoji: '💡', color: 'hover:border-yellow-500 hover:shadow-yellow-100 group-hover:text-yellow-700' },
    { id: 'water_leakage', name: t.categories.water_leakage, desc: t.categoryDescriptions.water_leakage, emoji: '🚰', color: 'hover:border-blue-500 hover:shadow-blue-100 group-hover:text-blue-700' },
    { id: 'damaged_road', name: t.categories.damaged_road, desc: t.categoryDescriptions.damaged_road, emoji: '🛣️', color: 'hover:border-orange-500 hover:shadow-orange-100 group-hover:text-orange-700' },
    { id: 'drainage', name: t.categories.drainage, desc: t.categoryDescriptions.drainage, emoji: '🌊', color: 'hover:border-cyan-500 hover:shadow-cyan-100 group-hover:text-cyan-700' },
    { id: 'environmental', name: t.categories.environmental, desc: t.categoryDescriptions.environmental, emoji: '🌳', color: 'hover:border-teal-500 hover:shadow-teal-100 group-hover:text-teal-700' },
    { id: 'other', name: t.categories.other, desc: t.categoryDescriptions.other, emoji: '⚠️', color: 'hover:border-purple-500 hover:shadow-purple-100 group-hover:text-purple-700' }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'ta' ? 'நகரப் பிரச்சினை பிரிவுகள்' : 'Civic Issue Categories'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {lang === 'ta'
              ? 'உடனடி தீர்வுக்கு ஏதேனும் ஒரு பிரிவைத் தேர்ந்தெடுத்து எளிதாகப் புகாரளிக்கவும். AI தானாக உரிய அதிகாரிகளுக்கு அனுப்பிவிடும்.'
              : 'Click any category to begin smart reporting with pre-configured AI detection & municipal department routing.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group text-left p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-civic-500 ${cat.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 inline-block group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-700">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-civic-800 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-civic-700 group-hover:translate-x-0.5 transition-transform">
                <span>{lang === 'ta' ? 'புகாரளிக்க கிளிக் செய்யவும்' : 'Click to Report'}</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
