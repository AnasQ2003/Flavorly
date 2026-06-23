import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { recipes, blogs, categories, regions, cookingTips } from "@/lib/mock-data";
import { Flame, Clock, Sparkles, ChevronLeft, ChevronRight, TrendingUp, Award } from "lucide-react";
import { useFlavorStore } from "@/lib/flavor-store";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — Cultivate" }] }),
  component: Home,
});

function Home() {
  const slides = recipes.slice(0, 4);
  const trending = recipes.slice(1, 5);
  const quickPicks = recipes.filter((r) => parseInt(r.time) <= 30).slice(0, 4);
  const [active, setActive] = useState(0);

  const userName = useFlavorStore((s) => s.profile.name);
  const loadFromApi = useFlavorStore((s) => s.loadFromApi);

  useEffect(() => {
    loadFromApi();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (d: number) =>
    setActive((i) => (i + d + slides.length) % slides.length);

  return (
    <AppShell>
      <div className="px-5 pt-3 space-y-6 bg-gradient-to-b from-tangerine/10 via-surface to-leaf/8 min-h-full">
        {/* Greeting card */}
        <section className="animate-slide-up rounded-3xl p-5 bg-gradient-to-br from-primary via-tangerine to-spice text-white relative overflow-hidden shadow-warm">
          <div className="absolute -top-8 -right-6 size-32 rounded-full bg-saffron/40 blur-2xl animate-blob" />
          <div className="absolute -bottom-10 -left-4 size-28 rounded-full bg-leaf/30 blur-2xl animate-blob [animation-delay:2s]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-saffron flex items-center gap-1.5 relative">
            <Sparkles className="size-3" /> Today's pick
          </p>
          <h2 className="font-display text-2xl leading-tight mt-1 text-white relative text-balance font-semibold">
            What are you cooking tonight, {userName.split(' ')[0]}?
          </h2>
          <div className="flex gap-2 mt-3 relative">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-semibold">🔥 7-day streak</span>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-semibold">⏱ ~30 min</span>
          </div>
        </section>

        {/* Category pills */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 animate-slide-in-right">
          <button className="shrink-0 px-4 py-2 bg-gradient-to-br from-primary to-tangerine text-primary-foreground rounded-full text-sm font-semibold shadow-warm flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> All
          </button>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="shrink-0 px-4 py-2 bg-card text-foreground rounded-full text-sm font-medium ring-1 ring-border hover-lift flex items-center gap-1.5"
            >
              <span>{c.emoji}</span>
              {c.label}
            </Link>
          ))}
        </div>

        {/* SLIDESHOW — smaller aspect */}
        <section className="animate-scale-in">
          <div className="relative rounded-[24px] overflow-hidden ring-1 ring-border shadow-soft aspect-[16/11]">
            {slides.map((r, i) => (
              <Link
                key={r.id}
                to="/recipe/$id"
                params={{ id: r.id }}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  i === active ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
                }`}
              >
                <img src={r.image} alt={r.title} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
                {r.tag && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-spice/95 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur animate-pop">
                    <Flame className="size-3" /> {r.tag}
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-saffron mb-1">{r.region}</p>
                  <h3 className="font-display text-xl leading-tight text-balance">{r.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {r.time}</span>
                    <span className="flex items-center gap-1"><Sparkles className="size-3" /> {r.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}

            <button onClick={(e) => { e.preventDefault(); go(-1); }} aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 grid place-items-center rounded-full bg-card/85 backdrop-blur text-foreground ring-1 ring-border active:scale-90 transition">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={(e) => { e.preventDefault(); go(1); }} aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 grid place-items-center rounded-full bg-card/85 backdrop-blur text-foreground ring-1 ring-border active:scale-90 transition">
              <ChevronRight className="size-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`}
                  className={`h-1 rounded-full transition-all ${i === active ? "w-5 bg-saffron" : "w-1 bg-white/60"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Quick stats banner */}
        <section className="grid grid-cols-3 gap-2 animate-slide-up">
          {[
            { Icon: TrendingUp, val: "42", label: "Recipes", grad: "from-primary to-tangerine" },
            { Icon: Flame, val: "7", label: "Day streak", grad: "from-spice to-berry" },
            { Icon: Award, val: "12", label: "Cooked", grad: "from-leaf to-ocean" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-3 bg-gradient-to-br ${s.grad} text-white shadow-warm`}>
              <s.Icon className="size-4" />
              <p className="font-display text-xl leading-none mt-1.5">{s.val}</p>
              <p className="text-[9px] uppercase tracking-widest opacity-90 mt-0.5">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Regions chips */}
        <section className="animate-slide-up">
          <div className="flex justify-between items-end mb-3">
            <h4 className="font-display text-xl">Cook by region</h4>
            <Link to="/categories" className="text-xs text-primary font-semibold">All →</Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {regions.map((r, i) => (
              <Link key={r.id} to="/region/$id" params={{ id: r.id }}
                className={`shrink-0 w-28 rounded-2xl p-3 bg-gradient-to-br ${r.grad} text-white shadow-warm hover-lift animate-pop`}
                style={{ animationDelay: `${i * 50}ms` }}>
                <span className="text-2xl drop-shadow">{r.emoji}</span>
                <p className="font-semibold text-xs mt-2 leading-tight">{r.name}</p>
                <p className="text-[9px] opacity-90 mt-0.5">Explore →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending grid */}
        <section className="animate-slide-up">
          <div className="flex justify-between items-end mb-3">
            <h4 className="font-display text-xl">Trending now</h4>
            <Link to="/categories" className="text-xs text-primary font-semibold">See all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trending.map((r, i) => (
              <Link key={r.id} to="/recipe/$id" params={{ id: r.id }}
                className="bg-card rounded-3xl overflow-hidden ring-1 ring-border hover-lift animate-pop"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative">
                  <img src={r.image} alt={r.title} className="w-full aspect-square object-cover" loading="lazy" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-card/95 backdrop-blur text-[10px] font-bold text-primary">{r.time}</span>
                </div>
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{r.region}</p>
                  <h5 className="font-semibold text-sm leading-tight mt-1 line-clamp-2">{r.title}</h5>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick picks (under 30 min) */}
        <section className="animate-slide-up">
          <div className="flex justify-between items-end mb-3">
            <h4 className="font-display text-xl">Under 30 minutes</h4>
            <Link to="/search" className="text-xs text-primary font-semibold">Filter →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {quickPicks.map((r, i) => (
              <Link key={r.id} to="/recipe/$id" params={{ id: r.id }}
                className="shrink-0 w-44 rounded-3xl overflow-hidden bg-card ring-1 ring-border hover-lift animate-pop"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="relative h-28">
                  <img src={r.image} alt="" className="size-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-saffron text-foreground text-[10px] font-bold">⚡ {r.time}</span>
                </div>
                <div className="p-3">
                  <h5 className="font-semibold text-sm leading-tight line-clamp-2">{r.title}</h5>
                  <p className="text-[10px] text-muted-foreground mt-1">by {r.chef}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="animate-slide-up">
          <div className="flex justify-between items-end mb-3">
            <h4 className="font-display text-xl">Tips for tonight</h4>
            <span className="text-xs text-muted-foreground">From the chefs</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {cookingTips.map((t, i) => (
              <div key={t.title} className="rounded-2xl p-3 bg-card ring-1 ring-border shadow-soft animate-pop" style={{ animationDelay: `${i * 60}ms` }}>
                <p className="text-2xl">{t.icon}</p>
                <p className="font-semibold text-sm mt-1.5">{t.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section className="animate-slide-up pb-4">
          <div className="flex justify-between items-end mb-3">
            <h4 className="font-display text-xl">Kitchen stories</h4>
            <span className="text-xs text-primary font-semibold">View all →</span>
          </div>
          <div className="space-y-3">
            {blogs.map((b) => (
              <Link key={b.id} to="/blog/$id" params={{ id: b.id }}
                className="flex gap-3 items-center bg-card p-3 rounded-2xl ring-1 ring-border hover-lift">
                <img src={b.image} alt="" className="size-20 rounded-xl object-cover shrink-0" loading="lazy" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{b.category}</p>
                  <h5 className="font-semibold text-sm leading-tight mt-1 line-clamp-2">{b.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{b.readTime} • {b.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
