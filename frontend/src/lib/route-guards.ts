import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "./auth-store";

/** Throw a redirect to /auth if the user is not authenticated. */
export function requireAuth() {
  if (!useAuthStore.getState().isAuthenticated) {
    throw redirect({ to: "/auth" });
  }
}

/** Throw a redirect to /home if the user is already authenticated. */
export function redirectIfAuthenticated() {
  if (useAuthStore.getState().isAuthenticated) {
    throw redirect({ to: "/home" });
  }
}
