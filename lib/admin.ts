export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export type AdminQueueItemType = 'pro' | 'request' | 'review' | 'booking' | 'notification';

export type AdminQueueItem = {
  id: string;
  type: AdminQueueItemType;
  title: string;
  status: ModerationStatus | string;
  createdAt: string;
  description?: string;
  meta?: string[];
};

export type AdminKpi = {
  label: string;
  value: string;
  delta?: string;
};

export type AdminDashboardPayload = {
  kpis: AdminKpi[];
  queue: AdminQueueItem[];
};
