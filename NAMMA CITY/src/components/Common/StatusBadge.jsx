import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Clock, CheckCircle2, ShieldCheck, UserCheck, Wrench } from 'lucide-react';

export const StatusBadge = ({ status = 'reported', size = 'sm' }) => {
  const { t } = useLanguage();

  const config = {
    reported: {
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Clock,
      label: t.statuses.reported
    },
    verified: {
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: ShieldCheck,
      label: t.statuses.verified
    },
    assigned: {
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: UserCheck,
      label: t.statuses.assigned
    },
    in_progress: {
      color: 'bg-amber-50 text-amber-700 border-amber-300',
      icon: Wrench,
      label: t.statuses.in_progress
    },
    resolved: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      icon: CheckCircle2,
      label: t.statuses.resolved
    }
  };

  const item = config[status.toLowerCase()] || config.reported;
  const Icon = item.icon;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${item.color} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{item.label}</span>
    </span>
  );
};
