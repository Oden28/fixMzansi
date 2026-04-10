import type { SupabaseClient } from '@supabase/supabase-js';

export type NotificationRecord = {
  id: string;
  user_id: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'in_app';
  type: string;
  payload: Record<string, unknown> | null;
  status: 'queued' | 'sent' | 'failed';
  read_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export function filterNotifications(notifications: NotificationRecord[], filter: 'all' | 'unread' | 'queue') {
  if (filter === 'unread') {
    return notifications.filter((notification) => !notification.read_at);
  }

  if (filter === 'queue') {
    return notifications.filter((notification) => notification.status === 'queued');
  }

  return notifications;
}

export async function queueNotification(
  supabase: SupabaseClient,
  input: {
    userId: string;
    channel: 'email' | 'whatsapp' | 'sms' | 'in_app';
    type: string;
    payload: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from('notifications').insert({
    user_id: input.userId,
    channel: input.channel,
    type: input.type,
    payload: input.payload,
    status: 'queued',
  });

  if (error) throw error;
}

export async function markNotificationRead(supabase: SupabaseClient, notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);
  if (error) throw error;
}
