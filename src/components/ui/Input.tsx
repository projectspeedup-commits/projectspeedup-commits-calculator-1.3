
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  leftElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, containerClassName, leftElement, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 text-sm transition-all outline-none",
              "text-slate-900 dark:text-white placeholder:text-slate-400",
              error 
                ? "border-red-300 dark:border-red-900 focus:border-red-500" 
                : "border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-700",
              leftElement && "pl-10",
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-slate-400 ml-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
