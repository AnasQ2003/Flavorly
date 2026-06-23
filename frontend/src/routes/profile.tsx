import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "@/lib/route-guards";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import avatar from "@/assets/avatar-chef.jpg";
import { Pencil, ChefHat, Heart, BookOpen, Award, Share2, Sparkles, LogOut } from "lucide-react";
import { recipes, blogs } from "@/lib/mock-data";
import { useFlavorStore } from "@/lib/flavor-store";
import { useAuthStore } from "@/lib/auth-store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Profile — Cultivate" }] }),
  component: Profile,
});

const tabs = ["Recipes", "Saved", "Blogs"] as const;

function Profile() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Recipes");
  const navigate = useNavigate();

  const profile = useFlavorStore((s) => s.profile);
  const favorites = useFlavorStore((s) => s.favorites);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out.");
    navigate({ to: "/auth" });
  };

  // Determine list to show in grid based on tab
  const getTabItems = () => {
    if (tab === "Saved") {
      return recipes
        .filter((r) => favorites.includes(r.id))
        .map((r) => ({ id: r.id, title: r.title, image: r.image, link: `/recipe/${r.id}` }));
    }
    if (tab === "Blogs") {
      return blogs.map((b) => ({ id: b.id, title: b.title, image: b.image, link: `/blog/${b.id}` }));
    }
    // Default "Recipes" tab (user's own recipes - show some chef recommendations)
    return recipes
      .slice(0, 3)
      .map((r) => ({ id: r.id, title: r.title, image: r.image, link: `/recipe/${r.id}` }));
  };

  const currentItems = getTabItems();

  return (
    <AppShell>
      <div className="px-5 pt-2 bg-gradient-to-b from-primary/10 via-surface to-grape/8 min-h-full">
        {/* Hero card */}
        <div className="relative bg-[linear-gradient(135deg,var(--primary),var(--berry),var(--grape))] animate-gradient text-primary-foreground rounded-[32px] p-6 overflow-hidden animate-scale-in shadow-warm">
          <div className="size-44 rounded-full bg-saffron/30 absolute -top-16 -right-10 blur-3xl animate-blob" />
          <div className="size-32 rounded-full bg-tangerine/30 absolute -bottom-12 -left-6 blur-3xl animate-blob [animation-delay:2s]" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative">
              <span className="absolute inset-0 rounded-2xl bg-white/30 animate-pulse-ring" />
              <div className="size-20 rounded-2xl ring-2 ring-white/60 overflow-hidden shadow-xl bg-muted grid place-items-center">
                {profile.avatar ? (
                  <div className="size-full bg-gradient-to-br from-saffron to-spice grid place-items-center text-white text-2xl font-bold">
                    {profile.avatar}
                  </div>
                ) : (
                  <img src={avatar} alt="" className="size-full object-cover" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-2xl truncate">{profile.name}</h2>
              <p className="text-sm text-white/85 truncate">@{profile.handle}</p>
              {profile.premium && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-saffron/90 text-foreground text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="size-3" /> Premium chef
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="size-9 bg-white/20 backdrop-blur rounded-full grid place-items-center ring-1 ring-white/30 hover:bg-spice active:scale-90 transition"
              >
                <LogOut className="size-4" />
              </button>
              <Link
                to="/profile/edit"
                className="size-9 bg-white/20 backdrop-blur rounded-full grid place-items-center ring-1 ring-white/30 active:scale-90 transition"
                aria-label="Edit profile"
              >
                <Pencil className="size-4" />
              </Link>
            </div>
          </div>

          <p className="relative z-10 text-sm text-white/90 mt-4 leading-relaxed">
            {profile.bio}
          </p>

          <div className="relative z-10 mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "My Recipes", val: "3" },
              { label: "Followers", val: "1.2k" },
              { label: "Following", val: "189" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/15 backdrop-blur rounded-2xl py-3 ring-1 ring-white/20"
              >
                <p className="font-display text-xl leading-none">{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/75 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Colored stat cards */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <StatCard Icon={Heart} value={`${favorites.length}`} label="Saved" grad="from-spice to-berry" />
          <StatCard Icon={ChefHat} value="68" label="Cooked" grad="from-primary to-tangerine" />
          <StatCard Icon={BookOpen} value={`${blogs.length}`} label="Blogs" grad="from-leaf to-ocean" />
          <StatCard Icon={Award} value="5" label="Badges" grad="from-saffron to-spice" />
        </div>

        {/* Tabs */}
        <div className="mt-6 relative flex p-1 bg-muted rounded-2xl ring-1 ring-border">
          <span
            className="absolute inset-y-1 w-[calc(33.333%-3px)] bg-gradient-to-r from-primary to-tangerine rounded-xl shadow-warm transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(calc(${tabs.indexOf(tab)} * (100% + 4px)))`,
            }}
          />
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold relative z-10 transition-colors ${
                tab === t ? "text-white" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <section className="mt-5 pb-4 animate-fade-in" key={tab}>
          <div className="grid grid-cols-3 gap-2">
            {currentItems.map((r, i) => (
              <Link
                key={r.id}
                to={r.link as any}
                className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-border hover-lift animate-pop shadow-soft"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <img src={r.image} alt="" className="size-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <p className="absolute bottom-1.5 left-2 right-2 text-[10px] font-semibold text-white line-clamp-1">
                  {r.title}
                </p>
              </Link>
            ))}
            {currentItems.length === 0 && (
              <p className="col-span-3 text-center text-xs text-muted-foreground py-10">
                Nothing here yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({
  Icon,
  value,
  label,
  grad,
}: {
  Icon: typeof Heart;
  value: string;
  label: string;
  grad: string;
}) {
  return (
    <div
      className={`rounded-2xl p-3 bg-gradient-to-br ${grad} text-white shadow-warm animate-pop hover-lift`}
    >
      <Icon className="size-4" strokeWidth={2.4} />
      <p className="font-display text-xl leading-none mt-2">{value}</p>
      <p className="text-[9px] uppercase tracking-widest opacity-90 mt-0.5">{label}</p>
    </div>
  );
}
