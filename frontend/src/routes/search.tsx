import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { recipes, categories, regions, regionDishes } from "@/lib/mock-data";
import { Search as SearchIcon, X, SlidersHorizontal, Clock, Flame, Leaf, ChefHat, Globe2, MapPin } from "lucide-react";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/search")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Search — Cultivate" }] }),
  component: Search,
});

const popular = ["Pasta", "Risotto", "Vegan", "Quick", "Bruschetta", "Sourdough"];

type Helper = { emoji: string; label: string; grad: string; predicate: "easy" | "fast" | "onepan" | "pantry" };
const beginnerHelpers: Helper[] = [
  { emoji: "👶", label: "Beginner-safe", grad: "from-leaf to-ocean", predicate: "easy" },
  { emoji: "⏱", label: "15 min or less", grad: "from-saffron to-tangerine", predicate: "fast" },
  { emoji: "🥘", label: "One pan", grad: "from-tangerine to-spice", predicate: "onepan" },
  { emoji: "🛒", label: "Pantry only", grad: "from-primary to-tangerine", predicate: "pantry" },
];

const difficulties = [
  { value: "Any", emoji: "✨" },
  { value: "Easy", emoji: "🟢" },
  { value: "Intermediate", emoji: "🟡" },
] as const;
const times = [
  { value: "Any", emoji: "✨" },
  { value: "< 20 min", emoji: "⚡" },
  { value: "< 40 min", emoji: "⏱" },
] as const;
const diets = ["Any", "Vegetarian", "Vegan", "Seafood"] as const;

function parseMin(s: string) {
  if (s.includes("hr")) return 60 * parseInt(s);
  return parseInt(s) || 0;
}

function Search() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [diff, setDiff] = useState<(typeof difficulties)[number]["value"]>("Any");
  const [time, setTime] = useState<(typeof times)[number]["value"]>("Any");
  const [diet, setDiet] = useState<(typeof diets)[number]>("Any");
  const [region, setRegion] = useState<string>("all");
  const [helper, setHelper] = useState<Helper["predicate"] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRegions, setShowRegions] = useState(false);

  // Real recipes
  const recipeResults = recipes
    .filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()) || r.region.toLowerCase().includes(q.toLowerCase()) || r.chef.toLowerCase().includes(q.toLowerCase()))
    .filter((r) => cat === "all" || r.category === cat)
    .filter((r) => diff === "Any" || r.difficulty === diff)
    .filter((r) => region === "all" || regions.find((rg) => rg.id === region)?.name === r.region)
    .filter((r) => {
      if (time === "Any") return true;
      const m = parseMin(r.time);
      return time === "< 20 min" ? m < 20 : m < 40;
    })
    .filter((r) => !helper || (helper === "easy" ? r.difficulty === "Easy" : helper === "fast" ? parseMin(r.time) <= 15 : true));

  // Regional dishes — also searchable
  const dishResults = Object.entries(regionDishes).flatMap(([rid, list]) =>
    list.map((d) => ({ ...d, regionId: rid, regionName: regions.find((r) => r.id === rid)?.name ?? "" })),
  )
    .filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.note.toLowerCase().includes(q.toLowerCase()) || d.regionName.toLowerCase().includes(q.toLowerCase()) || (d.country?.toLowerCase().includes(q.toLowerCase()) ?? false))
    .filter((d) => cat === "all" || d.category === cat)
    .filter((d) => region === "all" || d.regionId === region)
    .filter((d) => diff === "Any" || d.difficulty === diff)
    .filter((d) => {
      if (time === "Any") return true;
      const m = parseMin(d.time);
      return time === "< 20 min" ? m < 20 : m < 40;
    })
    .filter((d) => !helper || (helper === "easy" ? d.difficulty === "Easy" : helper === "fast" ? parseMin(d.time) <= 15 : true))
    .slice(0, 12);

  const totalResults = recipeResults.length + dishResults.length;
  const activeFilters = [diff !== "Any" && diff, time !== "Any" && time, diet !== "Any" && diet, region !== "all" && "Region", helper && "Quick filter"].filter(Boolean) as string[];

  const activeRegion = regions.find((r) => r.id === region);

  return (
    <AppShell>
      <div className="px-5 pt-2 bg-gradient-to-b from-ocean/8 via-surface to-leaf/8 min-h-full">
        <h2 className="font-display text-3xl animate-slide-up">Discover</h2>
        <p className="text-sm text-muted-foreground mt-1">What are you craving?</p>

        <div className="mt-4 flex items-center gap-2 animate-slide-in-right">
          <div className="flex-1 flex items-center gap-3 px-4 h-12 bg-card ring-1 ring-border rounded-2xl focus-within:ring-2 focus-within:ring-primary glow-card-enhanced transition">
            <SearchIcon className="size-5 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Recipes, regions, dishes…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-muted-foreground" aria-label="Clear">
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative size-12 grid place-items-center rounded-2xl shadow-warm transition active:scale-90 ${
              showFilters || activeFilters.length > 0
                ? "bg-gradient-to-br from-primary to-tangerine text-white"
                : "bg-card ring-1 ring-border text-foreground"
            }`}
            aria-label="Filters"
          >
            <SlidersHorizontal className="size-5" />
            {activeFilters.length > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-saffron text-foreground text-[10px] font-bold grid place-items-center ring-2 ring-surface">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Region quick picker — separate option */}
        <button
          onClick={() => setShowRegions((v) => !v)}
          className={`mt-3 w-full flex items-center gap-3 px-4 h-12 rounded-2xl transition active:scale-[0.98] animate-slide-in-right ${activeRegion ? "bg-gradient-to-r from-spice to-berry text-white" : "bg-card ring-1 ring-border text-foreground glow-card-enhanced"}`}
        >
          <Globe2 className="size-5" />
          <span className="text-sm font-semibold flex-1 text-left">
            {activeRegion ? `Region · ${activeRegion.name}` : "Browse by region"}
          </span>
          {activeRegion && (
            <span onClick={(e) => { e.stopPropagation(); setRegion("all"); }} className="size-7 grid place-items-center rounded-full bg-white/25">
              <X className="size-3.5" />
            </span>
          )}
          <span className="text-lg">{showRegions ? "▴" : "▾"}</span>
        </button>

        {showRegions && (
          <div className="mt-3 grid grid-cols-3 gap-2 animate-slide-up">
            {regions.map((r, i) => (
              <button
                key={r.id}
                onClick={() => { setRegion(r.id); setShowRegions(false); }}
                className={`rounded-2xl p-3 text-left bg-gradient-to-br ${r.grad} text-white shadow-warm hover-lift animate-pop overflow-hidden`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-2xl block">{r.emoji}</span>
                <p className="font-semibold text-[11px] mt-1 leading-tight">{r.name}</p>
              </button>
            ))}
            <Link
              to="/categories"
              className="rounded-2xl p-3 bg-card ring-1 ring-border grid place-items-center text-center hover-lift glow-card-enhanced"
            >
              <MapPin className="size-4 text-primary" />
              <p className="text-[10px] font-semibold mt-1">See all</p>
            </Link>
          </div>
        )}

        {/* Beginner helpers */}
        {!q && !showFilters && (
          <section className="mt-5 animate-fade-in">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
              <ChefHat className="size-3 text-leaf" /> New to cooking? Start here
            </p>
            <div className="grid grid-cols-2 gap-2">
              {beginnerHelpers.map((b, i) => (
                <button
                  key={b.label}
                  onClick={() => setHelper(helper === b.predicate ? null : b.predicate)}
                  className={`relative rounded-2xl p-3 text-left bg-gradient-to-br ${b.grad} text-white shadow-warm hover-lift animate-pop overflow-hidden active:scale-95 transition ${helper === b.predicate ? "ring-2 ring-foreground" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="absolute -top-2 -right-2 text-4xl opacity-30">{b.emoji}</span>
                  <span className="text-2xl relative">{b.emoji}</span>
                  <p className="font-semibold text-xs mt-1.5 relative leading-tight">{b.label}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {showFilters && (
          <div className="mt-3 p-4 rounded-3xl bg-card ring-1 ring-border space-y-4 animate-slide-up glow-card-enhanced">
            <FilterRow label="Difficulty" Icon={ChefHat}>
              {difficulties.map((d) => (
                <Chip key={d.value} active={diff === d.value} onClick={() => setDiff(d.value)}>
                  <span>{d.emoji}</span> {d.value}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Cook time" Icon={Clock}>
              {times.map((t) => (
                <Chip key={t.value} active={time === t.value} onClick={() => setTime(t.value)}>
                  <span>{t.emoji}</span> {t.value}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Diet" Icon={Leaf}>
              {diets.map((d) => (
                <Chip key={d} active={diet === d} onClick={() => setDiet(d)}>
                  {d}
                </Chip>
              ))}
            </FilterRow>
            {activeFilters.length > 0 && (
              <button
                onClick={() => { setDiff("Any"); setTime("Any"); setDiet("Any"); setRegion("all"); setHelper(null); }}
                className="w-full py-2.5 rounded-xl bg-muted text-sm font-semibold text-foreground"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mt-5 pb-1">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>✨ All</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
              {c.emoji} {c.label}
            </Chip>
          ))}
        </div>

        {!q && cat === "all" && activeFilters.length === 0 && (
          <section className="mt-6 animate-fade-in">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1">
              <Flame className="size-3 text-spice" /> Popular now
            </p>
            <div className="flex flex-wrap gap-2">
              {popular.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setQ(p)}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-saffron/30 to-tangerine/20 text-foreground text-sm font-medium ring-1 ring-tangerine/30 hover-lift animate-pop"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 pb-4">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            {q || cat !== "all" || activeFilters.length > 0 ? `${totalResults} results` : "Suggested for you"}
          </p>

          {recipeResults.length > 0 && (
            <div className="space-y-3 mb-5">
              {recipeResults.map((r, i) => (
                <Link
                  key={r.id}
                  to="/recipe/$id"
                  params={{ id: r.id }}
                  className="flex gap-3 items-center bg-card p-2.5 rounded-2xl ring-1 ring-border hover-lift animate-slide-up glow-card-enhanced"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <img src={r.image} alt="" className="size-20 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{r.region}</p>
                    <h5 className="font-semibold text-sm mt-1 line-clamp-1">{r.title}</h5>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>⏱ {r.time}</span>
                      <span>· {r.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {dishResults.length > 0 && (
            <>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
                <Globe2 className="size-3 text-ocean" /> Regional dishes
              </p>
              <div className="space-y-2.5">
                {dishResults.map((d, i) => (
                  <Link
                    key={`${d.regionId}-${d.name}`}
                    to="/region/$id/dish/$dish"
                    params={{ id: d.regionId, dish: encodeURIComponent(d.name) }}
                    className="flex items-center gap-3 p-2.5 bg-card rounded-2xl ring-1 ring-border hover-lift animate-slide-up glow-card-enhanced"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="size-14 shrink-0 rounded-xl bg-gradient-to-br from-saffron/30 to-tangerine/20 grid place-items-center text-3xl ring-1 ring-tangerine/30">
                      {d.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{d.regionName} · {d.country}</p>
                      <h5 className="font-semibold text-sm mt-0.5 line-clamp-1">{d.name}</h5>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{d.note}</p>
                    </div>
                    <span className="text-primary text-lg">›</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {totalResults === 0 && (
            <p className="text-center text-muted-foreground py-12 text-sm">Nothing matched. Try a different filter.</p>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function FilterRow({ label, Icon, children }: { label: string; Icon?: typeof Clock; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="size-3" />} {label}
      </p>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-primary to-tangerine text-white shadow-warm scale-105"
          : "bg-card text-foreground ring-1 ring-border"
      }`}
    >
      {children}
    </button>
  );
}
