import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-text-secondary uppercase tracking-wider text-[0.7rem]">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none bg-bg-surface border border-border-default text-text-primary rounded-lg px-3 py-2 pr-10 text-sm outline-none transition-all focus:border-accent-primary focus:ring-1 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? 'border-color-error focus:border-color-error focus:ring-color-error' : ''
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-color-error mt-0.5">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
