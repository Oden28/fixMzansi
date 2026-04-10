import type { ProProfile, ServiceRequest } from './types';

export type MatchRecord = {
  id: string;
  request_id: string;
  pro_id: string;
  rank_score: number;
  match_reason: string;
};

export type ProRecord = ProProfile & {
  profile_photo_url?: string | null;
};

export type ServiceRequestRecord = ServiceRequest & {
  id: string;
  full_name: string;
  phone?: string | null;
  email?: string | null;
};
