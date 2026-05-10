import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StatusDropdown({ value, onChange, className = '' }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { Check, ChevronDown, Filter } = LucideIcons;

  const options = [
    { value: 'ALL', label: 'Все статусы' },
    { value: 'OK', label: 'Обеспечено' },
    { value: 'DEFICIT', label: 'Дефицит' },
    { value: 'NOT_PROVIDED', label: 'Не обеспечено' },
  ];

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full focus:outline-none bg-transparent text-[11px] sm:text-xs text-slate-700 dark:text-slate-200"
      >
        <div className="flex items-center">
          <span className="truncate flex-1 text-left">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-3 h-3 ml-1 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-[#1e201c] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 overflow-hidden">
          {options.map((option) => (
             <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  value === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
             >
                <span className="truncate">{option.label}</span>
                {value === option.value && <Check className="w-3 h-3" />}
             </button>
          ))}
        </div>
      )}
    </div>
  );
}
