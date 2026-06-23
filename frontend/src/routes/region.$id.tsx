import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { regions, regionDishes, regionCountries, categories, recipes } from "@/lib/mock-data";
import { Search as SearchIcon, X, Clock, MapPin, Globe2 } from "lucide-react";

export const Route = createFileRoute("/region/$id")({
  head: ({ params }) => {
    const r = regions.find((x) => x.id === params.id);
    return { meta: [{ title: `${r?.name ?? "Region"} cuisine — Cultivate` }] };
  },
  component: RegionPage,
});

const tabs = ["all", ...categories.map((c) => c.slug)] as const;

function RegionPage() {
  const { id } = Route.useParams();
  const region = regions.find((r) => r.id === id);
  const dishes = regionDishes[id] ?? [];
  const countries = regionCountries[id] ?? [];
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [country, setCountry] = useState<string>("all");

  const filtered = dishes
    .filter((d) => tab === "all" || d.category === tab)
    .filter((d) => country === "all" || d.country === country)
    .filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.note.toLowerCase().includes(q.toLowerCase()));

  // Find any real recipe match by region for nicer hero recipes
  const realRecipes = recipes.filter((r) => r.region.toLowerCase().includes((region?.name.split(" ")[0] ?? "").toLowerCase())).slice(0, 4);

  return (
    <PhoneFrame>
      <PageHeader title={region?.name ?? "Region"} />
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-tangerine/10 via-surface to-leaf/8">
        {/* Hero */}
        <div className={`mx-5 mt-3 rounded-[28px] p-5 bg-gradient-to-br ${region?.grad ?? "from-primary to-tangerine"} text-white relative overflow-hidden shadow-warm animate-scale-in`}>
          <div className="absolute -top-8 -right-6 size-32 rounded-full bg-white/20 blur-2xl animate-blob" />
          <div className="flex items-center gap-3 relative">
            <span className="text-5xl drop-shadow-lg animate-float">{region?.emoji}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-90 flex items-center gap-1">
                <MapPin className="size-3" /> Region
              </p>
              <h2 className="font-display text-2xl leading-tight">{region?.name}</h2>
              <p className="text-xs mt-1 text-white/90">{region?.country}</p>
            </div>
          </div>
          <p className="relative mt-3 text-sm text-white/90">{dishes.length} signature dishes across breakfast, starters, dinner & dessert.</p>
        </div>

        {/* Search */}
        <div className="px-5 mt-4 animate-slide-in-right">
          <div className="flex items-center gap-3 px-4 h-12 bg-card ring-1 ring-border rounded-2xl focus-within:ring-2 focus-within:ring-primary shadow-soft transition">
            <SearchIcon className="size-5 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search dishes in ${region?.name ?? "this region"}…`}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-muted-foreground" aria-label="Clear">
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Country drill-down */}
        {countries.length > 0 && (
          <section className="px-5 mt-4 animate-slide-up">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
              <Globe2 className="size-3 text-ocean" /> Choose a country
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCountry("all")}
                className={`rounded-2xl p-2.5 text-center transition-all ${country === "all" ? "bg-gradient-to-br from-primary to-tangerine text-white shadow-warm scale-105" : "bg-card ring-1 ring-border"}`}
              >
                <p className="text-2xl">🌐</p>
                <p className="text-[11px] font-semibold mt-0.5">All</p>
              </button>
              {countries.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setCountry(c.name)}
                  className={`rounded-2xl p-2.5 text-center transition-all animate-pop ${country === c.name ? "bg-gradient-to-br from-spice to-berry text-white shadow-warm scale-105" : "bg-card ring-1 ring-border hover-lift"}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <p className="text-2xl">{c.emoji}</p>
                  <p className="text-[11px] font-semibold mt-0.5 leading-tight">{c.name}</p>
                </button>
              ))}
            </div>
            {country !== "all" && (
              <p className="text-[11px] text-muted-foreground mt-2 px-1">
                {countries.find((c) => c.name === country)?.tagline}
              </p>
            )}
          </section>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-5 mt-4 pb-1">
          <Chip active={tab === "all"} onClick={() => setTab("all")}>✨ All</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={tab === c.slug} onClick={() => setTab(c.slug)}>
              {c.emoji} {c.label}
            </Chip>
          ))}
        </div>

        {/* Featured real recipes */}
        {realRecipes.length > 0 && tab === "all" && !q && (
          <section className="px-5 mt-5 animate-slide-up">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Featured from chefs</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {realRecipes.map((r, i) => (
                <Link key={r.id} to="/recipe/$id" params={{ id: r.id }}
                  className="shrink-0 w-44 rounded-3xl overflow-hidden bg-card ring-1 ring-border hover-lift animate-pop"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="relative h-28">
                    <img src={r.image} alt="" className="size-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-saffron text-foreground text-[10px] font-bold">{r.time}</span>
                  </div>
                  <div className="p-3">
                    <h5 className="font-semibold text-sm leading-tight line-clamp-2">{r.title}</h5>
                    <p className="text-[10px] text-muted-foreground mt-1">by {r.chef}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Dish list grouped by category */}
        <section className="px-5 mt-5 pb-8 space-y-5">
          {tab === "all"
            ? categories.map((c) => {
                const list = filtered.filter((d) => d.category === c.slug);
                if (list.length === 0) return null;
                return (
                  <div key={c.slug} className="animate-slide-up">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-display text-xl flex items-center gap-2">
                        <span>{c.emoji}</span> {c.label}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{list.length} dishes</span>
                    </div>
                    <DishList dishes={list} regionId={id} />
                  </div>
                );
              })
            : <DishList dishes={filtered} regionId={id} />
          }
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">No dishes match — try another filter.</p>
          )}
        </section>
      </main>
    </PhoneFrame>
  );
}

function DishList({ dishes, regionId }: { dishes: typeof regionDishes[string]; regionId: string }) {
  return (
    <div className="space-y-2.5">
      {dishes.map((d, i) => (
        <Link
          key={d.name}
          to="/region/$id/dish/$dish"
          params={{ id: regionId, dish: encodeURIComponent(d.name) }}
          className="flex items-center gap-3 p-3 bg-card rounded-2xl ring-1 ring-border shadow-soft hover-lift animate-pop"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="size-14 shrink-0 rounded-2xl bg-gradient-to-br from-saffron/30 to-tangerine/20 grid place-items-center text-3xl ring-1 ring-tangerine/30">
            {d.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-semibold text-sm leading-tight">{d.name}</h5>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{d.note}</p>
            <div className="flex gap-2 mt-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3" /> {d.time}</span>
              <span>· {d.difficulty}</span>
            </div>
          </div>
          <span className="text-primary text-lg">›</span>
        </Link>
      ))}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-primary to-tangerine text-white shadow-warm scale-105"
          : "bg-card text-foreground ring-1 ring-border"
      }`}
    >
      {children}
    </button>
  );
}
