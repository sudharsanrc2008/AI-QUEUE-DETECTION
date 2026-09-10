import React from 'react';
import {
  Trash2,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Construction,
  Waves,
  Trees,
  HelpCircle
} from 'lucide-react';

export const CategoryIcon = ({ category = 'other', className = 'w-5 h-5', emoji = false }) => {
  const map = {
    garbage: { icon: Trash2, emoji: '🗑️', color: 'text-emerald-600 bg-emerald-100' },
    pothole: { icon: AlertTriangle, emoji: '🕳️', color: 'text-amber-600 bg-amber-100' },
    streetlight: { icon: Lightbulb, emoji: '💡', color: 'text-yellow-600 bg-yellow-100' },
    water_leakage: { icon: Droplets, emoji: '🚰', color: 'text-blue-600 bg-blue-100' },
    damaged_road: { icon: Construction, emoji: '🛣️', color: 'text-orange-600 bg-orange-100' },
    drainage: { icon: Waves, emoji: '🌊', color: 'text-cyan-600 bg-cyan-100' },
    environmental: { icon: Trees, emoji: '🌳', color: 'text-teal-600 bg-teal-100' },
    other: { icon: HelpCircle, emoji: '⚠️', color: 'text-purple-600 bg-purple-100' }
  };

  const item = map[category] || map.other;
  const IconComponent = item.icon;

  if (emoji) {
    return <span className="text-xl inline-block">{item.emoji}</span>;
  }

  return <IconComponent className={className} />;
};
