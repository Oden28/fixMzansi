'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createServiceRequestAction, type RequestFormState } from '@/app/requests/actions';
import { buildScopedPath } from '@/lib/identity-scope';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';

const initialState: RequestFormState = {
  success: false,
  message: '',
  errors: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="touch-target w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-950/30 transition-all duration-[var(--motion-base)] hover:shadow-xl hover:shadow-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Submitting...
        </span>
      ) : (
        'Find matching solar pros'
      )}
    </button>
  );
}

export function RequestForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createServiceRequestAction, initialState);

  useEffect(() => {
    if (state.success && state.requestId) {
      const scopedPath = buildScopedPath(`/requests/${state.requestId}`, {
        customerUserId: state.customerUserId,
      });
      router.push(scopedPath);
      router.refresh();
    }
  }, [router, state.customerUserId, state.requestId, state.success]);

  return (
    <form
      className="space-y-6 rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-8 backdrop-blur-sm"
      action={formAction}
    >
      <FormInput
        id="fullName"
        name="fullName"
        label="Full name"
        placeholder="Your name"
        required
      />

      <FormInput
        id="phone"
        name="phone"
        label="Phone"
        placeholder="+27..."
        type="tel"
        required
      />

      <FormInput
        id="email"
        name="email"
        label="Email"
        placeholder="you@example.com"
        type="email"
        required
      />

      <FormSelect
        id="category"
        name="category"
        label="Service type"
        defaultValue="solar"
        required
        options={[
          { value: 'solar', label: '☀️ Solar installation' },
          { value: 'battery', label: '🔋 Battery backup' },
          { value: 'electrical', label: '⚡ Electrical support' },
          { value: 'maintenance', label: '🔧 Solar maintenance' },
        ]}
      />

      <FormInput
        id="suburb"
        name="suburb"
        label="Suburb or area"
        placeholder="e.g. Claremont, Camps Bay"
        required
        hint="We'll match you with pros in your area"
      />

      <FormSelect
        id="urgency"
        name="urgency"
        label="How urgent?"
        defaultValue="medium"
        required
        options={[
          { value: 'low', label: 'Low - next month' },
          { value: 'medium', label: 'Medium - within 2 weeks' },
          { value: 'high', label: 'High - this week' },
        ]}
      />

      <FormTextarea
        id="description"
        name="description"
        label="Tell us about the work"
        placeholder="Describe the solar installation, maintenance, or support you need..."
        required
        hint="The more detail, the better the matches"
      />

      {state.message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${state.success ? 'alert-success' : 'alert-error'}`}>
          <p className="font-medium">{state.message}</p>
          {state.requestId ? <p className="mt-2 text-xs opacity-75">Request ID: {state.requestId}</p> : null}
          {state.errors.length > 0 ? (
            <ul className="mt-3 list-inside space-y-1">
              {state.errors.map((error) => (
                <li key={error} className="text-xs">
                  {error}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
