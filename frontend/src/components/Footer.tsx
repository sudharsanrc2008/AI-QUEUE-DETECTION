import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Shield, Cpu, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Project */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">SmartQueue AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time computer vision queue intelligence platform. AI Immersion capstone project powered by YOLOv8 person tracking and Little&apos;s Law queue optimization.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Inference Engine: v2.4 Online (30 FPS)</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Live Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('detection')} className="hover:text-cyan-400 transition-colors">
                  Live CV Detection & ROI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('analytics')} className="hover:text-cyan-400 transition-colors">
                  Queue Analytics & Heatmaps
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('alerts')} className="hover:text-cyan-400 transition-colors">
                  Real-Time Incident Alerts
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('reports')} className="hover:text-cyan-400 transition-colors">
                  Executive Reports & CSV
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Tech */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Core Technologies
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ultralytics YOLOv8 / ByteTrack</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>OpenCV Poly-ROI Queue Filtering</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-mono text-purple-400">W = L / &lambda;</span>
                <span>Little&apos;s Law Wait-Time Calculus</span>
              </li>
              <li>React 18 + TypeScript + Tailwind</li>
              <li>Node.js / Express REST Engine</li>
            </ul>
          </div>

          {/* Col 4: Use Cases */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Deployed Scenarios
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'College Canteens',
                'Hospital Triage',
                'Railway Ticket Counters',
                'Bank Cash Desks',
                'Government Offices',
                'Airport Security'
              ].map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Compliant with multi-camera RTSP surveillance streams and simulated edge devices.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SmartQueue AI. Built for the <span className="text-slate-300 font-medium">AI Immersion Project: Smart Queue Detection</span>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
              Privacy & Edge Processing
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
              API Specs (OpenAPI 3.0)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
