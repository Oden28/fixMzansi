export type DbJson = Record<string, unknown>;

export type CreateServiceRequestInput = {
  fullName: string;
  phone?: string;
  email?: string;
  category: 'solar' | 'electrical' | 'battery' | 'maintenance';
  suburb: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
};

export type CreateBookingInput = {
  requestId: string;
  proId: string;
  scheduledTime?: string;
};
