import type { CreateServiceRequestInput } from './db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;
const VALID_CATEGORIES = ['solar', 'electrical', 'battery', 'maintenance'] as const;
const VALID_URGENCIES = ['low', 'medium', 'high'] as const;
const MAX_DESCRIPTION_LEN = 5000;
const MAX_SUBURB_LEN = 100;
const MAX_NAME_LEN = 120;

export function validateServiceRequest(input: CreateServiceRequestInput) {
  const errors: string[] = [];

  const name = input.fullName.trim();
  if (!name) {
    errors.push('Full name is required');
  } else if (name.length > MAX_NAME_LEN) {
    errors.push(`Full name must be under ${MAX_NAME_LEN} characters`);
  }

  if (input.email) {
    const email = input.email.trim();
    if (email && !EMAIL_RE.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (input.phone) {
    const phone = input.phone.trim();
    if (phone && !PHONE_RE.test(phone)) {
      errors.push('Please enter a valid phone number');
    }
  }

  const suburb = input.suburb.trim();
  if (!suburb) {
    errors.push('Suburb is required');
  } else if (suburb.length > MAX_SUBURB_LEN) {
    errors.push(`Suburb must be under ${MAX_SUBURB_LEN} characters`);
  }

  const description = input.description.trim();
  if (!description) {
    errors.push('Description is required');
  } else if (description.length > MAX_DESCRIPTION_LEN) {
    errors.push(`Description must be under ${MAX_DESCRIPTION_LEN} characters`);
  }

  if (!(VALID_CATEGORIES as readonly string[]).includes(input.category)) {
    errors.push('Invalid category');
  }

  if (!(VALID_URGENCIES as readonly string[]).includes(input.urgency)) {
    errors.push('Invalid urgency');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
