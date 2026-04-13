import type { ProProfile, ServiceRequest } from './types';
import { buildFallbackAvatarUrl } from './pro-avatar';
import { estimateMarketplaceSignals } from './booking-funnel';

export const samplePros: ProProfile[] = [
  {
    id: 'pro_1',
    name: 'SolarWorks Cape',
    tradeCategory: 'solar',
    suburb: 'Claremont',
    rating: 4.9,
    verificationStatus: 'verified',
    responseTimeMinutes: 18,
    summary: 'Premium solar installer for homes and small businesses.',
    profilePhotoUrl: buildFallbackAvatarUrl('SolarWorks Cape'),
    ...estimateMarketplaceSignals('pro_1'),
  },
  {
    id: 'pro_2',
    name: 'Table Mountain Energy',
    tradeCategory: 'solar',
    suburb: 'Sea Point',
    rating: 4.7,
    verificationStatus: 'verified',
    responseTimeMinutes: 30,
    summary: 'Battery backup and inverter specialists.',
    profilePhotoUrl: buildFallbackAvatarUrl('Table Mountain Energy'),
    ...estimateMarketplaceSignals('pro_2'),
  },
  {
    id: 'pro_3',
    name: 'Cape Sun Electric',
    tradeCategory: 'solar',
    suburb: 'Bellville',
    rating: 4.5,
    verificationStatus: 'pending',
    responseTimeMinutes: 42,
    summary: 'Solar installations and electrical support.',
    profilePhotoUrl: buildFallbackAvatarUrl('Cape Sun Electric'),
    ...estimateMarketplaceSignals('pro_3'),
  },
  {
    id: 'pro_4',
    name: 'Atlantic Battery Installers',
    tradeCategory: 'battery',
    suburb: 'Rondebosch',
    rating: 4.8,
    verificationStatus: 'verified',
    responseTimeMinutes: 24,
    summary: 'Backup power and battery storage installation.',
    profilePhotoUrl: buildFallbackAvatarUrl('Atlantic Battery Installers'),
    ...estimateMarketplaceSignals('pro_4'),
  },
];

export const sampleRequest: ServiceRequest = {
  id: 'req_1',
  category: 'solar',
  suburb: 'Claremont',
  description: 'Need a solar assessment and quote for a family home.',
  urgency: 'medium',
  status: 'submitted',
};
