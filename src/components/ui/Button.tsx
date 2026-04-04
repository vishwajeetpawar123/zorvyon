import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon, 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Dynamic variant classes mapping
  const variants = {
    primary: 'bg-accent-primary text-white hover:bg-opacity-90 shadow-[0_0_15px_var(--color-accent-glow)]',
    secondary: 'bg-bg-elevated text-text-primary border border-border-default hover:border-border-active',
    danger: 'bg-color-error text-white hover:bg-opacity-90 shadow-[0_0_10px_rgba(255,107,107,0.3)]',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
  };
  
  // Dynamic size classes mapping
  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
