import React from 'react';
import { getComponentClasses } from '@/lib/ui-system';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function FormSelect({
  label,
  error,
  hint,
  required,
  options,
  name,
  id,
  ...props
}: FormSelectProps) {
  const selectId = id || name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="flex items-center gap-1 text-sm font-semibold text-white">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </label>
      ) : null}

      <select
        id={selectId}
        name={name}
        className={`${getComponentClasses('select')}
          ${
            error
              ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30'
              : 'border-slate-700 bg-slate-950/50 focus:border-[var(--color-ring)] focus:ring-1 focus:ring-[var(--color-ring)]/30'
          }
          text-white
          [background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")]
          [background-position:right_0.75rem_center]
          [background-repeat:no-repeat]
          [background-size:1.5em_1.5em]
          [padding-right:2.5rem]`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
