import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { recipes } from "@/lib/mock-data";
import { Heart, Sparkles, Clock } from "lucide-react";
import { useFlavorStore } from "@/lib/flavor-store";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/favorites")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Favorites — Cultivate" }] }),
  component: Favorites,
});

const filters = ["All", "Dinner", "Starters", "Desserts", "Quick"] as const;

function Favorites() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const favorites = useFlavorStore((s) => s.favorites);
  const toggleFavorite = useFlavorStore((s) => s.toggleFavorite);

  const favs = recipes.filter((r) => favorites.includes(r.id));
  const filtered =
    active === "All"
      ? favs
      : active === "Quick"
        ? favs.filter((r) => parseInt(r.time) <= 25)
        : favs.filter((r) => r.category === active.toLowerCase().replace(/s$/, ""));


  return (
    <AppShell>
      <div className="px-5 pt-2 bg-gradient-to-b from-berry/8 via-surface to-tangerine/8 min-h-full">
        <div className="relative rounded-[28px] overflow-hidden bg-[linear-gradient(135deg,var(--berry),var(--spice),var(--tangerine))] animate-gradient p-6 text-white shadow-warm animate-scale-in">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-saffron/40 blur-3xl" />
          <div className="absolute -bottom-12 -left-8 size-32 rounded-full bg-grape/40 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] opacity-80 flex items-center gap-1.5">
                <Sparkles className="size-3" /> Your collection
              </p>
              <h2 className="font-display text-3xl mt-1.5">Saved bites</h2>
              <p className="text-sm opacity-90 mt-1">{favs.length} recipes you loved</p>
            </div>
            <div className="size-16 rounded-2xl bg-white/20 backdrop-blur grid place-items-center ring-1 ring-white/30 animate-float">
              <Heart className="size-7" fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mt-5 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                active === f
                  ? "bg-gradient-to-r from-primary to-tangerine text-white shadow-warm scale-105"
                  : "bg-card text-foreground ring-1 ring-border glow-card-enhanced"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pb-4">
          {filtered.map((r, i) => (
            <Link
              key={r.id}
              to="/recipe/$id"
              params={{ id: r.id }}
              className="bg-card rounded-3xl overflow-hidden ring-1 ring-border hover-lift animate-pop relative glow-card-enhanced"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative">
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(r.id);
                  }}
                  className="absolute top-2 right-2 size-9 bg-white/95 backdrop-blur rounded-full grid place-items-center text-spice shadow-warm active:scale-90 transition"
                >
                  <Heart className="size-4" fill="currentColor" />
                </button>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-primary flex items-center gap-1">
                  <Clock className="size-3" /> {r.time}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-widest text-tangerine font-bold">
                  {r.region}
                </p>
                <h5 className="font-semibold text-sm leading-tight mt-1 line-clamp-2">
                  {r.title}
                </h5>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-muted-foreground py-12">
              No recipes match — try another filter.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
