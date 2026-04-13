import React from 'react';
import { getComponentClasses } from '@/lib/ui-system';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110 active:scale-[0.99]',
  secondary: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:brightness-110 active:scale-[0.99]',
  outline: 'border border-slate-700 text-white hover:border-slate-500 hover:bg-slate-900/50 active:bg-slate-900',
  ghost: 'text-slate-300 hover:text-white hover:bg-slate-900/30 active:bg-slate-900/50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99]',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${getComponentClasses('button')} gap-2 shadow-lg shadow-black/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
