import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiLogin, apiRegister, apiLogout, type ApiUser } from "./api/auth";
import { getToken, clearToken } from "./api/client";
import { useFlavorStore, defaultProfile } from "./flavor-store";

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  userId: number | null;
  userName: string | null;
  userHandle: string | null;
  userAvatar: string | null;
  premium: boolean;
  /** Log in via real API. Falls back to demo if backend unavailable. */
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  /** Register via real API. Falls back to demo if backend unavailable. */
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  /** Hydrate user fields from an ApiUser object (called after login/me). */
  setUser: (user: ApiUser) => void;
};

// ── Demo fallback credentials (used when backend is unreachable) ────────────
const DEMO_EMAIL    = "anas@example.com";
const DEMO_PASSWORD = "anas123";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email:       null,
      userId:      null,
      userName:    null,
      userHandle:  null,
      userAvatar:  null,
      premium:     false,

      setUser: (user: ApiUser) =>
        set({
          isAuthenticated: true,
          email:       user.email,
          userId:      user.id,
          userName:    user.name,
          userHandle:  user.handle,
          userAvatar:  user.avatar,
          premium:     user.premium,
        }),

      login: async (email, password) => {
        // ── Try real API first ────────────────────────────────────────────
        try {
          const user = await apiLogin(email.trim().toLowerCase(), password);
          set({
            isAuthenticated: true,
            email:       user.email,
            userId:      user.id,
            userName:    user.name,
            userHandle:  user.handle,
            userAvatar:  user.avatar,
            premium:     user.premium,
          });
          return { ok: true };
        } catch (apiErr: unknown) {
          const msg = apiErr instanceof Error ? apiErr.message : '';

          // Surface auth errors directly (wrong password, not found, etc.)
          if (
            msg.toLowerCase().includes('invalid') ||
            msg.toLowerCase().includes('password') ||
            msg.toLowerCase().includes('email')
          ) {
            return { ok: false, error: msg || 'Invalid email or password.' };
          }

          // Network / server unreachable → try demo credentials
          const cleanEmail = email.trim().toLowerCase();
          const demoValid  =
            (cleanEmail === DEMO_EMAIL || cleanEmail === 'anas') &&
            password === DEMO_PASSWORD;

          if (!demoValid) {
            return { ok: false, error: 'Invalid email or password.' };
          }

          // Demo login
          set({
            isAuthenticated: true,
            email: DEMO_EMAIL,
            userId: 1,
            userName: 'Anas',
            userHandle: 'anas',
            userAvatar: 'AN',
            premium: true,
          });
          useFlavorStore.setState({
            profile: {
              name: 'Anas',
              handle: 'anas',
              email: DEMO_EMAIL,
              avatar: 'AN',
              bio: 'Self-taught home chef. Obsessed with slow cooking, sharp knives, and Mediterranean sun.',
              location: 'Kitchen',
              premium: true,
            }
          });
          return { ok: true };
        }
      },

      signup: async (name, email, password) => {
        if (!name.trim())
          return { ok: false, error: 'Please enter your name.' };
        if (!email.trim() || !email.includes('@'))
          return { ok: false, error: 'Please enter a valid email address.' };
        if (password.length < 6)
          return { ok: false, error: 'Password must be at least 6 characters.' };

        // ── Try real API first ────────────────────────────────────────────
        try {
          const user = await apiRegister(name, email, password);
          set({
            isAuthenticated: true,
            email:       user.email,
            userId:      user.id,
            userName:    user.name,
            userHandle:  user.handle,
            userAvatar:  user.avatar,
            premium:     user.premium,
          });
          return { ok: true };
        } catch (apiErr: unknown) {
          const msg = apiErr instanceof Error ? apiErr.message : '';

          // Surface real validation/conflict errors
          if (
            msg.toLowerCase().includes('already') ||
            msg.toLowerCase().includes('email') ||
            msg.toLowerCase().includes('password') ||
            msg.toLowerCase().includes('name')
          ) {
            return { ok: false, error: msg };
          }

          // Network unreachable → optimistic demo sign-up
          const avatarInitials = name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || "AN";
          set({
            isAuthenticated: true,
            email: email.trim().toLowerCase(),
            userId: 999,
            userName: name.trim(),
            userHandle: email.split('@')[0].toLowerCase(),
            userAvatar: avatarInitials,
            premium: false,
          });
          useFlavorStore.setState({
            profile: {
              name: name.trim(),
              handle: email.split('@')[0].toLowerCase(),
              email: email.trim().toLowerCase(),
              avatar: avatarInitials,
              bio: 'A passionate home cook exploring new flavors.',
              location: 'Kitchen',
              premium: false,
            }
          });
          return { ok: true };
        }
      },

      logout: () => {
        apiLogout();
        clearToken();
        set({
          isAuthenticated: false,
          email: null,
          userId: null,
          userName: null,
          userHandle: null,
          userAvatar: null,
          premium: false,
        });
        useFlavorStore.setState({
          profile: defaultProfile,
          apiSynced: false,
        });
      },
    }),
    { name: 'flavorly-auth-v1' }
  )
);
