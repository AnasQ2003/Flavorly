import { api } from './client';

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  to?: string;
  timeLabel: string;
  isRead: boolean;
}

export async function apiFetchNotifications(): Promise<ApiNotification[]> {
  const data = await api.get<{ notifications: ApiNotification[] }>('/api/notifications');
  return data.notifications;
}

export async function apiMarkNotificationRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/read`);
}

export async function apiMarkAllNotificationsRead(): Promise<void> {
  await api.patch('/api/notifications/read-all');
}

export async function apiClearNotifications(): Promise<void> {
  await api.delete('/api/notifications');
}
