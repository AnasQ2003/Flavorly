import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, User, Plus } from "lucide-react";

const left = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/search", label: "Search", Icon: Search },
] as const;
const right = [
  { to: "/favorites", label: "Saved", Icon: Heart },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="absolute bottom-3 inset-x-3 z-30">
      <div className="relative rounded-[28px] bg-[linear-gradient(135deg,oklch(0.22_0.04_45),oklch(0.28_0.07_25),oklch(0.22_0.04_45))] animate-gradient text-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl px-2 glow-soft sheen-overlay">
        <span aria-hidden className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-saffron/70 to-transparent" />
        <div className="grid grid-cols-5 items-center h-16">
          {left.map((t) => (
            <TabItem key={t.to} {...t} active={isActive(pathname, t.to)} />
          ))}

          <div className="flex justify-center">
            <Link
              to="/categories"
              aria-label="Explore"
              className="-mt-8 size-14 rounded-2xl bg-gradient-to-br from-saffron via-tangerine to-spice text-white grid place-items-center shadow-warm ring-4 ring-surface active:scale-90 hover:rotate-90 transition-all duration-300 animate-glow-pulse"
            >
              <Plus className="size-7" strokeWidth={2.8} />
            </Link>
          </div>

          {right.map((t) => (
            <TabItem key={t.to} {...t} active={isActive(pathname, t.to)} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function isActive(pathname: string, to: string) {
  return pathname === to || (to !== "/home" && pathname.startsWith(to));
}

function TabItem({
  to,
  label,
  Icon,
  active,
}: {
  to: string;
  label: string;
  Icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className="relative flex flex-col items-center justify-center gap-0.5 h-full group"
    >
      <span
        className={`grid place-items-center size-9 rounded-xl transition-all duration-300 ${
          active
            ? "bg-gradient-to-br from-tangerine to-primary text-white shadow-warm scale-110"
            : "text-background/55 group-active:scale-90"
        }`}
      >
        <Icon className="size-[18px]" strokeWidth={active ? 2.6 : 2} />
      </span>
      <span
        className={`text-[9px] font-semibold tracking-wider uppercase transition-colors ${
          active ? "text-saffron" : "text-background/45"
        }`}
      >
        {label}
      </span>
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-saffron animate-pop" />
      )}
    </Link>
  );
}
