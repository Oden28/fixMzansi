'use server';

import { validateServiceRequest } from '@/lib/validation';
import type { CreateServiceRequestInput } from '@/lib/db';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { matchAndPersistRequest } from '@/lib/matching-service';
import { getServerSession } from '@/lib/server-session';

export type RequestFormState = {
  success: boolean;
  message: string;
  errors: string[];
  requestId?: string;
  customerUserId?: string;
};

export async function createServiceRequestAction(
  _prevState: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  const input: CreateServiceRequestInput = {
    fullName: String(formData.get('fullName') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    category: String(formData.get('category') ?? 'solar') as CreateServiceRequestInput['category'],
    suburb: String(formData.get('suburb') ?? ''),
    description: String(formData.get('description') ?? ''),
    urgency: String(formData.get('urgency') ?? 'medium') as CreateServiceRequestInput['urgency'],
  };

  const result = validateServiceRequest(input);
  if (!result.valid) {
    return {
      success: false,
      message: 'Please fix the highlighted issues.',
      errors: result.errors,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const session = await getServerSession();

    // If authenticated, use the session user_id; otherwise create a guest user
    let userId: string;

    if (session) {
      userId = session.userId;
    } else {
      // Create or find guest user by email
      const email = input.email?.trim().toLowerCase();
      if (email) {
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (existing) {
          userId = existing.id;
        } else {
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              full_name: input.fullName.trim(),
              email,
              phone: input.phone?.trim() || null,
              role: 'consumer',
            })
            .select('id')
            .single();
          if (userError || !newUser) throw userError ?? new Error('Failed to create user');
          userId = newUser.id;
        }
      } else {
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            full_name: input.fullName.trim(),
            phone: input.phone?.trim() || null,
            role: 'consumer',
          })
          .select('id')
          .single();
        if (userError || !newUser) throw userError ?? new Error('Failed to create user');
        userId = newUser.id;
      }
    }

    const { data: request, error: insertError } = await supabase
      .from('service_requests')
      .insert({
        user_id: userId,
        category: input.category,
        suburb: input.suburb.trim(),
        description: input.description.trim(),
        urgency: input.urgency,
        status: 'submitted',
      })
      .select('id')
      .single();

    if (insertError || !request) throw insertError ?? new Error('Failed to create request');

    // Must await: in serverless (Vercel, etc.) the invocation freezes after the action returns,
    // so fire-and-forget matching often never runs — users see no pros and status stays submitted.
    let matchingNote: string | null = null;
    try {
      await matchAndPersistRequest(supabase, request.id);
    } catch (matchErr) {
      console.error('[requests/actions] matching error:', matchErr);
      matchingNote =
        matchErr instanceof Error ? matchErr.message : 'Matching could not complete. Open the request and refresh, or contact support.';
    }

    return {
      success: true,
      message: matchingNote
        ? `Request saved. ${matchingNote}`
        : 'Request created. Matched pros are ready on the next screen.',
      errors: [],
      requestId: request.id,
      customerUserId: userId,
    };
  } catch (error) {
    console.error('[requests/actions] error:', error);
    return {
      success: false,
      message: 'Failed to create request. Please try again.',
      errors: [],
    };
  }
}
