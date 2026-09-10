import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../Common/StatusBadge';
import { PriorityBadge } from '../Common/PriorityBadge';
import { CategoryIcon } from '../Common/CategoryIcon';
import L from 'leaflet';
import {
  Filter,
  MapPin,
  Search,
  ExternalLink,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';

export const LiveCivicMapPage = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { complaints } = useComplaints();

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Filtered complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter === 'open' && c.status !== 'reported' && c.status !== 'verified') return false;
    if (statusFilter === 'in_progress' && c.status !== 'in_progress' && c.status !== 'assigned') return false;
    if (statusFilter === 'resolved' && c.status !== 'resolved') return false;
    if (statusFilter === 'emergency' && c.priority !== 'emergency') return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  // Category marker colors
  const getCategoryColor = (cat, priority) => {
    if (priority === 'emergency') return '#ef4444';
    const colors = {
      garbage: '#10b981',
      pothole: '#f59e0b',
      streetlight: '#eab308',
      water_leakage: '#3b82f6',
      damaged_road: '#f97316',
      drainage: '#06b6d4',
      environmental: '#14b8a6',
      other: '#8b5cf6'
    };
    return colors[cat] || '#0d9488';
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Chennai
    const map = L.map(mapContainerRef.current, {
      center: [13.0418, 80.2341], // Chennai Center
      zoom: 12,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers when complaints or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filtered.forEach((c) => {
      const pinColor = getCategoryColor(c.category, c.priority);

      // Custom SVG Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2.5px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25);
            cursor: pointer;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; color: white;">
              ${c.priority === 'emergency' ? '🚨' : '📍'}
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([c.lat, c.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPin(c);
      });

      markersGroupRef.current.addLayer(marker);
    });
  }, [filtered]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'ta' ? 'வரைபடக் கண்காணிப்பு' : 'Geographical Intelligence'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.map.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.map.subtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('report')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all self-start sm:self-auto"
          >
            + {t.hero.ctaReport}
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{t.common.status}:</span>
            </span>

            {[
              { id: 'all', label: t.map.filters.all },
              { id: 'open', label: t.map.filters.open },
              { id: 'in_progress', label: t.map.filters.inProgress },
              { id: 'resolved', label: t.map.filters.resolved },
              { id: 'emergency', label: t.map.filters.emergency, urgent: true }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === f.id
                    ? f.urgent
                      ? 'bg-red-600 text-white shadow-sm font-bold'
                      : 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {lang === 'ta' ? 'வகை:' : 'Category:'}
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{lang === 'ta' ? 'அனைத்து வகைகள்' : 'All Categories'}</option>
              <option value="garbage">{t.categories.garbage}</option>
              <option value="pothole">{t.categories.pothole}</option>
              <option value="streetlight">{t.categories.streetlight}</option>
              <option value="water_leakage">{t.categories.water_leakage}</option>
              <option value="damaged_road">{t.categories.damaged_road}</option>
              <option value="drainage">{t.categories.drainage}</option>
              <option value="environmental">{t.categories.environmental}</option>
              <option value="other">{t.categories.other}</option>
            </select>
          </div>
        </div>

        {/* Main Map + Card Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Container */}
          <div className="lg:col-span-8 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative h-[520px] rounded-xl overflow-hidden border border-slate-200">
              <div ref={mapContainerRef} className="w-full h-full"></div>

              {/* Map Floating Legend */}
              <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1">
                <p className="font-bold text-slate-800">{t.map.legend}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>{t.priorities.emergency}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>{t.categories.garbage}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>{t.categories.pothole}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>{t.categories.water_leakage}</span>
                </div>
              </div>

              {/* Pin click reminder */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                {t.map.clickMarkerHint}
              </div>
            </div>
          </div>

          {/* Selected Pin Details Panel (4 cols) */}
          <div className="lg:col-span-4">
            {selectedPin ? (
              <div className="bg-white rounded-2xl border border-teal-300 shadow-md p-5 space-y-4 animate-in fade-in">
                {/* Photo Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={selectedPin.image}
                    alt={selectedPin.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 backdrop-blur text-slate-900 font-mono text-xs font-bold px-2 py-0.5 rounded shadow">
                      {selectedPin.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedPin.status} />
                  <PriorityBadge priority={selectedPin.priority} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedPin.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedPin.address}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedPin.description}
                </p>

                <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>{lang === 'ta' ? 'ஒதுக்கப்பட்ட துறை:' : 'Department:'}</span>
                    <span className="font-bold text-slate-800">
                      {t.departments[selectedPin.department] || selectedPin.department}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.track.reportedOn}:</span>
                    <span className="font-medium">
                      {new Date(selectedPin.reportedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('track', selectedPin.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.map.viewDetails} ({selectedPin.id})</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-3">
                <MapPin className="w-10 h-10 mx-auto text-teal-400 animate-bounce" />
                <h4 className="font-bold text-slate-700 text-sm">
                  {lang === 'ta' ? 'குறியீட்டைத் தேர்வு செய்யவும்' : 'Select a Map Marker'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lang === 'ta'
                    ? 'வரைபடத்தில் உள்ள ஏதேனும் ஒரு குறியீட்டைக் கிளிக் செய்து அதன் புகார் விவரங்கள் மற்றும் தீர்வு நிலையைக் காணவும்.'
                    : 'Click on any civic issue pin on the map to inspect live progress, department assignment, and photo proofs.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
