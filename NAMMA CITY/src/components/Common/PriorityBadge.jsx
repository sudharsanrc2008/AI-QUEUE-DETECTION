import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export const PriorityBadge = ({ priority = 'medium', size = 'sm' }) => {
  const { t } = useLanguage();

  const config = {
    low: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: '🟢',
      label: t.priorities.low
    },
    medium: {
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: '🟡',
      label: t.priorities.medium
    },
    high: {
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
      icon: '🟠',
      label: t.priorities.high
    },
    emergency: {
      color: 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse',
      dot: 'bg-red-500',
      icon: '🔴',
      label: t.priorities.emergency
    }
  };

  const item = config[priority.toLowerCase()] || config.medium;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${item.color} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
      <span>{item.label}</span>
    </span>
  );
};
