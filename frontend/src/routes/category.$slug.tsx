import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { recipes, categories, regions, regionDishes } from "@/lib/mock-data";
import { Clock, Flame, Globe2, Sparkles, TrendingUp, ChefHat } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} recipes — Cultivate` }],
  }),
  component: CategoryPage,
});

const categoryAccent: Record<string, { grad: string; tip: string; tag: string }> = {
  dinner:    { grad: "from-spice via-primary to-tangerine", tip: "Cook a centerpiece. Add a green side. Pour something nice.", tag: "MAIN COURSE" },
  starter:   { grad: "from-leaf via-saffron to-tangerine",  tip: "Three ingredients, beautifully plated. Don't overthink it.", tag: "SMALL PLATES" },
  dessert:   { grad: "from-berry via-grape to-primary",     tip: "Sugar listens to time. Read the recipe twice, then begin.",  tag: "SWEET" },
  breakfast: { grad: "from-saffron via-tangerine to-primary", tip: "The first plate sets the day. Make it count.",            tag: "MORNING" },
};

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  const items = recipes.filter((r) => r.category === slug);
  const accent = categoryAccent[slug] ?? categoryAccent.dinner;

  // Pull regional dishes for this category, grouped by region
  const byRegion = regions
    .map((r) => ({
      region: r,
      dishes: (regionDishes[r.id] ?? []).filter((d) => d.category === slug),
    }))
    .filter((g) => g.dishes.length > 0);

  const totalCount = items.length + byRegion.reduce((n, g) => n + g.dishes.length, 0);

  return (
    <PhoneFrame>
      <PageHeader title={cat?.label ?? "Category"} />
      <main className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-gradient-to-b from-tangerine/10 via-surface to-leaf/8">
        {/* Hero */}
        <div className={`mx-5 mt-3 rounded-[28px] p-6 bg-gradient-to-br ${accent.grad} text-white relative overflow-hidden shadow-warm animate-scale-in`}>
          <div className="absolute -top-10 -right-6 size-40 rounded-full bg-white/20 blur-2xl animate-blob" />
          <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-white/15 blur-2xl animate-blob [animation-delay:2s]" />
          <span className="text-6xl drop-shadow-lg block animate-float">{cat?.emoji}</span>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-3 opacity-90">{accent.tag}</p>
          <h2 className="font-display text-4xl mt-1 leading-tight">{cat?.label}</h2>
          <p className="text-white/90 text-sm mt-2">{totalCount} dishes · {byRegion.length} regions</p>
          <div className="mt-4 grid grid-cols-3 gap-2 relative">
            <Stat n={items.length} label="Curated" />
            <Stat n={byRegion.length} label="Regions" />
            <Stat n={items.filter((i) => i.difficulty === "Easy").length + byRegion.reduce((n, g) => n + g.dishes.filter((d) => d.difficulty === "Easy").length, 0)} label="Easy" />
          </div>
        </div>

        {/* Chef's tip */}
        <div className="px-5 mt-4 animate-slide-up">
          <div className="rounded-2xl p-3 bg-card ring-1 ring-border shadow-soft flex items-start gap-3">
            <div className="size-9 shrink-0 rounded-xl bg-gradient-to-br from-primary to-tangerine grid place-items-center text-white">
              <ChefHat className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Chef's note</p>
              <p className="text-sm leading-snug mt-0.5">{accent.tip}</p>
            </div>
          </div>
        </div>

        {/* Curated recipes */}
        {items.length > 0 && (
          <section className="px-5 mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-xl flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Chef's picks</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{items.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {items.map((r, i) => (
                <Link
                  key={r.id}
                  to="/recipe/$id"
                  params={{ id: r.id }}
                  className="bg-card rounded-3xl overflow-hidden ring-1 ring-border hover-lift animate-pop shadow-soft"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="relative">
                    <img src={r.image} alt={r.title} className="w-full aspect-square object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    {r.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-spice text-white text-[9px] font-bold flex items-center gap-1">
                        <Flame className="size-2.5" /> {r.tag}
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-foreground text-[10px] font-bold flex items-center gap-1">
                      <Clock className="size-2.5" /> {r.time}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">{r.region}</p>
                    <h5 className="font-semibold text-sm leading-tight mt-1 line-clamp-2">{r.title}</h5>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                      <span className="size-5 rounded-full bg-gradient-to-br from-primary to-tangerine grid place-items-center text-white">
                        <ChefHat className="size-2.5" />
                      </span>
                      {r.chef}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regional dishes grouped */}
        {byRegion.length > 0 && (
          <section className="px-5 mt-7">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-xl flex items-center gap-2"><Globe2 className="size-4 text-ocean" /> From around the world</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{byRegion.reduce((n, g) => n + g.dishes.length, 0)} dishes</span>
            </div>

            <div className="space-y-5">
              {byRegion.map((g, gi) => (
                <div key={g.region.id} className="animate-slide-up" style={{ animationDelay: `${gi * 80}ms` }}>
                  <Link to="/region/$id" params={{ id: g.region.id }} className={`rounded-2xl p-3 flex items-center gap-3 bg-gradient-to-r ${g.region.grad} text-white shadow-warm hover-lift`}>
                    <span className="text-2xl">{g.region.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight">{g.region.name}</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-90">{g.region.country}</p>
                    </div>
                    <span className="text-xs font-bold bg-white/25 px-2 py-1 rounded-full">{g.dishes.length}</span>
                  </Link>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {g.dishes.map((d, i) => (
                      <Link
                        key={d.name}
                        to="/region/$id/dish/$dish"
                        params={{ id: g.region.id, dish: encodeURIComponent(d.name) }}
                        className="bg-card rounded-2xl p-3 ring-1 ring-border hover-lift animate-pop shadow-soft"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-3xl">{d.emoji}</span>
                          <span className="text-[9px] font-bold text-primary bg-tangerine/15 px-1.5 py-0.5 rounded-full">{d.country}</span>
                        </div>
                        <h6 className="font-semibold text-sm mt-1.5 leading-tight line-clamp-2">{d.name}</h6>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{d.note}</p>
                        <div className="flex gap-2 text-[10px] text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-0.5"><Clock className="size-2.5" /> {d.time}</span>
                          <span>· {d.difficulty}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {totalCount === 0 && (
          <div className="px-5 py-16 text-center text-muted-foreground">
            <TrendingUp className="size-8 mx-auto opacity-40" />
            <p className="mt-2 text-sm">No dishes yet — check back soon.</p>
          </div>
        )}
      </main>
    </PhoneFrame>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/20 backdrop-blur p-2 text-center ring-1 ring-white/30">
      <p className="font-display text-xl leading-none">{n}</p>
      <p className="text-[9px] uppercase tracking-widest opacity-90 mt-1">{label}</p>
    </div>
  );
}
