import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  variant?: 'emerald' | 'rose' | 'sky' | 'amber' | 'slate';
  className?: string;
  target?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit = "тн",
  icon: Icon,
  variant = 'slate',
  className,
  target
}) => {
  const variants = {
    emerald: "from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400",
    rose: "from-rose-50 to-rose-100/30 dark:from-rose-950/40 dark:to-rose-900/10 border-rose-200/50 dark:border-rose-800/50 text-rose-600 dark:text-rose-400",
    sky: "from-sky-50 to-sky-100/30 dark:from-sky-950/40 dark:to-sky-900/10 border-sky-200/50 dark:border-sky-800/50 text-sky-600 dark:text-sky-400",
    amber: "from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-400",
    slate: "from-slate-50 to-slate-100/30 dark:from-slate-900/40 dark:to-slate-800/10 border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400",
  };

  return (
    <div className={cn(
      "flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br border rounded-xl shadow-sm relative overflow-hidden group transition-all",
      variants[variant],
      className
    )}>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 relative z-10 flex items-center leading-tight">
        {Icon && <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 opacity-80 shrink-0" />}
        <span className="truncate whitespace-nowrap">{label}</span>
      </span>
      
      <div className="flex items-baseline gap-1 relative z-10 font-sans">
        <span className={cn(
          "text-lg sm:text-xl font-black transition-colors",
          variant === 'slate' ? "text-slate-800 dark:text-white" : ""
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-[9px] sm:text-[10px] font-black uppercase opacity-80 shrink-0">{unit}</span>
        )}
        
        {target && (
          <span className="text-[7px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase flex flex-col leading-[1.1] ml-2">
            <span>цель</span>
            <span className="text-emerald-500/70 dark:text-emerald-500/50">{target}</span>
          </span>
        )}
      </div>
    </div>
  );
};
