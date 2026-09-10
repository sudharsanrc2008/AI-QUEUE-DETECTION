import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints, calculateDistance } from '../../context/ComplaintContext';
import { StatusBadge } from '../Common/StatusBadge';
import { PriorityBadge } from '../Common/PriorityBadge';
import { CategoryIcon } from '../Common/CategoryIcon';
import {
  Navigation,
  MapPin,
  ThumbsUp,
  ExternalLink,
  Filter,
  CheckCircle2,
  Radio
} from 'lucide-react';

export const NearbyIssuesPage = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints, upvoteComplaint } = useComplaints();

  // User coordinate state (defaulted to Anna Nagar Center)
  const [userCoords, setUserCoords] = useState({
    lat: 13.0850,
    lng: 80.2101,
    name: 'Anna Nagar (Detected Location)'
  });
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [isDetecting, setIsDetecting] = useState(false);

  // Trigger HTML5 GPS
  const handleDetectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: `Current GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`
          });
          setIsDetecting(false);
        },
        () => {
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  // Calculate distance for all complaints and filter by radius
  const nearbyList = complaints
    .map((c) => ({
      ...c,
      distance: calculateDistance(userCoords.lat, userCoords.lng, c.lat, c.lng)
    }))
    .filter((c) => c.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>{lang === 'ta' ? 'அருகிலுள்ள ரேடார்' : 'Civic Proximity Radar'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.nearby.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.nearby.subtitle}
            </p>
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? (lang === 'ta' ? 'கண்டறியப்படுகிறது...' : 'Locating...') : t.nearby.requestGps}</span>
          </button>
        </div>

        {/* Location & Radius Control Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{userCoords.name}</p>
              <p className="text-[11px] text-slate-500">
                {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Radius Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">
              {lang === 'ta' ? 'சுற்றளவு:' : 'Radius:'}
            </span>
            {[2.0, 3.5, 5.0, 10.0].map((km) => (
              <button
                key={km}
                onClick={() => setRadiusKm(km)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  radiusKm === km
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter Banner */}
        <div className="px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs text-teal-900 font-bold">
          <span>
            {t.nearby.foundCount.replace('{count}', nearbyList.length)}
          </span>
          <span className="text-[11px] font-medium text-teal-700">
            {lang === 'ta' ? 'தொலைவு வாரியாக வரிசைப்படுத்தப்பட்டுள்ளது' : 'Sorted by shortest distance'}
          </span>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {nearbyList.length > 0 ? (
            nearbyList.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Photo & Main Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-200"
                  />

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {complaint.id}
                      </span>
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />

                      {/* Distance Pill */}
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        <span>{t.nearby.distanceAway.replace('{dist}', complaint.distance)}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {complaint.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {complaint.address}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 pt-0.5">
                      {complaint.description}
                    </p>
                  </div>
                </div>

                {/* Actions (Upvote + Track) */}
                <div className="flex sm:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => upvoteComplaint(complaint.id)}
                    className={`flex-1 sm:flex-initial w-full px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      complaint.hasUserUpvoted
                        ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>
                      {complaint.hasUserUpvoted
                        ? (lang === 'ta' ? 'ஆதரிக்கப்பட்டது' : 'Supported')
                        : t.nearby.supportThis}{' '}
                      ({complaint.upvotes})
                    </span>
                  </button>

                  <button
                    onClick={() => onNavigate('track', complaint.id)}
                    className="flex-1 sm:flex-initial w-full px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.common.track}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
              <p className="text-base font-bold text-slate-800">
                {lang === 'ta' ? 'இப்பகுதியில் எந்தப் புகாரும் இல்லை!' : 'No Civic Issues Found Nearby!'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'ta'
                  ? 'தேர்ந்தெடுக்கப்பட்ட சுற்றளவுக்குள் எந்தப் புகாரும் பதிவாகவில்லை அல்லது சுற்றளவை அதிகரித்து பார்க்கவும்.'
                  : 'Your neighborhood is clean or try expanding the search radius above.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
