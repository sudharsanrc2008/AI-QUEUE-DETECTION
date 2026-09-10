import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Camera, Cpu, MapPin, Building2, CheckCircle2 } from 'lucide-react';

export const HowItWorks = () => {
  const { lang, t } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: Camera,
      titleEn: 'Snap & Upload',
      titleTa: 'படம் எடுத்து பதிவேற்றவும்',
      descEn: 'Take a photo of the civic issue from your mobile or upload an existing picture.',
      descTa: 'உங்கள் மொபைல் மூலம் பிரச்சினையைப் படம் பிடிக்கவும் அல்லது புகைப்படத்தை பதிவேற்றவும்.'
    },
    {
      num: '02',
      icon: Cpu,
      titleEn: 'AI Analysis',
      titleTa: 'AI உடனடி பகுப்பாய்வு',
      descEn: 'AI computer vision detects issue type (91%+ confidence), priority, and optimal department.',
      descTa: 'AI படம் மற்றும் தீவிரத்தன்மையை ஆராய்ந்து தகுந்த மாநகராட்சித் துறையைப் பரிந்துரைக்கும்.'
    },
    {
      num: '03',
      icon: MapPin,
      titleEn: 'Geo-Tagged Dispatch',
      titleTa: 'இருப்பிட வார்டு ஒதுக்கீடு',
      descEn: 'GPS tags exact coordinates, detects duplicates within 300m, and alerts the ward engineer.',
      descTa: 'துல்லியமான வரைபட இருப்பிடம் பதிவு செய்யப்பட்டு சம்பந்தப்பட்ட வார்டு அதிகாரிக்கு அனுப்பப்படும்.'
    },
    {
      num: '04',
      icon: Building2,
      titleEn: 'Ground Action',
      titleTa: 'களப்பணி & தீர்வு',
      descEn: 'Municipal field crews execute repairs, update live tracking stages, and upload photo proof.',
      descTa: 'மாநகராட்சி களக் குழுவினர் பிரச்சினையை சரிசெய்து தீர்வு புகைப்படத்தை பதிவேற்றுவர்.'
    },
    {
      num: '05',
      icon: CheckCircle2,
      titleEn: 'Citizen Verification',
      titleTa: 'குடிமக்கள் உறுதிப்படுத்தல்',
      descEn: 'Citizens inspect the completed work and confirm satisfaction to formally close grievance.',
      descTa: 'பொதுமக்கள் சீரமைப்புப் பணியை பார்வையிட்டு திருப்தி அடைந்ததை உறுதி செய்வர்.'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            {lang === 'ta' ? 'எளிய 5 படிகள்' : 'Simple 5-Step Civic Redressal'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'ta' ? 'எப்படி இயங்குகிறது?' : 'How Namma City Care Works'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {lang === 'ta'
              ? 'குடிமக்கள், செயற்கை நுண்ணறிவு மற்றும் மாநகராட்சி நிர்வாகத்தை இணைக்கும் வெளிப்படையான கட்டமைப்பு.'
              : 'Connecting Citizens, Artificial Intelligence, and Municipal Governance with Complete Transparency.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative group"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black mb-4 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Step {step.num}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {lang === 'ta' ? step.titleTa : step.titleEn}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lang === 'ta' ? step.descTa : step.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
