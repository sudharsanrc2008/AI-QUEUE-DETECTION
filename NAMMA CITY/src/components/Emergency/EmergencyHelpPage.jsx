import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { emergencyContacts } from '../../data/emergencyContacts';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Flame,
  HeartPulse,
  Building2,
  CloudRainWind,
  Users,
  Baby,
  ExternalLink
} from 'lucide-react';

export const EmergencyHelpPage = () => {
  const { lang, t } = useLanguage();

  const iconMap = {
    ShieldAlert: ShieldAlert,
    HeartPulse: HeartPulse,
    Flame: Flame,
    Building2: Building2,
    CloudRainWind: CloudRainWind,
    Users: Users,
    Baby: Baby
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Urgent Warning Header */}
        <div className="bg-red-50 border-2 border-red-300 p-6 sm:p-7 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-red-700">
            <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {t.emergency.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-medium">
            {t.emergency.disclaimer}
          </p>
        </div>

        {/* Emergency Helplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {emergencyContacts.map((contact) => {
            const Icon = iconMap[contact.icon] || ShieldAlert;
            const item = t.emergency.helplines[contact.id] || {
              name: contact.id,
              number: contact.number,
              desc: ''
            };

            return (
              <div
                key={contact.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                      {contact.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[32px]">
                    {item.desc}
                  </p>

                  <p className="text-2xl font-black text-slate-900 mt-4 tracking-wider font-mono">
                    {item.number}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={contact.action}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${contact.color}`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>
                      {t.emergency.callBtn} ({contact.number.split('/')[0].trim()})
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Municipal Disaster Guidance */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'ta' ? 'அவசர கால பொதுமக்கள் வழிகாட்டுதல்' : 'Public Safety Emergency Protocol'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-bold text-slate-900">
                {lang === 'ta' ? 'மின்சாரக் கம்பங்கள் சேதம்' : 'Snapped Power Lines'}
              </p>
              <p>
                {lang === 'ta'
                  ? 'உடனடியாக 100 அல்லது 1913 அழையுங்கள். அறுந்து கிடக்கும் மின்கம்பிகளுக்கு அருகில் செல்லாதீர்கள்.'
                  : 'Immediately dial 1913 or 100. Do not step in waterlogged puddles near electric poles.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-bold text-slate-900">
                {lang === 'ta' ? 'கனமழை வெள்ளப்பெருக்கு' : 'Severe Inundation'}
              </p>
              <p>
                {lang === 'ta'
                  ? 'பேரிடர் மேலாண்மை எண் 1077 அல்லது மாநகராட்சி படகு மீட்புக் குழுவை அணுகவும்.'
                  : 'Contact Disaster Control 1077 for boat evacuations and food package distribution.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-bold text-slate-900">
                {lang === 'ta' ? 'குடிநீர் குழாய் சேதம்' : 'Severe Water Loss'}
              </p>
              <p>
                {lang === 'ta'
                  ? 'மெட்ரோ வாட்டர் அவசர உதவி எண் 044-45674567 ஐ தொடர்பு கொண்டு வால்வை மூடச் செய்யவும்.'
                  : 'Contact Metro Water emergency cell directly at 044-45674567 to shut off supply mains.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
