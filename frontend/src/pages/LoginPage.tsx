import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  Activity,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, register, setCurrentPage, addToast } = useApp();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Login form state
  const [email, setEmail] = useState('admin@smartqueue.ai');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('operator');
  const [regDept, setRegDept] = useState('Terminal Operations');

  const validateLogin = () => {
    const newErrors: { [k: string]: string } = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!password || password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    login(email, password, rememberMe);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [k: string]: string } = {};
    if (!regName.trim()) newErrors.regName = 'Full name is required';
    if (!regEmail || !/\S+@\S+\.\S+/.test(regEmail)) newErrors.regEmail = 'Valid email is required';
    if (!regPassword || regPassword.length < 6) newErrors.regPassword = 'Password must be at least 6 characters';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      register(regName, regEmail, regPassword, regRole, regDept);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      addToast('Error', 'Please enter a valid email to reset password.', 'error');
      return;
    }
    setShowForgotModal(false);
    addToast(
      'Reset Link Dispatched',
      `A security token was sent to ${forgotEmail}. Check your inbox.`,
      'success'
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl relative z-10">
        
        {/* Left Col: Visual Preview & AI Status */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  SmartQueue AI
                </h2>
                <span className="text-[10px] font-mono text-cyan-400">
                  Immersion Project Edition
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                Computer Vision Queue Intelligence
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to monitor live queue formations, examine mathematical waiting time models, and manage real-time overcrowding thresholds.
              </p>
            </div>

            {/* Visual Mini Surveillance Card */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  CAM-01 [CANTEEN]
                </span>
                <span>30.0 FPS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Detected People:</span>
                  <span className="text-cyan-400 font-bold">14 persons</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Rate (&mu;):</span>
                  <span className="text-indigo-400 font-bold">1.5 / min</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">Normal Flow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              1-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => demoLogin('admin')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-[11px] font-medium text-cyan-300 transition-all text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => demoLogin('operator')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 text-[11px] font-medium text-indigo-300 transition-all text-center"
              >
                Operator
              </button>
              <button
                type="button"
                onClick={() => demoLogin('viewer')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 text-[11px] font-medium text-purple-300 transition-all text-center"
              >
                Evaluator
              </button>
            </div>
          </div>

        </div>

        {/* Right Col: Login / Register Form */}
        <div className="p-8 sm:p-10 bg-slate-950 flex flex-col justify-center">
          
          {/* Form Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !isRegistering
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isRegistering
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {!isRegistering ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@smartqueue.ai"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Authenticate &amp; Launch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Prof. Alan Turing"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                {errors.regName && <p className="text-[11px] text-rose-400 mt-1">{errors.regName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="alan@university.edu"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                {errors.regEmail && <p className="text-[11px] text-rose-400 mt-1">{errors.regEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.regPassword && <p className="text-[11px] text-rose-400 mt-1">{errors.regPassword}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">System Role</label>
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="operator">Counter Operator</option>
                    <option value="admin">System Admin</option>
                    <option value="viewer">Academic Evaluator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={regDept}
                    onChange={e => setRegDept(e.target.value)}
                    placeholder="e.g. Canteen Operations"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Register Account</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              &larr; Back to Landing Page
            </button>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email and we will dispatch a recovery link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="name@smartqueue.ai"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
