import React from 'react';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'admin' | 'viewer';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', children, className = '', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide';
  
  const variants = {
    success: 'bg-color-success/15 text-color-success border border-color-success/30',
    error: 'bg-color-error/15 text-color-error border border-color-error/30',
    warning: 'bg-color-warning/15 text-color-warning border border-color-warning/30',
    info: 'bg-color-info/15 text-color-info border border-color-info/30',
    neutral: 'bg-bg-elevated text-text-secondary border border-border-default',
    admin: 'bg-amber-500/15 text-amber-500 border border-amber-500/30',
    viewer: 'bg-blue-500/15 text-blue-500 border border-blue-500/30',
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
