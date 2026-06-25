import { Link } from "@tanstack/react-router";
import { Menu, Bell, Search } from "lucide-react";
import avatar from "@/assets/avatar-chef.jpg";
import { useFlavorStore } from "@/lib/flavor-store";

type Props = {
  greeting?: string;
  name?: string;
  onMenu: () => void;
};

export function TopNav({ greeting = "Good evening", name, onMenu }: Props) {
  const profile = useFlavorStore((s) => s.profile);
  const displayName = name || profile.name || "Chef";
  const firstName = displayName.split(" ")[0];

  return (
    <header className="relative px-4 pt-10 pb-3 sticky top-0 z-20">
      <div className="absolute inset-0 bg-gradient-to-b from-tangerine/20 via-surface/90 to-surface/60 backdrop-blur-xl" />

      <div className="relative flex items-center gap-2">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="size-10 grid place-items-center rounded-2xl bg-gradient-to-br from-primary to-tangerine text-primary-foreground shadow-warm active:scale-90 transition"
        >
          <Menu className="size-5" strokeWidth={2.4} />
        </button>

        <div className="flex-1 min-w-0 px-3 py-1.5 rounded-2xl bg-card/85 backdrop-blur ring-1 ring-border glow-ring">
          <p className="text-[9px] uppercase tracking-[0.22em] text-primary font-bold leading-none">
            {greeting}
          </p>
          <p className="text-sm font-semibold text-foreground truncate leading-tight mt-0.5">
            {firstName} 👋
          </p>
        </div>

        <Link
          to="/search"
          className="size-10 grid place-items-center rounded-2xl bg-card ring-1 ring-border text-primary active:scale-90 transition"
          aria-label="Search"
        >
          <Search className="size-5" strokeWidth={2.4} />
        </Link>

        <Link
          to="/notifications"
          className="size-10 grid place-items-center rounded-2xl bg-gradient-to-br from-saffron to-tangerine text-foreground shadow-warm relative active:scale-90 transition"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={2.2} />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-spice ring-2 ring-surface animate-pulse-ring" />
        </Link>

        <Link
          to="/profile"
          className="size-10 rounded-2xl ring-2 ring-saffron overflow-hidden active:scale-90 transition shrink-0 grid place-items-center bg-muted"
        >
          {profile.avatar ? (
            <div className="size-full bg-gradient-to-br from-saffron to-spice grid place-items-center text-white text-xs font-bold uppercase">
              {profile.avatar}
            </div>
          ) : (
            <img src={avatar} alt="profile" className="size-full object-cover" loading="lazy" />
          )}
        </Link>
      </div>
    </header>
  );
}
