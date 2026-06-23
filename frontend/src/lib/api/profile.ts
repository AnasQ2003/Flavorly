import { api } from './client';

export interface ApiProfile {
  id: number;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  premium: boolean;
}

interface ProfileResponse { profile: ApiProfile }

export async function apiFetchProfile(): Promise<ApiProfile> {
  const data = await api.get<ProfileResponse>('/api/profile');
  return data.profile;
}

export async function apiUpdateProfile(patch: Partial<Omit<ApiProfile, 'id' | 'email'>>): Promise<ApiProfile> {
  const data = await api.put<ProfileResponse>('/api/profile', patch);
  return data.profile;
}

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.put('/api/profile/password', { currentPassword, newPassword });
}
