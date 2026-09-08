import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ArrowRight,
  Eye,
  Users,
  Clock,
  AlertTriangle,
  Bell,
  BarChart3,
  Camera,
  Cpu,
  Layers,
  Sparkles,
  Building2,
  Stethoscope,
  Train,
  GraduationCap,
  Landmark,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, demoLogin } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated AI vision canvas background (simulating camera grid, bounding boxes, and tracked people)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Simulated vision points
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; label: string }[] = [];
    for (let i = 0; i < 28; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 2,
        label: `ID #${100 + i}`
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle perspective camera grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw scanner line moving down
      const scanY = (frame * 1.5) % height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      scanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.25)');
      scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, width, 40);

      // Draw simulated camera tracking nodes
      nodes.forEach((node, idx) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 30 || node.x > width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > height - 30) node.vy *= -1;

        // Draw connections if close
        for (let j = idx + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 110)})`;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw simulated bounding box around every 3rd node
        if (idx % 3 === 0) {
          const boxW = 34;
          const boxH = 50;
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - boxW / 2, node.y - boxH / 2, boxW, boxH);

          // Corner accents
          const cLen = 6;
          ctx.strokeStyle = '#22d3ee';
          ctx.beginPath();
          // Top-left
          ctx.moveTo(node.x - boxW / 2, node.y - boxH / 2 + cLen);
          ctx.lineTo(node.x - boxW / 2, node.y - boxH / 2);
          ctx.lineTo(node.x - boxW / 2 + cLen, node.y - boxH / 2);
          // Bottom-right
          ctx.moveTo(node.x + boxW / 2 - cLen, node.y + boxH / 2);
          ctx.lineTo(node.x + boxW / 2, node.y + boxH / 2);
          ctx.lineTo(node.x + boxW / 2, node.y + boxH / 2 - cLen);
          ctx.stroke();

          // Label
          ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.font = '9px monospace';
          ctx.fillText(`person 96%`, node.x - boxW / 2, node.y - boxH / 2 - 4);
        }

        // Dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = idx % 3 === 0 ? '#38bdf8' : 'rgba(168, 85, 247, 0.6)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      title: 'Real-Time Queue Detection',
      desc: 'High-frequency bounding-box detection monitors queue formations, physical distance, and entry lines simultaneously.'
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Automated People Counting',
      desc: 'Tracks unique person IDs using deep trajectory estimation to eliminate duplicate counts and handle severe visual occlusions.'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: 'Waiting Time Estimation',
      desc: "Combines Little's Law (W = L / λ) with dynamically measured counter service rates to forecast queue wait durations in minutes."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
      title: 'Overcrowding Detection',
      desc: 'Instantly identifies line density breaches, bottlenecks, and spatial crowding before they become safety or operational hazards.'
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-400" />,
      title: 'Smart Anomaly Alerts',
      desc: 'Configurable real-time alerts notify station managers, triage nurses, or bank tellers to deploy additional service counters.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: 'Predictive Analytics',
      desc: 'Heatmaps, peak-hour distributions, throughput velocity, and historical compliance audits in interactive dashboards.'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Camera Captures Queue',
      desc: 'Standard IP/RTSP surveillance cameras or webcams stream live visual feeds to the processing engine.',
      icon: <Camera className="w-5 h-5 text-cyan-400" />
    },
    {
      num: '02',
      title: 'AI Detects People & ROI',
      desc: 'YOLOv8 deep learning models track individuals within user-defined polygon regions of interest.',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />
    },
    {
      num: '03',
      title: 'Calculates Queue Metrics',
      desc: "Throughput, line velocity, and waiting times are calculated mathematically using Little's Law.",
      icon: <Layers className="w-5 h-5 text-purple-400" />
    },
    {
      num: '04',
      title: 'Real-Time Insights & Alerts',
      desc: 'Interactive dashboards and instant alerts help operators balance staffing and prevent bottlenecks.',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />
    }
  ];

  const useCases = [
    {
      icon: <Stethoscope className="w-6 h-6 text-rose-400" />,
      title: 'Hospital Emergency & Triage',
      desc: 'Monitor patient waiting rooms, prioritize critical queues, and alert staff when triage wait exceeds safe thresholds.'
    },
    {
      icon: <Landmark className="w-6 h-6 text-cyan-400" />,
      title: 'Bank Branches & Teller Desks',
      desc: 'Balance cashier lines, reduce customer churn, and dispatch floor managers during lunchtime transaction surges.'
    },
    {
      icon: <Train className="w-6 h-6 text-amber-400" />,
      title: 'Railway & Transit Stations',
      desc: 'Prevent platform overcrowding, optimize ticketing booths during holiday rushes, and monitor passenger safety.'
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-indigo-400" />,
      title: 'College Canteens & Campuses',
      desc: 'Display live wait times on mobile screens so students can avoid crowded food counters between classes.'
    },
    {
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      title: 'Government Citizen Services',
      desc: 'Cut bureaucratic wait times, provide fair token flow metrics, and generate transparency compliance reports.'
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
      title: 'Retail & Shopping Malls',
      desc: 'Dynamically open self-checkout terminals when checkout lines exceed 4 shoppers to increase customer satisfaction.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
        {/* Animated Canvas Vision Grid Background */}
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Immersion Project &bull; Computer Vision &amp; Queue Intelligence</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            AI-Powered Smart{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Queue Detection
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate overcrowding and long wait times with real-time computer vision. Detect people in line, estimate waiting duration with mathematical precision, and trigger automated alerts.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentPage('detection')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Live CV Detection</span>
            </button>
          </div>

          {/* Quick Demo Credentials pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Quick 1-Click Evaluation:</span>
            <button
              onClick={() => demoLogin('viewer')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 font-mono transition-colors"
            >
              Faculty Evaluator
            </button>
            <button
              onClick={() => demoLogin('admin')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 font-mono transition-colors"
            >
              Admin Demo
            </button>
            <button
              onClick={() => demoLogin('operator')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-purple-300 font-mono transition-colors"
            >
              Counter Operator
            </button>
          </div>

          {/* Live Metric Highlights Marquee */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">96.8%</p>
              <p className="text-xs text-slate-400 mt-1">Detection Accuracy (mAP)</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">&lt; 15ms</p>
              <p className="text-xs text-slate-400 mt-1">Edge Inference Latency</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">32%</p>
              <p className="text-xs text-slate-400 mt-1">Average Wait Time Reduction</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">24/7</p>
              <p className="text-xs text-slate-400 mt-1">Automated Spatial Monitoring</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Comprehensive Vision Suite
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Everything Needed for Intelligent Queue Monitoring
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Combines edge computer vision with queuing theory algorithms to transform raw video into operational intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-b from-slate-900/60 to-slate-950"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900/30 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              End-To-End Architecture
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
              How SmartQueue AI Operates
            </p>
            <p className="text-slate-400 text-sm mt-3">
              A 4-step real-time pipeline that converts visual camera frames into instant alerts and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-indigo-500/40">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Automated Pipeline</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              Deployment Verticals
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Engineered for High-Density Public Venues
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Demonstrating practical application across healthcare, transport, banking, and education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-purple-500/30 transition-all group bg-slate-900/40"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    {uc.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {uc.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack & Mathematical Modeling */}
      <section className="py-16 bg-slate-900/20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Under The Hood: Little&apos;s Law Formula</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Queueing Theory Powered by Vision Inference
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                SmartQueue AI applies Little&apos;s Theorem <code className="text-cyan-300 font-mono px-1 py-0.5 rounded bg-slate-900 border border-slate-700">W = L / &lambda;</code>, where average wait time <em>W</em> equals detected queue length <em>L</em> divided by arrival/service throughput rate <em>&lambda;</em> across active service counters.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {['YOLOv8x DeepSORT', 'OpenCV Python', 'Express REST API', 'React 18 TypeScript', 'Recharts SVG', 'Tailwind Glassmorphism'].map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Experience Smart Queue Detection?
          </h2>
          <p className="mt-4 text-slate-300 text-sm max-w-xl mx-auto font-light">
            Launch the live dashboard to view real-time queue simulations, manage overcrowding thresholds, and test the computer vision interface.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all"
            >
              Open Live Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Sign In / Demo Accounts
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
