import React, { useState } from 'react';
import { useApp, PageId } from '../context/AppContext';
import {
  Activity,
  LayoutDashboard,
  Video,
  BarChart3,
  Bell,
  FileText,
  Settings,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Radio,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    user,
    logout,
    alerts,
    resolveAlert,
    settings,
    updateSettings,
    isSimulating
  } = useApp();

  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'active');

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'detection', label: 'Live Detection', icon: <Video className="w-4 h-4" /> },
    { id: 'analytics', label: 'Queue Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-4 h-4" />,
      badge: activeAlerts.length > 0 ? activeAlerts.length : undefined
    },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 dark:border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  SmartQueue
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Computer Vision Queue Engine
              </p>
            </div>
          </button>

          {/* AI Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-slate-300">
              {isSimulating ? 'AI Vision Online' : 'Detection Paused'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-semibold">{settings.camera_fps} FPS</span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-indigo-950/50 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Alerts, Theme, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Alerts Bell Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(prev => !prev)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
              )}
            </button>

            {showAlertMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel bg-slate-900/95 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Live Queue Alerts ({activeAlerts.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowAlertMenu(false);
                      setCurrentPage('alerts');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View All <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activeAlerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                      All queues operating within safe thresholds.
                    </div>
                  ) : (
                    activeAlerts.slice(0, 4).map(alert => (
                      <div
                        key={alert.id}
                        className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold ${alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                            {alert.alert_type}
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {alert.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">{alert.queue_name}</span>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User Account / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 hover:border-indigo-500/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-medium text-slate-200 truncate max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider">
                    {user.role}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel bg-slate-900/95 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{user.department}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentPage('settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg text-left"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 px-4 pt-2 pb-4 space-y-1 bg-slate-950/95 backdrop-blur-xl">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                currentPage === item.id
                  ? 'text-cyan-300 bg-indigo-950/50 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
