import React from 'react';
import { getComponentClasses } from '@/lib/ui-system';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export function FormInput({
  label,
  error,
  hint,
  required,
  icon,
  name,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="flex items-center gap-1 text-sm font-semibold text-white">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </label>
      ) : null}

      <div className="relative">
        {icon ? <div className="absolute left-4 top-3 flex items-center text-slate-500">{icon}</div> : null}
        <input
          id={inputId}
          name={name}
          className={`${getComponentClasses('input')} ${
            error
              ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30'
              : 'border-slate-700 bg-slate-950/50 focus:border-[var(--color-ring)] focus:ring-1 focus:ring-[var(--color-ring)]/30'
          } ${icon ? 'pl-10' : ''} text-white placeholder:text-slate-500`}
          {...props}
        />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
