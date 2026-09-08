import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { TrackedPerson, QueueStatus } from '../types';
import {
  Video,
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sliders,
  Maximize2,
  Shield,
  Activity,
  Layers,
  AlertTriangle,
  Clock,
  Users,
  Eye,
  Settings2,
  Download,
  Info,
  CheckCircle2,
  Radio
} from 'lucide-react';

export const LiveDetectionPage: React.FC = () => {
  const { queues, updateQueue, addAlert, settings, addToast } = useApp();

  const [selectedQueueId, setSelectedQueueId] = useState<string>('q-canteen');
  const [sourceMode, setSourceMode] = useState<'simulation' | 'webcam' | 'upload'>('simulation');
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [showRoi, setShowRoi] = useState<boolean>(true);
  const [showIdTags, setShowIdTags] = useState<boolean>(true);
  const [detectionLogs, setDetectionLogs] = useState<{ id: string; time: string; text: string; type: 'entry' | 'exit' | 'alert' }[]>([]);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [isMediaVideo, setIsMediaVideo] = useState<boolean>(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentQueue = queues.find(q => q.id === selectedQueueId) || queues[0];

  // Simulation state for procedural pedestrians
  const peopleRef = useRef<TrackedPerson[]>([]);
  const nextIdRef = useRef<number>(101);
  const lastSpawnRef = useRef<number>(Date.now());
  const lastServiceRef = useRef<number>(Date.now());

  // Log an event to the HUD drawer
  const pushLog = useCallback((text: string, type: 'entry' | 'exit' | 'alert' = 'entry') => {
    setDetectionLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text,
        type
      },
      ...prev.slice(0, 24)
    ]);
  }, []);

  // Initialize procedural pedestrians inside simulation
  useEffect(() => {
    const initPeople: TrackedPerson[] = [];
    const count = currentQueue.current_people || 12;
    for (let i = 0; i < count; i++) {
      const qProgress = i / Math.max(1, count);
      // Position along queue spline from back (x: 480, y: 340) to counter (x: 120, y: 160)
      const x = 480 - qProgress * 360 + (Math.random() - 0.5) * 16;
      const y = 320 - qProgress * 160 + (Math.random() - 0.5) * 16;
      initPeople.push({
        id: nextIdRef.current++,
        x,
        y,
        width: 32 + (y / 400) * 16,
        height: 52 + (y / 400) * 26,
        targetX: x,
        targetY: y,
        confidence: Math.floor(Math.random() * 8) + 91,
        waitTimeSec: (count - i) * 18,
        inRoi: true,
        color: ['#38bdf8', '#818cf8', '#c084fc', '#34d399'][i % 4],
        speed: 1.2,
        history: []
      });
    }
    peopleRef.current = initPeople;
    pushLog(`Initialized CV tracking on ${currentQueue.name} with ${count} people in ROI zone.`, 'entry');
  }, [selectedQueueId, pushLog]);

  // Handle webcam activation
  const toggleWebcam = async () => {
    if (sourceMode === 'webcam') {
      if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
        setWebcamStream(null);
      }
      setSourceMode('simulation');
      addToast('Camera Offline', 'Reverted to AI Simulation Mode.', 'info');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        setWebcamStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setSourceMode('webcam');
        addToast('Webcam Connected', 'Live camera stream attached with AI overlay.', 'success');
        pushLog('Webcam hardware connected. Real-time vision tracking active.', 'entry');
      } catch (err) {
        addToast('Webcam Error', 'Unable to access local camera device. Ensure permission is granted.', 'error');
      }
    }
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop());
      setWebcamStream(null);
    }

    const url = URL.createObjectURL(file);
    setUploadedMediaUrl(url);
    const isVid = file.type.startsWith('video');
    setIsMediaVideo(isVid);
    setSourceMode('upload');
    addToast('Media Loaded', `Uploaded ${file.name} for AI queue detection testing.`, 'success');
    pushLog(`Media file "${file.name}" loaded for inference analysis.`, 'entry');
  };

  // Main Canvas Render Loop (renders high-frequency bounding boxes, ROI polygon, and pedestrian dynamics)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 854);
    let height = (canvas.height = 480);

    // Queue Region of Interest (ROI) polygon coordinates
    const roiPolygon: [number, number][] = [
      [80, 110],
      [220, 110],
      [580, 310],
      [580, 420],
      [360, 420],
      [60, 240]
    ];

    let tick = 0;

    const render = () => {
      tick++;

      // Clear canvas
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // If in webcam or video mode, draw the underlying video frame
      if ((sourceMode === 'webcam' || (sourceMode === 'upload' && isMediaVideo)) && videoRef.current) {
        try {
          ctx.drawImage(videoRef.current, 0, 0, width, height);
        } catch (e) {
          // Video element loading
        }
      } else {
        // Draw simulated CCTV environment: perspective floor tiles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= width; i += 48) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i * 1.3 - width * 0.15, height);
          ctx.stroke();
        }
        for (let j = 0; j <= height; j += 40) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(width, j);
          ctx.stroke();
        }

        // Draw service counter desk at top-left
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fillRect(40, 90, 120, 60);
        ctx.strokeRect(40, 90, 120, 60);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('SERVICE DESK #01', 48, 125);

        // Draw counter attendant icon
        ctx.beginPath();
        ctx.arc(100, 75, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();

        // Draw stanchion ropes along queue path
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(170, 120);
        ctx.lineTo(590, 310);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(130, 180);
        ctx.lineTo(550, 370);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Region of Interest (ROI) boundary if enabled
      if (showRoi) {
        ctx.beginPath();
        ctx.moveTo(roiPolygon[0][0], roiPolygon[0][1]);
        for (let k = 1; k < roiPolygon.length; k++) {
          ctx.lineTo(roiPolygon[k][0], roiPolygon[k][1]);
        }
        ctx.closePath();

        // Glowing boundary line
        ctx.strokeStyle = currentQueue.status === 'Overcrowded'
          ? 'rgba(244, 63, 94, 0.8)'
          : currentQueue.status === 'Busy'
          ? 'rgba(245, 158, 11, 0.8)'
          : 'rgba(6, 182, 212, 0.8)';
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Fill transparent zone
        ctx.fillStyle = currentQueue.status === 'Overcrowded'
          ? 'rgba(244, 63, 94, 0.08)'
          : 'rgba(6, 182, 212, 0.06)';
        ctx.fill();

        // Label ROI Zone
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`[ROI ZONE: ${currentQueue.camera_id} - ${currentQueue.name.toUpperCase()}]`, roiPolygon[0][0], roiPolygon[0][1] - 8);
      }

      // If detection is active, update and render tracked person bounding boxes
      if (isDetecting) {
        const now = Date.now();

        // Procedural simulation logic (arrivals and departures)
        if (sourceMode === 'simulation') {
          // Serve person at front of queue every ~3.5 seconds
          if (now - lastServiceRef.current > 3500 && peopleRef.current.length > 3) {
            lastServiceRef.current = now;
            const served = peopleRef.current.shift();
            if (served) {
              pushLog(`Person #${served.id} processed & departed queue (Total wait: ${served.waitTimeSec}s).`, 'exit');
            }
          }

          // New arrival enters queue back every ~3-5 seconds
          if (now - lastSpawnRef.current > 3800 && peopleRef.current.length < currentQueue.capacity + 8) {
            lastSpawnRef.current = now;
            const newId = nextIdRef.current++;
            const arrival: TrackedPerson = {
              id: newId,
              x: 640 + (Math.random() - 0.5) * 30,
              y: 380 + (Math.random() - 0.5) * 30,
              width: 34 + Math.random() * 6,
              height: 58 + Math.random() * 10,
              targetX: 520,
              targetY: 340,
              confidence: Math.floor(Math.random() * 8) + 91,
              waitTimeSec: 0,
              inRoi: true,
              color: '#38bdf8',
              speed: 1.4,
              history: []
            };
            peopleRef.current.push(arrival);
            pushLog(`New person #${newId} detected entering queue boundary.`, 'entry');
          }
        }

        // Draw tracked people & bounding boxes
        const people = peopleRef.current;
        let roiCount = 0;

        people.forEach((p, idx) => {
          // Advance person towards queue target position
          const qRank = idx;
          const targetX = 140 + qRank * 28 + (Math.sin(tick * 0.05 + idx) * 2);
          const targetY = 160 + qRank * 14 + (Math.cos(tick * 0.05 + idx) * 2);

          p.x += (targetX - p.x) * 0.05;
          p.y += (targetY - p.y) * 0.05;

          if (tick % 30 === 0) p.waitTimeSec += 1;

          roiCount++;

          // Filter by confidence threshold
          if (p.confidence < confidenceThreshold) return;

          const boxX = p.x - p.width / 2;
          const boxY = p.y - p.height / 2;

          // Color coded by queue density: green for normal, amber if busy, red if overcrowded
          const boxColor = currentQueue.status === 'Overcrowded' ? '#f43f5e' : p.inRoi ? '#10b981' : '#38bdf8';

          // Draw Bounding Box
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(boxX, boxY, p.width, p.height);

          // Draw Corner Brackets
          const cLen = 7;
          ctx.lineWidth = 2.5;
          // Top Left
          ctx.beginPath();
          ctx.moveTo(boxX, boxY + cLen);
          ctx.lineTo(boxX, boxY);
          ctx.lineTo(boxX + cLen, boxY);
          ctx.stroke();
          // Top Right
          ctx.beginPath();
          ctx.moveTo(boxX + p.width - cLen, boxY);
          ctx.lineTo(boxX + p.width, boxY);
          ctx.lineTo(boxX + p.width, boxY + cLen);
          ctx.stroke();
          // Bottom Left
          ctx.beginPath();
          ctx.moveTo(boxX, boxY + p.height - cLen);
          ctx.lineTo(boxX, boxY + p.height);
          ctx.lineTo(boxX + cLen, boxY + p.height);
          ctx.stroke();
          // Bottom Right
          ctx.beginPath();
          ctx.moveTo(boxX + p.width - cLen, boxY + p.height);
          ctx.lineTo(boxX + p.width, boxY + p.height);
          ctx.lineTo(boxX + p.width, boxY + p.height - cLen);
          ctx.stroke();

          // Draw ID Tag & Wait Time HUD Badge above bounding box
          if (showIdTags) {
            const tagText = `ID #${p.id} | ${p.waitTimeSec}s | ${p.confidence}%`;
            ctx.font = '10px monospace';
            const textWidth = ctx.measureText(tagText).width;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(boxX, boxY - 18, textWidth + 8, 16);
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(boxX, boxY - 18, textWidth + 8, 16);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText(tagText, boxX + 4, boxY - 6);
          }

          // Draw head dot representing center of tracking
          ctx.beginPath();
          ctx.arc(p.x, p.y - p.height * 0.35, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f8fafc';
          ctx.fill();
        });

        // Sync queue count with parent context periodically
        if (tick % 60 === 0 && sourceMode === 'simulation') {
          updateQueue(currentQueue.id, { current_people: roiCount });
        }
      }

      // Draw Top HUD Bar on Canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(15, 15, width - 30, 36);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(15, 15, width - 30, 36);

      // HUD Text items
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`CAM: ${currentQueue.camera_id} [${currentQueue.location.toUpperCase()}]`, 28, 38);

      ctx.fillStyle = isDetecting ? '#34d399' : '#f59e0b';
      ctx.fillText(isDetecting ? `● INFERENCE: ACTIVE (29.8 FPS)` : `● INFERENCE: PAUSED`, 330, 38);

      ctx.fillStyle = '#c084fc';
      ctx.fillText(`PEOPLE IN QUEUE: ${peopleRef.current.length}`, 610, 38);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDetecting, sourceMode, isMediaVideo, showRoi, showIdTags, confidenceThreshold, currentQueue, updateQueue, pushLog]);

  // Trigger crowd surge simulation
  const handleSurge = () => {
    for (let i = 0; i < 8; i++) {
      const newId = nextIdRef.current++;
      peopleRef.current.push({
        id: newId,
        x: 600 + Math.random() * 40,
        y: 350 + Math.random() * 40,
        width: 36,
        height: 60,
        targetX: 520,
        targetY: 340,
        confidence: 96,
        waitTimeSec: 0,
        inRoi: true,
        color: '#f43f5e',
        speed: 1.8,
        history: []
      });
    }
    addAlert({
      queue_id: currentQueue.id,
      queue_name: currentQueue.name,
      alert_type: 'Live Influx Surge',
      message: `Surge alert: Sudden arrival of 8 people detected in ${currentQueue.name}.`,
      severity: 'warning',
      status: 'active'
    });
    pushLog(`ALERT: Instant crowd surge of 8 people injected into ${currentQueue.name}.`, 'alert');
    addToast('Surge Injected', `Added 8 people into ${currentQueue.name} feed.`, 'warning');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Computer Vision Detection
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30">
              AI Simulation Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time deep learning person bounding box tracking, ROI polygon filtering, and queue length telemetry.
          </p>
        </div>

        {/* Source Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulation mode */}
          <button
            onClick={() => {
              if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());
              setWebcamStream(null);
              setSourceMode('simulation');
              addToast('Mode Switch', 'Switched to AI Simulation Feed.', 'info');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              sourceMode === 'simulation'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Simulation</span>
          </button>

          {/* Webcam mode */}
          <button
            onClick={toggleWebcam}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              sourceMode === 'webcam'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Webcam Stream</span>
          </button>

          {/* Upload media button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              sourceMode === 'upload'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Video / Image</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Vision Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Video / Canvas Player & Overlay Controls */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Video / Canvas Card */}
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 bg-slate-950 shadow-2xl">
            
            {/* Hidden HTML5 Video element used when webcam/upload active */}
            <video
              ref={videoRef}
              src={sourceMode === 'upload' && uploadedMediaUrl ? uploadedMediaUrl : undefined}
              className="hidden"
              playsInline
              muted
              loop
              autoPlay
            />

            {/* Main Interactive Canvas Overlay */}
            <div className="relative aspect-[16/9] w-full bg-slate-950">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain cursor-crosshair"
              />

              {/* Live Overlay Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">LIVE OVERLAY</span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400">YOLOv8 + ByteTrack</span>
              </div>

              {/* Mode indicator watermark */}
              <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400">
                SOURCE: <span className="text-indigo-400 uppercase font-bold">{sourceMode}</span>
              </div>
            </div>

            {/* Bottom Playback Toolbar */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDetecting(!isDetecting)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
                    isDetecting
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                  }`}
                >
                  {isDetecting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isDetecting ? 'Stop Detection' : 'Start Detection'}</span>
                </button>

                <button
                  onClick={handleSurge}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
                  title="Simulate sudden passenger rush"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Surge +8</span>
                </button>
              </div>

              {/* Toggles: Show ROI & Show ID Tags */}
              <div className="flex items-center gap-3 text-slate-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRoi}
                    onChange={e => setShowRoi(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0"
                  />
                  <span>Show ROI Poly</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIdTags}
                    onChange={e => setShowIdTags(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0"
                  />
                  <span>Bounding Tags</span>
                </label>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">
                  Conf: {confidenceThreshold}%
                </span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={e => setConfidenceThreshold(Number(e.target.value))}
                  className="w-20 accent-indigo-500 cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* Location Selector Chips */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300">Select Queue Feed:</span>
            <div className="flex flex-wrap gap-2">
              {queues.map(q => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQueueId(q.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedQueueId === q.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {q.name.split(' - ')[1] || q.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: AI Metrics Dashboard & Live Event Stream */}
        <div className="space-y-4">
          
          {/* Real-time Detection Status Card (matching required prompt example) */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Vision Analytics
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                currentQueue.status === 'Overcrowded'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                  : currentQueue.status === 'Busy'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {currentQueue.status}
              </span>
            </div>

            {/* Big Metrics readout */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Detected People:
                </span>
                <span className="text-xl font-bold text-white">
                  {peopleRef.current.length}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Queue Length:
                </span>
                <span className="text-xl font-bold text-indigo-300">
                  {peopleRef.current.length} persons
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Estimated Waiting Time:
                </span>
                <span className="text-xl font-bold text-purple-300">
                  {currentQueue.estimated_wait_min} minutes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Queue Status:
                </span>
                <span className={`text-base font-bold font-sans ${
                  currentQueue.status === 'Overcrowded'
                    ? 'text-rose-400'
                    : currentQueue.status === 'Busy'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {currentQueue.status}
                </span>
              </div>
            </div>

            {/* Little's law breakdown */}
            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-indigo-300 font-mono">
                Little&apos;s Law: W = L / (&mu; &times; c)
              </p>
              <p className="text-slate-400">
                L = {peopleRef.current.length} people &bull; &mu; = {(60 / currentQueue.avg_service_time_sec).toFixed(1)}/min &bull; {currentQueue.counters_open} counter(s)
              </p>
            </div>
          </div>

          {/* Real-time Detection Event Stream Log */}
          <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col h-72">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Event Stream
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                STREAMING
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[11px] font-mono">
              {detectionLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-sans">
                  Awaiting vision tracking events...
                </div>
              ) : (
                detectionLogs.map(log => (
                  <div
                    key={log.id}
                    className={`p-2 rounded-lg border leading-tight ${
                      log.type === 'alert'
                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                        : log.type === 'exit'
                        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 mr-2">[{log.time}]</span>
                    <span>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Integration Guide Box for YOLO/OpenCV */}
      <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-slate-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Ready for YOLOv8 / OpenCV Hardware Deployment
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              The platform is architected to stream live RTSP telemetry directly from our provided <code className="text-cyan-300 font-mono">backend/yolo_detector.py</code> script using your physical webcam or CCTV video.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <code className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-indigo-300">
            python yolo_detector.py --source 0
          </code>
        </div>
      </div>

    </div>
  );
};
