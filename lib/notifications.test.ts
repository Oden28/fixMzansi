import { describe, expect, it } from 'vitest';
import { filterNotifications, type NotificationRecord } from './notifications';

describe('filterNotifications', () => {
  const notifications: NotificationRecord[] = [
    { id: '1', user_id: 'u1', channel: 'in_app', type: 'booking_created', payload: null, status: 'queued', read_at: null },
    { id: '2', user_id: 'u1', channel: 'in_app', type: 'review_submitted', payload: null, status: 'sent', read_at: '2026-04-08T10:00:00.000Z' },
    { id: '3', user_id: 'u1', channel: 'in_app', type: 'new_match', payload: null, status: 'failed', read_at: null },
  ];

  it('returns all notifications when filter is all', () => {
    expect(filterNotifications(notifications, 'all')).toHaveLength(3);
  });

  it('returns only unread notifications when filter is unread', () => {
    expect(filterNotifications(notifications, 'unread')).toEqual([notifications[0], notifications[2]]);
  });

  it('returns only queued notifications when filter is queue', () => {
    expect(filterNotifications(notifications, 'queue')).toEqual([notifications[0]]);
  });
});
