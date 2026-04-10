'use server';

import { validateServiceRequest } from '@/lib/validation';
import type { CreateServiceRequestInput } from '@/lib/db';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { matchAndPersistRequest } from '@/lib/matching-service';

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

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', input.email || '')
      .maybeSingle();

    const userId = existingUser?.id ?? (await createConsumerUser(supabase, input)).id;

    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .insert({
        user_id: userId,
        category: input.category,
        suburb: input.suburb,
        description: input.description,
        urgency: input.urgency,
        status: 'submitted',
      })
      .select('id')
      .single();

    if (requestError || !request) {
      throw requestError ?? new Error('Failed to create service request');
    }

    await matchAndPersistRequest(supabase, request.id);

    return {
      success: true,
      message: 'Request submitted. We matched you with trusted solar pros in Cape Town.',
      errors: [],
      requestId: request.id,
      customerUserId: userId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong while submitting your request.';
    return {
      success: false,
      message,
      errors: [message],
    };
  }
}

async function createConsumerUser(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  input: CreateServiceRequestInput,
) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      full_name: input.fullName,
      phone: input.phone || null,
      email: input.email || null,
      role: 'consumer',
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create consumer user');
  }

  return data;
}
