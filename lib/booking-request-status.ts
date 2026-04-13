import type { BookingStatus } from '@/lib/types';
import type { RequestStatus } from '@/lib/types';

/**
 * Keeps `service_requests.status` aligned with the booking lifecycle.
 */
export function serviceRequestStatusForBooking(bookingStatus: BookingStatus): RequestStatus {
  switch (bookingStatus) {
    case 'pending':
    case 'confirmed':
    case 'in_progress':
      return 'booked';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'matched';
    default:
      return 'booked';
  }
}
