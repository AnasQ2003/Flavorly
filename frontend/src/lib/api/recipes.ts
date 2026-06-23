import { api } from './client';

export async function apiFetchFavorites(): Promise<string[]> {
  const data = await api.get<{ favorites: string[] }>('/api/recipes/favorites');
  return data.favorites;
}

export async function apiAddFavorite(recipeId: string): Promise<void> {
  await api.post(`/api/recipes/favorites/${recipeId}`, {});
}

export async function apiRemoveFavorite(recipeId: string): Promise<void> {
  await api.delete(`/api/recipes/favorites/${recipeId}`);
}
