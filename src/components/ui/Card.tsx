
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isPadded?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  header, 
  footer, 
  isPadded = true,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          {header}
        </div>
      )}
      
      <div className={cn(isPadded && "p-4 md:p-6")}>
        {children}
      </div>

      {footer && (
        <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          {footer}
        </div>
      )}
    </div>
  );
};
