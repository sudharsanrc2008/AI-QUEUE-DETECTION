import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Phone, Shield, ExternalLink, Heart, Globe } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <span className="text-3xl">🏙️</span>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">{t.appTitle}</h3>
                <p className="text-xs text-teal-400 font-medium">{t.govtBadge}</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t.tagline}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'ta'
                ? 'பொதுமக்கள் புகார்களை AI மூலம் வகைப்படுத்தி, உரிய மாநகராட்சித் துறைக்கு அனுப்பி துரித தீர்வு காணும் முன்னோடித் திட்டம்.'
                : 'Bridging citizens and urban governance through AI-driven computer vision, geo-tagging, automated department dispatch, and community verification.'}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-4"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'தமிழில் படிக்க (Switch to Tamil)' : 'Read in English'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              {lang === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('report')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.reportIssue}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('track')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.trackComplaint}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.liveMap}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('nearby')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.nearbyIssues}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.analytics.title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Civic Helplines */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-red-400" />
              <span>{lang === 'ta' ? 'அவசர உதவி எண்கள்' : 'Emergency Contacts'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                <div className="flex justify-between items-center text-white font-medium">
                  <span>{lang === 'ta' ? 'காவல்துறை' : 'Police Emergency'}</span>
                  <span className="text-red-400 font-bold">100 / 112</span>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                <div className="flex justify-between items-center text-white font-medium">
                  <span>{lang === 'ta' ? 'ஆம்புலன்ஸ்' : 'Ambulance'}</span>
                  <span className="text-rose-400 font-bold">108</span>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                <div className="flex justify-between items-center text-white font-medium">
                  <span>{lang === 'ta' ? 'மாநகராட்சி உதவி மையம்' : 'City Corporation'}</span>
                  <span className="text-teal-400 font-bold">1913</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('emergency')}
                className="w-full text-center py-1 text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                {lang === 'ta' ? 'அனைத்து அவசர எண்களையும் காண்க →' : 'View All Emergency Helplines →'}
              </button>
            </div>
          </div>

          {/* Col 4: Public Redressal Standard */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>{lang === 'ta' ? 'பொது சாசனம்' : 'Citizens Charter'}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ta'
                ? 'அனைத்து அவசரப் புகார்களும் 24 மணி நேரத்திற்குள்ளும், பிற புகார்கள் 72 மணி நேரத்திற்குள்ளும் கள ஆய்வு செய்யப்பட்டு தீர்வு காணப்படும்.'
                : 'Emergency complaints are responded to within 24 hours. Routine municipal infrastructure repairs adhere to a 48–72 hour resolution SLA.'}
            </p>
            <div className="pt-2">
              <div className="text-xs bg-civic-950 p-3 rounded-lg border border-civic-800/50 text-slate-300">
                <p className="font-semibold text-white mb-1">
                  {lang === 'ta' ? 'குடிமக்கள் உறுதிமொழி' : 'Civic Redressal Guarantee'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ta'
                    ? 'புகார் எண் NCC-2026 மூலம் எந்த நேரத்திலும் தீர்வு நிலையை கண்காணிக்கலாம்.'
                    : '100% transparency with geo-tagged photographic resolution proof and citizen verification.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and accessibility line */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {t.appTitle}. {t.govtBadge}. {lang === 'ta' ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <span>WCAG 2.1 AA Accessible</span>
            </span>
            <span>•</span>
            <span className="text-teal-400 font-medium">Bilingual Support (English / தமிழ்)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
