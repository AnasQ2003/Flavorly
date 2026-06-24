import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { categories, recipes, regions } from "@/lib/mock-data";
import { Sparkles, TrendingUp, Search as SearchIcon, X } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Explore — Cultivate" }] }),
  component: Categories,
});

const moods = [
  { label: "Quick & easy", emoji: "⚡", grad: "from-saffron to-tangerine", filter: "Quick" },
  { label: "Cozy night", emoji: "🕯️", grad: "from-spice to-berry", filter: "cozy" },
  { label: "Show off", emoji: "🎉", grad: "from-tangerine to-spice", filter: "Chef" },
  { label: "Healthy", emoji: "🌱", grad: "from-leaf to-ocean", filter: "salad" },
];

function Categories() {
  const navigate = useNavigate();
  const [regionQ, setRegionQ] = useState("");
  const filteredRegions = regions.filter(
    (r) => !regionQ || r.name.toLowerCase().includes(regionQ.toLowerCase()) || r.country.toLowerCase().includes(regionQ.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="px-5 pt-2 bg-gradient-to-b from-tangerine/10 via-surface to-leaf/8 min-h-full pb-4">
        <div className="animate-slide-up">
          <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="size-3" /> Explore
          </p>
          <h2 className="font-display text-3xl mt-1">Find your next dish</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Browse by mood, course, or where in the world you're craving tonight.
          </p>
        </div>

        {/* Moods — now clickable, navigates to search */}
        <section className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            What's the vibe?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {moods.map((m, i) => (
              <button
                key={m.label}
                onClick={() => navigate({ to: "/search" })}
                className={`relative rounded-2xl p-4 text-left bg-gradient-to-br ${m.grad} text-white shadow-warm hover-lift animate-pop overflow-hidden active:scale-95 transition-transform`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="absolute -top-2 -right-2 text-5xl opacity-40">{m.emoji}</span>
                <span className="text-2xl relative">{m.emoji}</span>
                <p className="font-semibold text-sm mt-2 relative">{m.label}</p>
                <p className="text-[10px] mt-0.5 opacity-90 relative">Tap to discover →</p>
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            Browse courses
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c, i) => {
              const sample = recipes.find((r) => r.category === c.slug);
              const count = recipes.filter((r) => r.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="relative aspect-square rounded-3xl overflow-hidden ring-1 ring-border bg-card hover-lift animate-pop glow-card-enhanced"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {sample && (
                    <img src={sample.image} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                    <span className="text-4xl drop-shadow-lg">{c.emoji}</span>
                    <div>
                      <p className="font-display text-2xl leading-tight">{c.label}</p>
                      <p className="text-[10px] mt-0.5 opacity-90 flex items-center gap-1">
                        <TrendingUp className="size-3" /> {count} recipes
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Regions */}
        <section className="mt-7">
          <div className="flex items-end justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              From around the world
            </p>
            <span className="text-[10px] text-muted-foreground">{filteredRegions.length} regions</span>
          </div>

          {/* Region search */}
          <div className="flex items-center gap-3 px-4 h-11 bg-card ring-1 ring-border rounded-2xl focus-within:ring-2 focus-within:ring-primary glow-card-enhanced mb-3">
            <SearchIcon className="size-4 text-primary" />
            <input
              value={regionQ}
              onChange={(e) => setRegionQ(e.target.value)}
              placeholder="Search regions or countries…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {regionQ && (
              <button onClick={() => setRegionQ("")} aria-label="Clear" className="text-muted-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredRegions.map((r, i) => (
              <Link
                key={r.id}
                to="/region/$id"
                params={{ id: r.id }}
                className={`rounded-2xl p-4 bg-gradient-to-br ${r.grad} text-white shadow-warm hover-lift animate-pop relative overflow-hidden`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="absolute -top-3 -right-3 text-5xl opacity-30">{r.emoji}</span>
                <span className="text-3xl drop-shadow relative">{r.emoji}</span>
                <p className="font-semibold text-sm mt-2 leading-tight relative">{r.name}</p>
                <p className="text-[10px] opacity-90 mt-0.5 relative">{r.country}</p>
              </Link>
            ))}
            {filteredRegions.length === 0 && (
              <p className="col-span-2 text-center text-muted-foreground py-8 text-sm">No regions match.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
