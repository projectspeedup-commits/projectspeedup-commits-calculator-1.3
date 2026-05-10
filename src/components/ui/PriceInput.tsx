
import React from 'react';
import { formatInputValue } from '../../lib/constants';

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
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
          {label}
        </span>
      )}
      <div className={`relative group transition-all`}>
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={formatInputValue(value)}
          onChange={handleChange}
          className={`
            w-full font-sans font-bold text-slate-900 dark:text-white
            bg-slate-50 dark:bg-slate-800/50 
            border border-slate-200 dark:border-slate-800 
            group-hover:border-slate-300 dark:group-hover:border-slate-700
            focus:border-slate-400 dark:focus:border-slate-500
            focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/50
            outline-none transition-all
            ${compact ? 'h-10 px-3 pr-8 text-sm rounded-lg' : 'h-11 px-4 pr-10 text-base rounded-xl'}
          `}
        />
        <span className={`
          absolute right-3 top-1/2 -translate-y-1/2 
          text-slate-400 dark:text-slate-500 font-bold pointer-events-none transition-colors
          group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300
          ${compact ? 'text-[10px]' : 'text-xs'}
        `}>
          {suffix}
        </span>
      </div>
    </div>
  );
};
