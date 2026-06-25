import { Link, useNavigate } from "@tanstack/react-router";
import {
  X,
  User,
  Settings,
  CalendarDays,
  ShoppingBasket,
  Globe,
  FileText,
  Shield,
  LogOut,
  Heart,
  Sparkles,
} from "lucide-react";
import avatar from "@/assets/avatar-chef.jpg";
import { useFlavorStore } from "@/lib/flavor-store";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const profile = useFlavorStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-md animate-fade-in"
      />
      <aside className="absolute inset-y-0 left-0 w-[86%] max-w-[360px] bg-surface shadow-2xl flex flex-col animate-drawer-in overflow-hidden">
        {/* Colorful gradient header */}
        <div className="relative px-6 pt-12 pb-8 bg-[linear-gradient(140deg,var(--primary),var(--tangerine),var(--berry))] animate-gradient text-primary-foreground overflow-hidden">
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-saffron/40 blur-3xl animate-blob" />
          <div className="absolute -bottom-16 -left-10 size-44 rounded-full bg-leaf/30 blur-3xl animate-blob [animation-delay:2s]" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute inset-0 rounded-2xl bg-white/30 animate-pulse-ring" />
                <div className="size-16 rounded-2xl overflow-hidden ring-2 ring-white/70 shadow-xl grid place-items-center bg-muted">
                  {profile.avatar ? (
                    <div className="size-full bg-gradient-to-br from-saffron to-spice grid place-items-center text-white text-xl font-bold uppercase">
                      {profile.avatar}
                    </div>
                  ) : (
                    <img src={avatar} alt="" className="size-full object-cover" />
                  )}
                </div>
              </div>
              <div>
                <p className="font-display text-2xl leading-none">{profile.name}</p>
                {profile.premium && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur text-[10px] font-semibold uppercase tracking-widest">
                    <Sparkles className="size-3" /> Premium
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-9 grid place-items-center rounded-full bg-white/25 backdrop-blur hover:bg-white/35 active:scale-90 transition"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Mini stats */}
          <div className="relative mt-6 grid grid-cols-3 gap-2 text-center">
            {[
              ["48", "Saved"],
              ["12", "Cooked"],
              ["7", "Streak"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/15 backdrop-blur py-2 ring-1 ring-white/20">
                <p className="font-display text-xl leading-none">{n}</p>
                <p className="text-[9px] uppercase tracking-widest opacity-80 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <nav className="px-4 pt-4 space-y-1 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <DrawerItem to="/profile" Icon={User} label="My Profile" tint="primary" onClose={onClose} />
          <DrawerItem to="/favorites" Icon={Heart} label="My Favorites" tint="spice" onClose={onClose} />
          <DrawerItem to="/mealplan" Icon={CalendarDays} label="Meal Plan" tint="leaf" onClose={onClose} />
          <DrawerItem
            to="/shopping"
            Icon={ShoppingBasket}
            label="Shopping List"
            tint="tangerine"
            onClose={onClose}
          />
          <DrawerItem to="/onboarding" Icon={Globe} label="Region & Tastes" tint="berry" onClose={onClose} />
          <DrawerItem to="/settings" Icon={Settings} label="Settings" tint="saffron" onClose={onClose} />
          <div className="h-px bg-border my-3" />
          <DrawerItem to="/terms" Icon={FileText} label="Terms of Use" tint="primary" onClose={onClose} />
          <DrawerItem to="/privacy" Icon={Shield} label="Privacy Policy" tint="leaf" onClose={onClose} />
        </nav>

        <div className="p-5">
          <button
            onClick={() => {
              logout();
              onClose();
              toast.success("Successfully logged out.");
              navigate({ to: "/auth" });
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-destructive/10 text-destructive font-semibold ring-1 ring-destructive/20 hover:bg-destructive/15 active:scale-[0.98] transition cursor-pointer"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
}

const TINTS: Record<string, string> = {
  primary: "from-primary/15 to-primary/5 text-primary",
  spice: "from-spice/15 to-spice/5 text-spice",
  leaf: "from-leaf/20 to-leaf/5 text-leaf",
  tangerine: "from-tangerine/20 to-tangerine/5 text-tangerine",
  berry: "from-berry/20 to-berry/5 text-berry",
  saffron: "from-saffron/30 to-saffron/10 text-foreground",
};

function DrawerItem({
  to,
  Icon,
  label,
  tint,
  onClose,
}: {
  to: string;
  Icon: typeof User;
  label: string;
  tint: keyof typeof TINTS | string;
  onClose: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-foreground hover:bg-muted transition-colors"
    >
      <span
        className={`size-10 grid place-items-center rounded-xl bg-gradient-to-br ${TINTS[tint] ?? TINTS.primary} group-hover:scale-110 transition-transform`}
      >
        <Icon className="size-4" strokeWidth={2.2} />
      </span>
      <span className="text-sm font-medium flex-1">{label}</span>
      <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition">›</span>
    </Link>
  );
}
