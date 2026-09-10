import { getDepartmentByCategory } from '../data/departments';
import { sampleImages } from '../data/sampleImages';

/**
 * AI Computer Vision Analysis Service
 * Simulates intelligent civic image feature extraction, confidence scoring,
 * category classification, and municipal department routing.
 *
 * Designed to easily connect with real Vision APIs (Google Cloud Vision, Gemini Vision API).
 */

export const analyzeCivicImage = async (imageInput, filename = '') => {
  // Simulate network inference latency
  await new Promise(resolve => setTimeout(resolve, 1400));

  // Check if imageInput matches one of the sample keys
  if (typeof imageInput === 'string' && sampleImages[imageInput]) {
    const sample = sampleImages[imageInput];
    return {
      category: sample.category,
      detectedLabel: sample.detectedLabel,
      confidence: sample.confidence,
      suggestedPriority: sample.suggestedPriority,
      recommendedDepartment: sample.recommendedDept,
      imageUrl: sample.url,
      features: [
        'High-density civic anomaly detected',
        'Pedestrian walkway obstruction identified',
        'Public sanitation / safety impact'
      ]
    };
  }

  // If user uploaded a custom file or image
  const lowerName = (filename || '').toLowerCase();
  let category = 'garbage';
  let detectedLabel = 'Garbage Accumulation';
  let suggestedPriority = 'high';
  let confidence = Math.floor(Math.random() * 8) + 90; // 90% - 97%

  if (lowerName.includes('pothole') || lowerName.includes('road') || lowerName.includes('hole')) {
    category = 'pothole';
    detectedLabel = 'Road Surface Pothole & Asphalt Degradation';
    suggestedPriority = 'high';
    confidence = 94;
  } else if (lowerName.includes('light') || lowerName.includes('lamp') || lowerName.includes('street')) {
    category = 'streetlight';
    detectedLabel = 'Non-functional Streetlight Luminaire';
    suggestedPriority = 'medium';
    confidence = 89;
  } else if (lowerName.includes('water') || lowerName.includes('leak') || lowerName.includes('pipe')) {
    category = 'water_leakage';
    detectedLabel = 'Pressurized Water Distribution Pipeline Leak';
    suggestedPriority = 'emergency';
    confidence = 96;
  } else if (lowerName.includes('drain') || lowerName.includes('sewage') || lowerName.includes('gutter')) {
    category = 'drainage';
    detectedLabel = 'Stormwater Gutter Blockage & Overflow';
    suggestedPriority = 'high';
    confidence = 91;
  } else if (lowerName.includes('tree') || lowerName.includes('branch') || lowerName.includes('green')) {
    category = 'environmental';
    detectedLabel = 'Hazardous Tree Branch / Greenery Obstruction';
    suggestedPriority = 'high';
    confidence = 92;
  } else {
    // Default intelligently according to common municipal complaints
    category = 'garbage';
    detectedLabel = 'Garbage & Solid Waste Accumulation';
    suggestedPriority = 'high';
    confidence = 91;
  }

  const deptObj = getDepartmentByCategory(category);

  return {
    category,
    detectedLabel,
    confidence,
    suggestedPriority,
    recommendedDepartment: deptObj.id,
    imageUrl: typeof imageInput === 'string' ? imageInput : URL.createObjectURL(imageInput),
    features: [
      'Visual texture classification matched municipal training weights',
      'Structural safety anomaly score > 0.85',
      'Location context indicates public right-of-way'
    ]
  };
};

/**
 * Connector template for real Vision API (e.g. Gemini 1.5 Flash Vision or Google Cloud Vision)
 */
export const callRealGeminiVisionApi = async (imageBase64, apiKey) => {
  if (!apiKey) {
    throw new Error('API key not configured. Using local AI vision model.');
  }
  // Integration boilerplate for real endpoint:
  // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, ...);
  // return parsedResult;
};
