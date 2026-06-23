import { api, setToken, clearToken } from './client';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  bio?: string;
  location?: string;
  premium: boolean;
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

export async function apiLogin(email: string, password: string): Promise<ApiUser> {
  const data = await api.post<AuthResponse>('/api/auth/login', { email, password });
  setToken(data.token);
  return data.user;
}

export async function apiRegister(name: string, email: string, password: string): Promise<ApiUser> {
  const data = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
  setToken(data.token);
  return data.user;
}

export async function apiGetMe(): Promise<ApiUser> {
  const data = await api.get<{ user: ApiUser }>('/api/auth/me');
  return data.user;
}

export function apiLogout(): void {
  clearToken();
}
