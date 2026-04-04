import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  contentClassName?: string;
  glass?: boolean;
}

export function Card({ children, title, subtitle, className = '', contentClassName = '', glass = false, ...props }: CardProps) {
  const baseClasses = 'rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col';
  const glassClasses = glass ? 'glass-panel border border-border-default/50' : 'bg-bg-surface border border-border-default';
  
  return (
    <div className={`${baseClasses} ${glassClasses} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-border-default shrink-0">
          {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
          {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`p-6 flex-1 min-h-0 ${contentClassName}`}>{children}</div>
    </div>
  );
}
