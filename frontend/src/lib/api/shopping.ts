import { api } from './client';

export interface ApiShoppingItem {
  id: string;
  name: string;
  qty: string;
  price: number;
  aisle: string;
  done: boolean;
  note?: string;
}

export async function apiFetchShoppingItems(): Promise<ApiShoppingItem[]> {
  const data = await api.get<{ items: ApiShoppingItem[] }>('/api/shopping');
  return data.items;
}

export async function apiToggleShoppingItem(id: string): Promise<boolean> {
  const data = await api.patch<{ done: boolean }>(`/api/shopping/${id}/toggle`);
  return data.done;
}

export async function apiAddShoppingItem(item: Omit<ApiShoppingItem, 'id' | 'done'>): Promise<ApiShoppingItem> {
  const data = await api.post<{ item: ApiShoppingItem }>('/api/shopping', item);
  return data.item;
}

export async function apiDeleteShoppingItem(id: string): Promise<void> {
  await api.delete(`/api/shopping/${id}`);
}
