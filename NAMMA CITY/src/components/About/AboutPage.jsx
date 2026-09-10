import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, Shield, Eye, Users, Cpu, CheckCircle2 } from 'lucide-react';

export const AboutPage = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.appTitle}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'ta' ? 'நம்ம சிட்டி கேர் பற்றி' : 'About Namma City Care'}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            {t.tagline}
          </p>
        </div>

        {/* Vision & Mission Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {lang === 'ta' ? 'திட்டத்தின் நோக்கம்' : 'Civic Technology Objective'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'ta'
              ? 'நம்ம சிட்டி கேர் என்பது பொதுமக்கள் தங்கள் பகுதியில் உள்ள சாலைப் பள்ளங்கள், குப்பைத் தேக்கம், தெருவிளக்கு பழுதுகள், குடிநீர் கசிவு மற்றும் கழிவுநீர் வடிகால் அடைப்புகளை உடனடியாகப் புகாரளிக்கவும், செயற்கை நுண்ணறிவு (AI) மூலம் துல்லியமாகப் பகுப்பாய்வு செய்து உரிய மாநகராட்சித் துறைக்கு அனுப்பி தீர்வு காணவும் உருவாக்கப்பட்ட நவீன தளமாகும்.'
              : 'Namma City Care is an advanced, AI-driven civic-tech platform designed for municipal corporations to streamline citizen grievance redressal. By leveraging computer vision and automated routing, the platform categorizes infrastructure issues, prioritizes life-threatening risks, assigns appropriate departments, and provides transparent photographic proof of resolution.'}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {lang === 'ta' ? 'AI புகைப்படப் பகுப்பாய்வு' : 'AI Computer Vision'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'ta'
                ? 'பதிவேற்றப்படும் புகைப்படங்களை AI ஆராய்ந்து 91%+ துல்லியத்துடன் வகைப்படுத்தி முன்னுரிமை பரிந்துரைக்கிறது.'
                : 'Scans image textures and features to detect garbage, potholes, pipeline bursts, and road damages with high confidence.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {lang === 'ta' ? 'இருமொழி சமத்துவம்' : 'Bilingual First (EN / தமிழ்)'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'ta'
                ? 'ஆங்கிலம் மற்றும் தமிழ் ஆகிய இரு மொழிகளிலும் முழு தளமும் தடையின்றி இயங்கும் வண்ணம் வடிவமைக்கப்பட்டுள்ளது.'
                : '100% full interface bilingual coverage ensuring inclusivity for senior citizens and all community demographics.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {lang === 'ta' ? 'குடிமக்கள் உறுதிப்படுத்தல்' : 'Citizen Verification Loop'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'ta'
                ? 'அதிகாரிகள் பணி முடித்த பின் பொதுமக்கள் களத்தில் சரிபார்த்து உறுதி செய்த பிறகே புகார் முறைப்படி மூடப்படும்.'
                : 'Grievances are never closed blindly; citizens inspect before-and-after photo evidence and verify resolution.'}
            </p>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-gradient-to-r from-teal-700 to-civic-800 text-white p-8 rounded-3xl text-center space-y-4 shadow-lg">
          <h3 className="text-xl font-black">
            {lang === 'ta' ? 'உங்கள் பகுதிப் பிரச்சினையை இன்றே புகாரளியுங்கள்' : 'Be an Active Citizen Today'}
          </h3>
          <p className="text-xs sm:text-sm text-teal-100 max-w-lg mx-auto">
            {lang === 'ta'
              ? 'தூய்மையான, பாதுகாப்பான மற்றும் நவீன நகரத்தை உருவாக்க ஒன்றிணைவோம்.'
              : 'Help keep our city clean, safe, and livable. Report your first civic issue in under 60 seconds.'}
          </p>
          <button
            onClick={() => onNavigate('report')}
            className="px-6 py-3 rounded-xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 active:scale-95"
          >
            <span>{t.hero.ctaReport}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
