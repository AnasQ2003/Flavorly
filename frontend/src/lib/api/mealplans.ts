import { api } from './client';

export interface ApiMealPlan {
  id: string; // e.g. "mp_0_breakfast"
  dateOffset: number; // 0 for today, 1 for tomorrow, etc.
  slot: string; // "breakfast" | "lunch" | "dinner" | "snack"
  recipeId?: string;
  servings?: number;
  calories?: number;
  title?: string;
  chef?: string;
  image?: string;
  time?: string;
}

export async function apiFetchMealPlans(dateOffset?: number): Promise<ApiMealPlan[]> {
  const path = dateOffset !== undefined ? `/api/mealplans?dateOffset=${dateOffset}` : '/api/mealplans';
  const data = await api.get<{ mealplans: ApiMealPlan[] }>(path);
  return data.mealplans;
}

export async function apiUpdateMealPlanSlot(
  id: string,
  patch: Partial<Omit<ApiMealPlan, 'id' | 'dateOffset' | 'slot'>>
): Promise<ApiMealPlan> {
  const data = await api.put<{ mealplan: ApiMealPlan }>(`/api/mealplans/${id}`, patch);
  return data.mealplan;
}
