export type TradeCategory = 'solar' | 'electrical' | 'battery' | 'maintenance';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type RequestStatus = 'draft' | 'submitted' | 'matched' | 'booked' | 'completed' | 'cancelled';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface ProProfile {
  id: string;
  name: string;
  tradeCategory: TradeCategory;
  suburb: string;
  rating: number;
  verificationStatus: VerificationStatus;
  responseTimeMinutes: number;
  summary: string;
  profilePhotoUrl?: string;
}

export interface ServiceRequest {
  id: string;
  category: TradeCategory;
  suburb: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: RequestStatus;
}
