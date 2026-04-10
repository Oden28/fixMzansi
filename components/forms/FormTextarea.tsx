import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  charCount?: number;
  maxCharCount?: number;
}

export function FormTextarea({
  label,
  error,
  hint,
  required,
  charCount = 0,
  maxCharCount,
  name,
  id,
  ...props
}: FormTextareaProps) {
  const textareaId = id || name;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label ? (
          <label htmlFor={textareaId} className="flex items-center gap-1 text-sm font-medium text-white">
            {label}
            {required && <span className="text-rose-400">*</span>}
          </label>
        ) : null}
        {maxCharCount ? (
          <span className={`text-xs ${charCount > maxCharCount * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount} / {maxCharCount}
          </span>
        ) : null}
      </div>

      <textarea
        id={textareaId}
        name={name}
        className={`touch-target w-full rounded-xl border transition-all duration-[var(--motion-fast)] resize-vertical
          ${error ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30' : 'border-slate-700 bg-slate-950/50 focus:border-[var(--color-ring)] focus:ring-1 focus:ring-[var(--color-ring)]/30'}
          px-4 py-3 text-white placeholder:text-slate-600 outline-none`}
        {...props}
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
