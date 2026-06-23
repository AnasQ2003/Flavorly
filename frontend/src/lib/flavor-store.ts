import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { apiFetchFavorites, apiAddFavorite, apiRemoveFavorite } from "./api/recipes";
import { apiFetchMealPlans, apiUpdateMealPlanSlot, type ApiMealPlan } from "./api/mealplans";
import { apiFetchShoppingItems, apiToggleShoppingItem, apiAddShoppingItem, apiDeleteShoppingItem, type ApiShoppingItem } from "./api/shopping";
import { apiFetchNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead, apiClearNotifications, type ApiNotification } from "./api/notifications";
import { apiFetchProfile, apiUpdateProfile } from "./api/profile";
import { getToken } from "./api/client";

export interface ProfileState {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  premium: boolean;
}

type FlavorState = {
  favorites: string[];
  mealPlans: ApiMealPlan[];
  shoppingList: ApiShoppingItem[];
  notifications: ApiNotification[];
  profile: ProfileState;
  apiSynced: boolean;

  // ── Actions ────────────────────────────────────────────────────────
  toggleFavorite: (recipeId: string) => Promise<void>;
  updateMealPlanSlot: (id: string, patch: Partial<Omit<ApiMealPlan, 'id' | 'dateOffset' | 'slot'>>) => Promise<void>;
  toggleShoppingItem: (id: string) => Promise<void>;
  addShoppingItem: (item: Omit<ApiShoppingItem, 'id' | 'done'>) => Promise<void>;
  deleteShoppingItem: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  updateProfile: (patch: Partial<ProfileState>) => Promise<void>;
  loadFromApi: () => Promise<void>;
};

// ── Initial Mock Seeds (aligns with DB seeds for Anas) ──────────────────────
const seedFavorites: string[] = [
  'wagyu-chimichurri',
  'leek-bisque',
  'truffle-pasta',
  'burrata-salad',
  'lava-cake',
  'bruschetta'
];

const seedMealPlans: ApiMealPlan[] = [
  { id: 'm1', dateOffset: 2, slot: 'breakfast', recipeId: 'wagyu-chimichurri', servings: 2 },
  { id: 'm2', dateOffset: 2, slot: 'lunch', recipeId: 'leek-bisque', servings: 4 },
  { id: 'm3', dateOffset: 2, slot: 'snack', recipeId: 'snack-yogurt', servings: 1, title: 'Honey Pistachio Yogurt', chef: 'Cultivate Kitchen', image: '/src/assets/recipe-dessert.jpg', time: '5 min', calories: 180 },
  { id: 'm4', dateOffset: 2, slot: 'dinner', recipeId: 'truffle-pasta', servings: 2 }
];

const seedShoppingList: ApiShoppingItem[] = [
  { id: 's1', name: "Heirloom Tomatoes", qty: "4 large", price: 6.4, aisle: "Produce", done: false, note: "Ripe, not soft." },
  { id: 's2', name: "Fresh Basil", qty: "1 bunch", price: 2.5, aisle: "Produce", done: false },
  { id: 's3', name: "Lemons", qty: "3", price: 1.8, aisle: "Produce", done: true },
  { id: 's4', name: "Wagyu Ribeye", qty: "400g", price: 38.0, aisle: "Protein", done: false, note: "Ask for A5 grade." },
  { id: 's5', name: "Atlantic Salmon", qty: "300g", price: 14.5, aisle: "Protein", done: false },
  { id: 's6', name: "Burrata", qty: "2 balls", price: 8.0, aisle: "Dairy", done: true },
  { id: 's7', name: "Aged Parmesan", qty: "200g", price: 12.0, aisle: "Dairy", done: false, note: "24-month minimum." },
  { id: 's8', name: "Olive Oil (EVOO)", qty: "1 bottle", price: 18.0, aisle: "Pantry", done: false },
  { id: 's9', name: "Black Truffle", qty: "20g", price: 32.0, aisle: "Pantry", done: true },
  { id: 's10', name: "Sourdough Loaf", qty: "1", price: 7.5, aisle: "Bakery", done: false },
  { id: 's11', name: "Malbec Reserve", qty: "1 bottle", price: 24.0, aisle: "Wine", done: false, note: "Pairs with wagyu." }
];

const seedNotifications: ApiNotification[] = [
  { id: 'n1', type: 'social', title: 'Sofia loved your bruschetta', body: '“Best I\'ve ever had — added extra basil!”', to: '/recipe/bruschetta', timeLabel: '2m', isRead: false },
  { id: 'n2', type: 'recipe', title: 'Marco Bellini posted a new recipe', body: 'Pan-Seared Wagyu with Chimichurri — 35 min · Intermediate', to: '/recipe/wagyu-chimichurri', timeLabel: '1h', isRead: false },
  { id: 'n3', type: 'social', title: 'Anika replied to your comment', body: '“Add a pinch of saffron — game changer.”', to: '/blog/broth-bones', timeLabel: '3h', isRead: true },
  { id: 'n4', type: 'plan', title: 'Tomorrow\'s meal plan is ready', body: 'Shakshuka · Truffle Linguine · Crema Catalana', to: '/mealplan', timeLabel: '5h', isRead: false },
  { id: 'n5', type: 'plan', title: '4 items still on your list', body: 'Heirloom tomatoes, sourdough, EVOO & parmesan', to: '/shopping', timeLabel: '8h', isRead: true },
  { id: 'n6', type: 'system', title: 'Achievement unlocked: Pasta Pro', body: '5 pasta recipes cooked this month 🍝 +120 XP', to: '/profile', timeLabel: '1d', isRead: true },
  { id: 'n7', type: 'social', title: '12 cooks saved your risotto', body: 'Trending #3 in Mediterranean this week.', to: '/profile', timeLabel: '2d', isRead: true },
  { id: 'n8', type: 'recipe', title: 'New regional pack: Southeast Asia', body: '42 new recipes ready to explore.', to: '/region/east-asian', timeLabel: '3d', isRead: true }
];

const defaultProfile: ProfileState = {
  name: "Julian Thorne",
  handle: "julian.cooks",
  email: "julian@cultivate.app",
  avatar: "JT",
  bio: "Home cook chasing the perfect risotto. Lover of olive oil, sourdough and slow Sundays.",
  location: "Kitchen",
  premium: true
};

export const useFlavorStore = create<FlavorState>()(
  persist(
    (set, get) => ({
      favorites: seedFavorites,
      mealPlans: seedMealPlans,
      shoppingList: seedShoppingList,
      notifications: seedNotifications,
      profile: defaultProfile,
      apiSynced: false,

      toggleFavorite: async (recipeId: string) => {
        const isFav = get().favorites.includes(recipeId);
        // Optimistic local update
        set((s) => ({
          favorites: isFav
            ? s.favorites.filter((id) => id !== recipeId)
            : [...s.favorites, recipeId]
        }));

        if (getToken()) {
          try {
            if (isFav) {
              await apiRemoveFavorite(recipeId);
            } else {
              await apiAddFavorite(recipeId);
            }
          } catch {
            // Keep optimistic value
          }
        }
      },

      updateMealPlanSlot: async (id, patch) => {
        // Optimistic update
        set((s) => ({
          mealPlans: s.mealPlans.map((mp) => (mp.id === id ? { ...mp, ...patch } : mp))
        }));

        if (getToken()) {
          try {
            await apiUpdateMealPlanSlot(id, patch);
          } catch {
            // Keep optimistic value
          }
        }
      },

      toggleShoppingItem: async (id) => {
        // Optimistic update
        set((s) => ({
          shoppingList: s.shoppingList.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
        }));

        if (getToken()) {
          try {
            const nextDone = await apiToggleShoppingItem(id);
            set((s) => ({
              shoppingList: s.shoppingList.map((item) => (item.id === id ? { ...item, done: nextDone } : item))
            }));
          } catch {
            // Keep optimistic
          }
        }
      },

      addShoppingItem: async (item) => {
        const tempId = `s${Date.now()}`;
        const newItem: ApiShoppingItem = { ...item, id: tempId, done: false };

        // Optimistic update
        set((s) => ({
          shoppingList: [...s.shoppingList, newItem]
        }));

        if (getToken()) {
          try {
            const added = await apiAddShoppingItem(item);
            set((s) => ({
              shoppingList: s.shoppingList.map((x) => (x.id === tempId ? added : x))
            }));
          } catch {
            // Keep optimistic
          }
        }
      },

      deleteShoppingItem: async (id) => {
        // Optimistic update
        set((s) => ({
          shoppingList: s.shoppingList.filter((item) => item.id !== id)
        }));

        if (getToken()) {
          try {
            await apiDeleteShoppingItem(id);
          } catch {
            // Keep optimistic
          }
        }
      },

      markNotificationRead: async (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        }));

        if (getToken()) {
          try {
            await apiMarkNotificationRead(id);
          } catch {
            // Keep optimistic
          }
        }
      },

      markAllNotificationsRead: async () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true }))
        }));

        if (getToken()) {
          try {
            await apiMarkAllNotificationsRead();
          } catch {
            // Keep optimistic
          }
        }
      },

      clearNotifications: async () => {
        set({ notifications: [] });

        if (getToken()) {
          try {
            await apiClearNotifications();
          } catch {
            // Keep optimistic
          }
        }
      },

      updateProfile: async (patch) => {
        // Optimistic update
        set((s) => ({
          profile: { ...s.profile, ...patch }
        }));

        if (getToken()) {
          try {
            const apiPatch: any = {};
            if (patch.name !== undefined) apiPatch.name = patch.name;
            if (patch.handle !== undefined) apiPatch.handle = patch.handle;
            if (patch.bio !== undefined) apiPatch.bio = patch.bio;
            if (patch.location !== undefined) apiPatch.location = patch.location;
            if (patch.avatar !== undefined) apiPatch.avatar = patch.avatar;

            const updated = await apiUpdateProfile(apiPatch);
            set({
              profile: {
                name: updated.name,
                handle: updated.handle,
                email: updated.email,
                avatar: updated.avatar,
                bio: updated.bio ?? '',
                location: updated.location ?? '',
                premium: updated.premium,
              }
            });
          } catch {
            // Keep optimistic
          }
        }
      },

      loadFromApi: async () => {
        if (!getToken()) return;
        try {
          const [favs, mealPlans, shoppingList, notifications, profile] = await Promise.all([
            apiFetchFavorites(),
            apiFetchMealPlans(),
            apiFetchShoppingItems(),
            apiFetchNotifications(),
            apiFetchProfile()
          ]);

          set({
            favorites: favs,
            mealPlans,
            shoppingList,
            notifications,
            profile: {
              name: profile.name,
              handle: profile.handle,
              email: profile.email,
              avatar: profile.avatar,
              bio: profile.bio ?? '',
              location: profile.location ?? '',
              premium: profile.premium,
            },
            apiSynced: true
          });
        } catch {
          // Backend unreachable — stay on local / cached data
        }
      }
    }),
    { name: "flavorly-store-v1" }
  )
);

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
