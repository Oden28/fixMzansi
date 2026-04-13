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
          Saving task details...
        </span>
      ) : (
        'See Taskers & Prices'
      )}
    </button>
  );
}

export function RequestForm() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- useFormState is stable in React 18; migrate to useActionState when upgrading to React 19
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
      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          id="category"
          name="category"
          label="Task category"
          defaultValue="solar"
          required
          options={[
            { value: 'solar', label: '☀️ Solar installation' },
            { value: 'battery', label: '🔋 Battery backup' },
            { value: 'electrical', label: '⚡ Electrical support' },
            { value: 'maintenance', label: '🔧 Solar maintenance' },
          ]}
        />

        <FormSelect
          id="taskSize"
          name="taskSize"
          label="Task size"
          defaultValue="medium"
          options={[
            { value: 'small', label: 'Small — quick fixes' },
            { value: 'medium', label: 'Medium — est. 2-3 hrs' },
            { value: 'large', label: 'Large — est. half/full day' },
          ]}
          hint="Used for matching context"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput id="fullName" name="fullName" label="Full name" placeholder="Your name" required />

        <FormInput id="phone" name="phone" label="Phone" placeholder="+27..." type="tel" required />
      </div>

      <FormInput id="email" name="email" label="Email" placeholder="you@example.com" type="email" required />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          id="suburb"
          name="suburb"
          label="Task location (suburb)"
          placeholder="e.g. Claremont, Camps Bay"
          required
          hint="We'll prioritize pros servicing this area"
        />

        <FormInput
          id="siteAddress"
          name="siteAddress"
          label="Site address"
          placeholder="Street + number"
          hint="Primary address where work will happen"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          id="alternateAddress"
          name="alternateAddress"
          label="Alternate access/install address (optional)"
          placeholder="If different from site address"
          hint="Use when equipment drop-off or access differs"
        />

        <FormSelect
          id="urgency"
          name="urgency"
          label="When do you need help?"
          defaultValue="medium"
          required
          options={[
            { value: 'low', label: 'Within a week' },
            { value: 'medium', label: 'Within 3 days' },
            { value: 'high', label: 'Today / urgent' },
          ]}
        />
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        Good news! FixMzansi has verified solar pros available in your area.
      </div>

      <FormTextarea
        id="description"
        name="description"
        label="Tell us the details"
        placeholder="Describe the work, access notes, equipment details, and anything your pro should know..."
        required
        hint="High-detail requests get better matches"
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
