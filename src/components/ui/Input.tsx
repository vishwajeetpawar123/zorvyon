import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-text-secondary uppercase tracking-wider text-[0.7rem]">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-bg-surface border border-border-default text-text-primary rounded-lg px-3 py-2 text-sm outline-none transition-all focus:border-accent-primary focus:ring-1 focus:ring-accent-primary placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed ${
              icon ? 'pl-9' : ''
            } ${error ? 'border-color-error focus:border-color-error focus:ring-color-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-color-error mt-0.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
