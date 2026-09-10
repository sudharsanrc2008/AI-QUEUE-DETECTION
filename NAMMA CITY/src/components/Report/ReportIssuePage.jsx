import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useComplaints } from '../../context/ComplaintContext';
import { analyzeCivicImage } from '../../services/aiVisionService';
import { calculatePriority } from '../../services/priorityEngine';
import { departments, getDepartmentByCategory } from '../../data/departments';
import { sampleImages } from '../../data/sampleImages';
import { LocationPickerModal } from './LocationPickerModal';
import { DuplicateWarningModal } from './DuplicateWarningModal';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { PriorityBadge } from '../Common/PriorityBadge';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mic,
  MicOff,
  Edit3,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const ReportIssuePage = ({ preselectedCategory, onNavigate }) => {
  const { lang, t } = useLanguage();
  const { addComplaint, checkDuplicate, upvoteComplaint } = useComplaints();

  // Form State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [category, setCategory] = useState(preselectedCategory || 'garbage');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [location, setLocation] = useState({
    address: '4th Main Road, Anna Nagar West, Chennai - 600040',
    lat: 13.0850,
    lng: 80.2101
  });

  // Sensitive Area flags
  const [sensitiveArea, setSensitiveArea] = useState({
    nearSchool: false,
    nearHospital: false,
    mainRoad: false,
    publicSafety: false
  });

  // Calculated / Recommended Priority & Department
  const [priority, setPriority] = useState('medium');
  const [selectedDept, setSelectedDept] = useState('waste_management');

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isAiOverridden, setIsAiOverridden] = useState(false);

  // Modals
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Speech / Voice simulation
  const [isListening, setIsListening] = useState(false);

  // If preselectedCategory was passed
  useEffect(() => {
    if (preselectedCategory) {
      setCategory(preselectedCategory);
      const dept = getDepartmentByCategory(preselectedCategory);
      setSelectedDept(dept.id);
    }
  }, [preselectedCategory]);

  // Recalculate priority when severity, category, or sensitive area changes
  useEffect(() => {
    const computed = calculatePriority(severity, category, sensitiveArea);
    setPriority(computed);
  }, [severity, category, sensitiveArea]);

  // Handle image upload from disk/camera
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setSelectedImage(reader.result);
      triggerAiAnalysis(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Trigger Sample Image for quick test
  const handleSelectSample = (sampleKey) => {
    const sample = sampleImages[sampleKey];
    if (!sample) return;

    setImagePreview(sample.url);
    setSelectedImage(sample.url);
    setImageFileName(`${sampleKey}.jpg`);
    triggerAiAnalysis(sampleKey, `${sampleKey}.jpg`);
  };

  // Run AI Vision Analysis
  const triggerAiAnalysis = async (imgSource, filename) => {
    setIsAnalyzing(true);
    setAiResult(null);
    setIsAiOverridden(false);

    try {
      const result = await analyzeCivicImage(imgSource, filename);
      setAiResult(result);
      setCategory(result.category);
      setSeverity(result.suggestedPriority);
      setSelectedDept(result.recommendedDepartment);

      // Auto-populate description if empty
      if (!description.trim()) {
        const sampleDesc = sampleImages[result.category]?.desc;
        if (sampleDesc) {
          setDescription(sampleDesc);
        }
      }
    } catch (err) {
      console.error('AI Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            address: `Near GPS [${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}], Anna Nagar Ward 102`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          // Fallback location
          setLocation({
            address: 'Anna Nagar West, Chennai (GPS Auto-Detected)',
            lat: 13.0850,
            lng: 80.2101
          });
        }
      );
    } else {
      setLocation({
        address: 'Anna Nagar West, Chennai (Default)',
        lat: 13.0850,
        lng: 80.2101
      });
    }
  };

  // Voice input toggle simulation
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const speechText = event.results[0][0].transcript;
          setDescription(prev => (prev ? `${prev} ${speechText}` : speechText));
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch (e) {
        // Fallback simulation
        simulateVoiceInput();
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const sampleTamil = 'சாலையோரம் பெரும் குப்பை தேங்கியுள்ளது, துர்நாற்றம் வீசுகிறது.';
      const sampleEnglish = 'Large garbage dump on roadside causing extreme stench and blocking footpaths.';
      setDescription(prev => (prev ? `${prev} ` : '') + (lang === 'ta' ? sampleTamil : sampleEnglish));
      setIsListening(false);
    }, 1800);
  };

  // Form Submission Validation
  const validateForm = () => {
    const errs = {};
    if (!imagePreview) errs.image = t.report.validation.photoRequired;
    if (!category) errs.category = t.report.validation.categoryRequired;
    if (!description.trim() || description.length < 8) {
      errs.description = t.report.validation.descRequired;
    }
    if (!location.address.trim()) {
      errs.location = t.report.validation.locationRequired;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Check Duplicate or proceed
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    // Check duplicate
    const duplicate = checkDuplicate(category, location.lat, location.lng);
    if (duplicate) {
      setDuplicateMatch(duplicate);
      setShowDuplicateModal(true);
      return;
    }

    processActualSubmission();
  };

  const processActualSubmission = () => {
    setIsSubmitting(true);
    setShowDuplicateModal(false);

    setTimeout(() => {
      const newReport = addComplaint({
        category,
        title: `${t.categories[category] || category} - ${location.address.split(',')[0]}`,
        description,
        image: imagePreview,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        severity,
        priority,
        aiConfidence: aiResult?.confidence || 91,
        department: selectedDept,
        sensitiveArea
      });

      setIsSubmitting(false);
      setSubmittedComplaint(newReport);
      setShowSuccessModal(true);
    }, 800);
  };

  const handleSupportExisting = (existingId) => {
    upvoteComplaint(existingId);
    setShowDuplicateModal(false);
    onNavigate('track', existingId);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{lang === 'ta' ? 'ஸ்மார்ட் புகார் பதிவு' : 'Smart Citizen Reporting'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.report.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t.report.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & AI Analysis (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image Upload Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <label className="block text-sm font-bold text-slate-900">
                {t.report.uploadPhoto} <span className="text-red-500">*</span>
              </label>

              {/* Upload Dropzone / Preview */}
              <div className="relative border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl overflow-hidden bg-slate-50 transition-colors">
                {imagePreview ? (
                  <div className="relative aspect-video sm:aspect-square w-full bg-slate-950 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Uploaded issue"
                      className="w-full h-full object-cover"
                    />

                    {/* AI Scanning overlay when analyzing */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 animate-scan shadow-lg shadow-teal-400"></div>
                        <Sparkles className="w-8 h-8 text-teal-300 animate-spin mb-2" />
                        <p className="text-xs font-bold text-teal-200">
                          {t.report.aiAnalyzing}
                        </p>
                      </div>
                    )}

                    {/* Change photo button */}
                    <label className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer backdrop-blur shadow transition-all">
                      <span>{lang === 'ta' ? 'மாற்றுக' : 'Change Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                      <Camera className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {lang === 'ta' ? 'கேமரா / கோப்பு பதிவேற்றவும்' : 'Take Photo or Browse Image'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {t.report.dragDrop}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {errors.image && (
                <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.image}</span>
                </p>
              )}

              {/* Sample Photo Presets */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.report.samplePhotosPrompt}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(sampleImages).map((key) => {
                    const sample = sampleImages[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectSample(key)}
                        className="p-1.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 transition-all text-left text-[11px] group flex flex-col items-center text-center"
                      >
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-10 h-10 object-cover rounded-lg mb-1 group-hover:scale-105 transition-transform"
                        />
                        <span className="font-semibold text-slate-700 group-hover:text-teal-800 line-clamp-1">
                          {t.report.samples[key] || key}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Vision Analysis Panel */}
            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-teal-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
                  <h3 className="font-bold text-sm tracking-wide text-white">
                    {t.report.aiAnalysisTitle}
                  </h3>
                </div>
                {aiResult && (
                  <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/40 font-bold">
                    Active
                  </span>
                )}
              </div>

              {isAnalyzing ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-teal-200 font-medium animate-pulse">
                    {t.report.aiAnalyzing}
                  </p>
                </div>
              ) : aiResult ? (
                <div className="space-y-3.5 text-xs">
                  {/* Detected Issue */}
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-teal-500/20">
                    <p className="text-[11px] text-teal-300 font-medium">
                      {t.report.aiDetectedIssue}
                    </p>
                    <p className="text-sm font-extrabold text-white mt-0.5">
                      {lang === 'ta' ? t.categories[aiResult.category] : aiResult.detectedLabel}
                    </p>
                  </div>

                  {/* Confidence Bar */}
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-teal-500/20">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] text-teal-300 font-medium">
                        {t.report.aiConfidence}
                      </span>
                      <span className="text-xs font-black text-emerald-400">
                        {aiResult.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${aiResult.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Suggested Priority & Department */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-teal-500/20">
                      <p className="text-[10px] text-teal-300 font-medium">
                        {t.report.aiSuggestedPriority}
                      </p>
                      <div className="mt-1">
                        <PriorityBadge priority={aiResult.suggestedPriority} />
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-teal-500/20">
                      <p className="text-[10px] text-teal-300 font-medium">
                        {t.report.aiRecommendedDept}
                      </p>
                      <p className="text-[11px] font-bold text-white mt-1 line-clamp-1">
                        {t.departments[aiResult.recommendedDepartment] || aiResult.recommendedDepartment}
                      </p>
                    </div>
                  </div>

                  {/* Citizen correction note */}
                  <div className="p-2.5 rounded-lg bg-teal-950/60 border border-teal-400/20 text-[11px] text-teal-200/90 leading-relaxed flex items-start gap-2">
                    <Edit3 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{t.report.aiOverrideNotice}</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <p>
                    {lang === 'ta'
                      ? 'புகைப்படத்தை பதிவேற்றியவுடன் AI தானாக பிரச்சினையை பகுப்பாய்வு செய்யும்.'
                      : 'Upload a photo or choose a sample above to trigger instant AI vision classification.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  {t.report.categoryLabel} <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setCategory(newCat);
                    setIsAiOverridden(true);
                    const dept = getDepartmentByCategory(newCat);
                    setSelectedDept(dept.id);
                  }}
                  className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="garbage">{t.categories.garbage}</option>
                  <option value="pothole">{t.categories.pothole}</option>
                  <option value="streetlight">{t.categories.streetlight}</option>
                  <option value="water_leakage">{t.categories.water_leakage}</option>
                  <option value="damaged_road">{t.categories.damaged_road}</option>
                  <option value="drainage">{t.categories.drainage}</option>
                  <option value="environmental">{t.categories.environmental}</option>
                  <option value="other">{t.categories.other}</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>
                )}
              </div>

              {/* Description with Voice Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-900">
                    {t.report.descriptionLabel} <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                    title="Voice input simulation"
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-teal-600" />}
                    <span>{isListening ? (lang === 'ta' ? 'கேட்கிறது...' : 'Listening...') : (lang === 'ta' ? 'குரல் உள்ளீடு' : 'Voice Input')}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.report.descriptionPlaceholder}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>
                )}
              </div>

              {/* Location Input & Buttons */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t.report.locationLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    placeholder={t.report.addressPlaceholder}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-red-500 font-medium">{errors.location}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t.report.useMyLocation}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.report.pickOnMap}</span>
                  </button>
                </div>
              </div>

              {/* Severity & Automatic Priority Multipliers */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900">
                    {t.report.severityLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">{lang === 'ta' ? 'முடிவு முன்னுரிமை:' : 'Computed Priority:'}</span>
                    <PriorityBadge priority={priority} />
                  </div>
                </div>

                {/* 4 Severity radio buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'emergency'].map((level) => {
                    const isSelected = severity === level;
                    const colors = {
                      low: 'border-emerald-300 bg-emerald-50 text-emerald-800',
                      medium: 'border-amber-300 bg-amber-50 text-amber-800',
                      high: 'border-orange-300 bg-orange-50 text-orange-800',
                      emergency: 'border-red-300 bg-red-50 text-red-800 font-bold'
                    };
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setSeverity(level);
                          setIsAiOverridden(true);
                        }}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          isSelected
                            ? `${colors[level]} ring-2 ring-offset-1 ring-teal-500`
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {t.priorities[level]}
                      </button>
                    );
                  })}
                </div>

                {/* Sensitive Area Multipliers */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-[11px] font-bold text-slate-700">
                    {t.report.sensitiveAreaLabel}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sensitiveArea.nearSchool}
                        onChange={(e) =>
                          setSensitiveArea({ ...sensitiveArea, nearSchool: e.target.checked })
                        }
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>{t.report.nearSchool}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sensitiveArea.nearHospital}
                        onChange={(e) =>
                          setSensitiveArea({ ...sensitiveArea, nearHospital: e.target.checked })
                        }
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>{t.report.nearHospital}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sensitiveArea.mainRoad}
                        onChange={(e) =>
                          setSensitiveArea({ ...sensitiveArea, mainRoad: e.target.checked })
                        }
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>{t.report.mainRoad}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sensitiveArea.publicSafety}
                        onChange={(e) =>
                          setSensitiveArea({ ...sensitiveArea, publicSafety: e.target.checked })
                        }
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>{t.report.publicSafety}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Department Auto-Route Confirmation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ta' ? 'ஒதுக்கப்படும் மாநகராட்சித் துறை' : 'Target Municipal Department'}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {t.departments[d.id] || d.id} (SLA: {d.slaHours}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>{t.report.submitting}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{t.report.submitBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        currentLocation={location}
        onSelectLocation={(loc) => setLocation(loc)}
      />

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        existingComplaint={duplicateMatch}
        onSupportExisting={handleSupportExisting}
        onSubmitAnyway={processActualSubmission}
      />

      {/* Success Modal */}
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        complaint={submittedComplaint}
        onTrack={(id) => {
          setShowSuccessModal(false);
          onNavigate('track', id);
        }}
        onGoHome={() => {
          setShowSuccessModal(false);
          onNavigate('home');
        }}
      />
    </div>
  );
};
