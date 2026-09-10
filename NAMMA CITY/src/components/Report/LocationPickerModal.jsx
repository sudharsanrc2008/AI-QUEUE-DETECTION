import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { MapPin, Check, X, Navigation } from 'lucide-react';

const CHENNAI_PRESETS = [
  { name: 'Anna Nagar (2nd Avenue)', lat: 13.0850, lng: 80.2101, ward: 'Ward 102, Zone 8' },
  { name: 'Adyar (LB Road)', lat: 13.0012, lng: 80.2565, ward: 'Ward 173, Zone 13' },
  { name: 'Velachery (Bypass Road)', lat: 12.9815, lng: 80.2180, ward: 'Ward 177, Zone 13' },
  { name: 'T. Nagar (Usman Road)', lat: 13.0418, lng: 80.2341, ward: 'Ward 117, Zone 10' },
  { name: 'Mylapore (Luz Church Rd)', lat: 13.0339, lng: 80.2677, ward: 'Ward 124, Zone 9' },
  { name: 'Tambaram (GST Road)', lat: 12.9249, lng: 80.1000, ward: 'Ward 45, Tambaram Corp' },
  { name: 'Royapettah (High Road)', lat: 13.0544, lng: 80.2625, ward: 'Ward 119, Zone 9' },
  { name: 'Guindy (Kathipara)', lat: 13.0067, lng: 80.2023, ward: 'Ward 168, Zone 12' }
];

export const LocationPickerModal = ({ isOpen, onClose, onSelectLocation, currentLocation }) => {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState(currentLocation || CHENNAI_PRESETS[0]);
  const [customAddress, setCustomAddress] = useState(currentLocation?.address || '');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectLocation({
      ...selected,
      address: customAddress || selected.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {lang === 'ta' ? 'வரைபடத்தில் இருப்பிடத்தைத் தேர்வு செய்க' : 'Select Civic Location on Map'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-500">
            {lang === 'ta'
              ? 'துல்லியமான வார்டு அதிகாரிகளுக்கு அனுப்ப உங்கள் பகுதியை தேர்வு செய்யவும்:'
              : 'Choose your locality or ward from key municipal zones in the city:'}
          </p>

          {/* Preset list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {CHENNAI_PRESETS.map((item, idx) => {
              const isChosen = selected.lat === item.lat && selected.lng === item.lng;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelected(item);
                    setCustomAddress(item.name);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between ${
                    isChosen
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.ward}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                    </p>
                  </div>
                  {isChosen && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Address input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'ta' ? 'குறிப்பிட்ட தெரு / அடையாளக் குறி' : 'Exact Street Address or Landmark'}
            </label>
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="e.g. 4th Main Road, near post office..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
          >
            {lang === 'ta' ? 'இருப்பிடத்தை உறுதி செய்' : 'Confirm Location'}
          </button>
        </div>
      </div>
    </div>
  );
};
