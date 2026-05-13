
import React from 'react';
import { formatInputValue } from '../../lib/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PriceInputProps {
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  suffix?: string;
  compact?: boolean;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  className = "",
  label,
  suffix = "₽",
  compact = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, "").replace(/,/g, ".");
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          {label}
        </span>
      )}
      <div className="relative group">
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={formatInputValue(value)}
          onChange={handleChange}
          className={cn(
            "w-full font-sans font-bold text-slate-900 dark:text-white",
            "bg-slate-50 dark:bg-slate-900",
            "border border-slate-200 dark:border-slate-800",
            "focus:border-slate-400 dark:focus:border-slate-700",
            "outline-none transition-all",
            compact 
              ? 'h-9 px-3 pr-8 text-xs rounded-lg' 
              : 'h-11 px-4 py-3 pr-10 text-sm rounded-xl'
          )}
        />
        <span className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2",
          "text-slate-400 font-bold pointer-events-none transition-colors",
          "group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300",
          compact ? 'text-[10px]' : 'text-xs'
        )}>
          {suffix}
        </span>
      </div>
    </div>
  );
};
