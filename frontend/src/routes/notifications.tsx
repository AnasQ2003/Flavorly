import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useFlavorStore } from "@/lib/flavor-store";
import { toast } from "sonner";
import {
  Heart, ChefHat, MessageCircle, Award, Flame, Sparkles,
  BellOff, Calendar, ShoppingBasket, Bell, Filter, Trash2
} from "lucide-react";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/notifications")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Notifications — Cultivate" }] }),
  component: Notifications,
});

type N = {
  id: string;
  Icon: typeof Heart;
  grad: string;
  ring: string;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
  to: string;
  kind: "social" | "recipe" | "system" | "plan";
};

const filters = [
  { id: "all", label: "All" },
  { id: "social", label: "Social" },
  { id: "recipe", label: "Recipes" },
  { id: "plan", label: "Plan" },
  { id: "system", label: "Rewards" },
] as const;

function Notifications() {
  const navigate = useNavigate();
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");

  const notifications = useFlavorStore((s) => s.notifications);
  const markNotificationRead = useFlavorStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useFlavorStore((s) => s.markAllNotificationsRead);
  const clearNotifications = useFlavorStore((s) => s.clearNotifications);

  const getNotificationStyle = (type: string, title: string) => {
    if (title.toLowerCase().includes("reply")) {
      return { Icon: MessageCircle, grad: "from-leaf via-ocean to-grape", ring: "ring-ocean/40" };
    }
    if (title.toLowerCase().includes("item") || title.toLowerCase().includes("list")) {
      return { Icon: ShoppingBasket, grad: "from-tangerine to-spice", ring: "ring-spice/40" };
    }
    if (title.toLowerCase().includes("saved") || title.toLowerCase().includes("risotto")) {
      return { Icon: Flame, grad: "from-spice to-berry", ring: "ring-berry/40" };
    }
    if (title.toLowerCase().includes("pack") || title.toLowerCase().includes("asia")) {
      return { Icon: Sparkles, grad: "from-grape via-berry to-primary", ring: "ring-grape/40" };
    }

    switch (type) {
      case "social":
        return { Icon: Heart, grad: "from-spice via-berry to-grape", ring: "ring-spice/40" };
      case "recipe":
        return { Icon: ChefHat, grad: "from-primary via-tangerine to-saffron", ring: "ring-tangerine/40" };
      case "plan":
        return { Icon: Calendar, grad: "from-leaf to-saffron", ring: "ring-leaf/40" };
      case "system":
        return { Icon: Award, grad: "from-saffron via-tangerine to-spice", ring: "ring-saffron/40" };
      default:
        return { Icon: Bell, grad: "from-primary to-tangerine", ring: "ring-primary/40" };
    }
  };

  const allMapped: N[] = notifications.map((n) => {
    const style = getNotificationStyle(n.type, n.title);
    return {
      id: n.id,
      Icon: style.Icon,
      grad: style.grad,
      ring: style.ring,
      title: n.title,
      desc: n.body,
      time: n.timeLabel,
      unread: !n.isRead,
      to: n.to || "/notifications",
      kind: (n.type === "social" || n.type === "recipe" || n.type === "plan" || n.type === "system" ? n.type : "system")
    };
  });

  const list = allMapped.filter((n) => active === "all" || n.kind === active);
  const unreadCount = allMapped.filter((n) => n.unread).length;

  const today = list.filter((n) => n.time.endsWith("m") || n.time.endsWith("h"));
  const earlier = list.filter((n) => n.time.endsWith("d"));

  const open = async (n: N) => {
    try {
      await markNotificationRead(n.id);
    } catch {
      // Ignored
    }
    navigate({ to: n.to });
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to update notifications.");
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();
      toast.success("Notifications cleared.");
    } catch {
      toast.error("Failed to clear notifications.");
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="Notifications" />
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-32 bg-gradient-to-b from-saffron/10 via-surface to-grape/10">
        {/* Hero summary */}
        <div className="px-5 pt-2">
          <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-spice via-tangerine to-saffron text-primary-foreground shadow-warm animate-slide-up">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-card/15 blur-2xl" />
            <div className="absolute -right-2 -bottom-6 size-20 rounded-full bg-card/10 blur-xl" />
            <div className="relative flex items-center gap-4">
              <span className="size-14 rounded-2xl bg-card/20 backdrop-blur-md grid place-items-center ring-1 ring-card/30">
                <Bell className="size-6" strokeWidth={2.2} />
              </span>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest opacity-80">Inbox</p>
                <p className="font-display text-2xl leading-tight">{unreadCount} new pings</p>
                <p className="text-xs opacity-85 mt-0.5">Tap any card to jump straight there.</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleMarkAll}
                  className="text-[10px] font-semibold uppercase tracking-widest bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-3 py-1.5 rounded-full active:scale-95 transition text-center"
                >
                  Mark all
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-[10px] font-semibold uppercase tracking-widest bg-spice/20 backdrop-blur-md ring-1 ring-spice/30 px-3 py-1.5 rounded-full active:scale-95 transition text-center flex items-center gap-1 justify-center"
                  >
                    <Trash2 className="size-3" /> Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            <span className="size-9 rounded-full bg-card ring-1 ring-border grid place-items-center shrink-0">
              <Filter className="size-4 text-muted-foreground" />
            </span>
            {filters.map((f) => {
              const on = active === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ring-1 transition-all ${
                    on
                      ? "bg-foreground text-background ring-foreground shadow-warm scale-[1.02]"
                      : "bg-card text-foreground ring-border hover:ring-primary/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-5 space-y-6">
          {today.length > 0 && (
            <Section label="Today" items={today} onOpen={open} />
          )}
          {earlier.length > 0 && (
            <Section label="Earlier this week" items={earlier} onOpen={open} />
          )}
          {list.length === 0 && (
            <div className="p-8 rounded-3xl bg-card ring-1 ring-border text-center animate-slide-up">
              <span className="text-4xl">🫧</span>
              <p className="font-display text-lg mt-2">No pings in this filter</p>
              <p className="text-xs text-muted-foreground mt-1">Try another category.</p>
            </div>
          )}

          <div className="mt-2 p-5 rounded-3xl bg-gradient-to-br from-leaf/20 via-saffron/15 to-tangerine/15 ring-1 ring-leaf/30 text-center animate-slide-up">
            <BellOff className="size-6 mx-auto text-leaf" />
            <p className="font-display text-lg mt-2">You're all caught up</p>
            <p className="text-xs text-muted-foreground mt-1">
              We'll ping you the moment something tasty happens.
            </p>
          </div>
        </div>
      </main>
      <BottomTabBar />
    </PhoneFrame>
  );
}

function Section({
  label, items, onOpen,
}: { label: string; items: N[]; onOpen: (n: N) => void }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3 px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
        <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        <span className="text-[10px] text-muted-foreground">{items.length}</span>
      </div>
      <div className="space-y-2.5">
        {items.map((n, i) => {
          return (
            <button
              key={n.id}
              onClick={() => onOpen(n)}
              className={`group relative w-full text-left flex gap-3 items-start bg-card p-3.5 rounded-2xl ring-1 ${n.ring} shadow-soft animate-slide-in-right hover-lift overflow-hidden active:scale-[0.99] transition`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {n.unread && (
                <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${n.grad}`} />
              )}
              <span
                className={`size-12 shrink-0 rounded-2xl grid place-items-center bg-gradient-to-br ${n.grad} text-primary-foreground shadow-warm`}
              >
                <n.Icon className="size-5" strokeWidth={2.2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.desc}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 mt-1.5">
                  Tap to open →
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
                {n.unread && <span className="size-2.5 rounded-full bg-spice animate-pulse ring-2 ring-spice/30" />}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
