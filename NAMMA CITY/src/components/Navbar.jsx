import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import {
  Menu,
  X,
  Languages,
  Bell,
  ShieldCheck,
  User,
  PlusCircle,
  Search,
  MapPin,
  Map,
  PhoneCall,
  Info,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { role, switchRole, user } = useAuth();
  const { notifications } = useComplaints();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: t.nav.home, icon: null },
    { id: 'report', label: t.nav.reportIssue, icon: PlusCircle, highlight: true },
    { id: 'track', label: t.nav.trackComplaint, icon: Search },
    { id: 'map', label: t.nav.liveMap, icon: Map },
    { id: 'nearby', label: t.nav.nearbyIssues, icon: MapPin },
    { id: 'emergency', label: t.nav.emergencyHelp, icon: PhoneCall, urgent: true },
    { id: 'analytics', label: t.analytics.title.split('&')[0].trim(), icon: BarChart3 },
    { id: 'about', label: t.nav.about, icon: Info },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Municipal Banner */}
      <div className="bg-civic-900 text-slate-200 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              {t.govtBadge} • {lang === 'ta' ? 'அதிகாரப்பூர்வ குறைதீர்க்கும் தளம்' : 'Official Civic Redressal Portal'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-civic-800/80 rounded-full p-0.5 border border-civic-700 text-xs">
              <button
                onClick={() => switchRole('citizen')}
                className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                  role === 'citizen'
                    ? 'bg-teal-500 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3 h-3" />
                <span>{t.nav.roleCitizen}</span>
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                  role === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{t.nav.roleAdmin}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded border border-teal-500/30 transition-all font-semibold"
              title="Toggle English / தமிழ்"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-civic-800 to-civic-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
              🏙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-civic-700 transition-colors">
                  {t.appTitle}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-civic-100 text-civic-800 px-1.5 py-0.5 rounded border border-civic-300">
                  AI-Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-700 hover:bg-civic-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all active:scale-95"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                );
              }

              if (item.urgent) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-red-100 text-red-700'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-civic-50 text-civic-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-70" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Dashboard & Admin) */}
          <div className="hidden lg:flex items-center gap-2">
            {role === 'citizen' ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'border-civic-600 bg-civic-50 text-civic-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-civic-600" />
                <span>{t.nav.citizenDashboard}</span>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-sm font-bold shadow-sm transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-900" />
                <span>{t.nav.adminPortal}</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('report')}
              className="px-3 py-1.5 bg-civic-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.nav.reportIssue}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-150">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">{t.tagline}</span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded flex items-center gap-1 border border-slate-300"
            >
              <Languages className="w-3 h-3 text-civic-600" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { switchRole('citizen'); handleNavClick('dashboard'); }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                role === 'citizen' ? 'bg-civic-50 border-civic-300 text-civic-800' : 'border-slate-200 text-slate-600'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.nav.roleCitizen}</span>
            </button>
            <button
              onClick={() => { switchRole('admin'); handleNavClick('admin'); }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                role === 'admin' ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'border-slate-200 text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.nav.roleAdmin}</span>
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
                  isActive
                    ? 'bg-civic-100 text-civic-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-civic-600" />}
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick(role === 'admin' ? 'admin' : 'dashboard')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold bg-slate-100 text-slate-800"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-civic-700" />
              <span>{role === 'admin' ? t.nav.adminPortal : t.nav.citizenDashboard}</span>
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
