import type { CreateServiceRequestInput } from './db';

export function validateServiceRequest(input: CreateServiceRequestInput) {
  const errors: string[] = [];

  if (!input.fullName.trim()) errors.push('Full name is required');
  if (!input.suburb.trim()) errors.push('Suburb is required');
  if (!input.description.trim()) errors.push('Description is required');
  if (!['solar', 'electrical', 'battery', 'maintenance'].includes(input.category)) errors.push('Invalid category');
  if (!['low', 'medium', 'high'].includes(input.urgency)) errors.push('Invalid urgency');

  return {
    valid: errors.length === 0,
    errors,
  };
}
