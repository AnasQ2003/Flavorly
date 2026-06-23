import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useRouter } from "@tanstack/react-router";
import { recipes } from "@/lib/mock-data";
import { ChevronLeft, Heart, Share2, Clock, Flame, Sparkles, Check, Users, Star, BookmarkPlus, ChefHat, Utensils, Wine, MessageCircle, ThumbsUp, MapPin, Award, Leaf, Zap } from "lucide-react";
import { useState } from "react";
import { useFlavorStore } from "@/lib/flavor-store";
import { toast } from "sonner";

function getAisleForIngredient(name: string): "Produce" | "Protein" | "Dairy" | "Pantry" | "Bakery" | "Wine" {
  const n = name.toLowerCase();
  if (n.includes("tomato") || n.includes("basil") || n.includes("lemon") || n.includes("parsley") || n.includes("garlic") || n.includes("leek") || n.includes("potato") || n.includes("berry") || n.includes("fruit") || n.includes("avocado") || n.includes("lime") || n.includes("salad") || n.includes("cucumber")) return "Produce";
  if (n.includes("wagyu") || n.includes("steak") || n.includes("salmon") || n.includes("chicken") || n.includes("beef") || n.includes("lamb") || n.includes("pork") || n.includes("fish") || n.includes("cod") || n.includes("shrimp") || n.includes("seafood") || n.includes("bacon") || n.includes("venison") || n.includes("egg")) return "Protein";
  if (n.includes("burrata") || n.includes("parmesan") || n.includes("cheese") || n.includes("cream") || n.includes("milk") || n.includes("yogurt") || n.includes("butter") || n.includes("skyr") || n.includes("mascarpone")) return "Dairy";
  if (n.includes("sourdough") || n.includes("bread") || n.includes("croissant") || n.includes("bun") || n.includes("pastry") || n.includes("crust")) return "Bakery";
  if (n.includes("wine") || n.includes("malbec") || n.includes("beer") || n.includes("cider") || n.includes("sherry")) return "Wine";
  return "Pantry";
}


export const Route = createFileRoute("/recipe/$id")({
  head: ({ params }) => {
    const r = recipes.find((x) => x.id === params.id);
    return {
      meta: [
        { title: r ? `${r.title} — Cultivate` : "Recipe — Cultivate" },
        { name: "description", content: r?.description ?? "Recipe detail" },
        ...(r ? [{ property: "og:image", content: r.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const recipe = recipes.find((r) => r.id === params.id);
    if (!recipe) throw notFound();
    return recipe;
  },
  notFoundComponent: () => (
    <PhoneFrame>
      <div className="flex-1 grid place-items-center p-8 text-center">
        <p className="text-muted-foreground">Recipe not found.</p>
      </div>
    </PhoneFrame>
  ),
  component: RecipeDetail,
});

const tabs = ["Overview", "Ingredients", "Method"] as const;

function RecipeDetail() {
  const r = Route.useLoaderData() as (typeof recipes)[number];
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const favorites = useFlavorStore((s) => s.favorites);
  const toggleFavorite = useFlavorStore((s) => s.toggleFavorite);
  const addShoppingItem = useFlavorStore((s) => s.addShoppingItem);
  const saved = favorites.includes(r.id);


  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top bar */}
        <div className="absolute top-12 left-5 right-5 z-30 flex justify-between animate-slide-in-left">
          <button
            onClick={() => router.history.back()}
            className="size-11 bg-white/25 backdrop-blur-lg rounded-full grid place-items-center ring-1 ring-white/40 text-white active:scale-90 transition"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            <button className="size-11 bg-white/25 backdrop-blur-lg rounded-full grid place-items-center ring-1 ring-white/40 text-white active:scale-90 transition">
              <Share2 className="size-4" />
            </button>
            <button
              onClick={() => toggleFavorite(r.id)}
              className={`size-11 backdrop-blur-lg rounded-full grid place-items-center ring-1 ring-white/40 active:scale-90 transition ${saved ? "bg-spice text-white" : "bg-white/25 text-white"}`}
            >
              <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="h-[42%] relative">
          <img src={r.image} alt={r.title} className="size-full object-cover" width={800} height={1000} />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-surface" />
          {r.tag && (
            <div className="absolute bottom-16 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-spice/95 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur shadow-warm animate-pop">
              <Flame className="size-3" /> {r.tag}
            </div>
          )}
        </div>

        {/* Content sheet */}
        <div className="flex-1 -mt-10 bg-surface rounded-t-[36px] relative px-6 pt-5 pb-32 overflow-y-auto no-scrollbar animate-slide-up">
          <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4" />

          {/* Title block */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.22em]">
                {r.region} · {r.category}
              </p>
              <h1 className="font-display text-[28px] mt-1 leading-tight text-balance">{r.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="size-7 rounded-full bg-gradient-to-br from-primary to-tangerine grid place-items-center text-white">
                  <ChefHat className="size-3.5" />
                </div>
                <p className="text-xs text-muted-foreground">by <span className="font-semibold text-foreground">{r.chef}</span></p>
                <div className="ml-auto flex items-center gap-0.5 text-saffron">
                  <Star className="size-3.5 fill-current" />
                  <span className="text-xs font-bold text-foreground">4.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta cards */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            <Meta Icon={Clock} label="Time" value={r.time} grad="from-primary to-tangerine" />
            <Meta Icon={Flame} label="Cals" value={`${r.calories}`} grad="from-spice to-berry" />
            <Meta Icon={Sparkles} label="Level" value={r.difficulty} grad="from-saffron to-spice" />
            <Meta Icon={Users} label="Serves" value="4" grad="from-leaf to-ocean" />
          </div>

          {/* Tabs */}
          <div className="mt-6 relative flex p-1 bg-muted rounded-2xl ring-1 ring-border">
            <span
              className="absolute inset-y-1 w-[calc(33.333%-3px)] bg-gradient-to-r from-primary to-tangerine rounded-xl shadow-warm transition-transform duration-300 ease-out"
              style={{ transform: `translateX(calc(${tabs.indexOf(tab)} * (100% + 4px)))` }}
            />
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-semibold relative z-10 transition-colors ${tab === t ? "text-white" : "text-muted-foreground"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-5 animate-fade-in" key={tab}>
            {tab === "Overview" && (
              <>
                <p className="text-foreground/85 text-pretty leading-relaxed">{r.description}</p>

                {/* Chef's note */}
                <div className="mt-5 rounded-3xl p-4 bg-gradient-to-br from-saffron/20 to-tangerine/15 ring-1 ring-tangerine/30">
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1">
                    <Sparkles className="size-3" /> Chef's note
                  </p>
                  <p className="text-sm mt-1.5 leading-relaxed">Cook with confidence — small batch, real ingredients, and a glass of something nice on the side. Read once, then begin.</p>
                </div>

                {/* Prep / Cook split */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl bg-card ring-1 ring-border p-3 shadow-soft">
                    <p className="text-2xl">🥘</p>
                    <p className="text-xs font-semibold mt-1">Prep</p>
                    <p className="text-[10px] text-muted-foreground">{parseInt(r.time) > 30 ? "20 min" : "10 min"}</p>
                  </div>
                  <div className="rounded-2xl bg-card ring-1 ring-border p-3 shadow-soft">
                    <p className="text-2xl">🔥</p>
                    <p className="text-xs font-semibold mt-1">Cook</p>
                    <p className="text-[10px] text-muted-foreground">{r.time}</p>
                  </div>
                </div>

                {/* Origin & story */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><MapPin className="size-4 text-spice" /> Origin & story</p>
                  <div className="mt-2 rounded-3xl p-4 bg-gradient-to-br from-ocean/10 to-leaf/10 ring-1 ring-ocean/20">
                    <p className="text-sm leading-relaxed">
                      A {r.region} classic — born in home kitchens long before restaurant menus. Generations of cooks
                      have refined this dish into the version you'll make today. Respect the ingredients, trust your
                      heat, and the rest follows.
                    </p>
                  </div>
                </section>

                {/* Nutrition */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><Zap className="size-4 text-saffron" /> Nutrition · per serving</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <Nutri label="Calories" value={`${r.calories}`} grad="from-spice to-berry" />
                    <Nutri label="Protein" value={`${Math.round(r.calories / 18)}g`} grad="from-leaf to-ocean" />
                    <Nutri label="Carbs" value={`${Math.round(r.calories / 9)}g`} grad="from-saffron to-tangerine" />
                    <Nutri label="Fat" value={`${Math.round(r.calories / 28)}g`} grad="from-primary to-tangerine" />
                  </div>
                </section>

                {/* Equipment */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><Utensils className="size-4 text-ocean" /> What you'll need</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Cast iron", "Sharp knife", "Wooden spoon", "Mixing bowl", "Tongs"].map((e, i) => (
                      <span key={e} className="px-3 py-1.5 rounded-full bg-card ring-1 ring-border text-xs font-medium animate-pop" style={{ animationDelay: `${i * 40}ms` }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Tips */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><Award className="size-4 text-primary" /> Pro tips</p>
                  <ul className="mt-2 space-y-2">
                    {[
                      { i: "🧂", t: "Season at every stage — depth comes from layers, not one big pinch." },
                      { i: "🌡", t: "Bring proteins to room temp 15 minutes before cooking for an even crust." },
                      { i: "👃", t: "Trust your nose. When the aromatics smell ready, they are." },
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3 bg-card ring-1 ring-border rounded-2xl p-3 shadow-soft animate-slide-in-right" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="text-2xl">{tip.i}</span>
                        <p className="text-xs leading-snug self-center">{tip.t}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Pairings */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><Wine className="size-4 text-berry" /> Pairs nicely with</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { e: "🍷", l: "Red wine" },
                      { e: "🥖", l: "Crusty bread" },
                      { e: "🥗", l: "Green salad" },
                    ].map((p, i) => (
                      <div key={p.l} className="rounded-2xl p-3 bg-gradient-to-br from-berry/15 to-grape/10 ring-1 ring-berry/20 text-center animate-pop" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="text-2xl">{p.e}</span>
                        <p className="text-[11px] font-semibold mt-1">{p.l}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Reviews */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><MessageCircle className="size-4 text-leaf" /> What cooks are saying</p>
                  <div className="mt-2 space-y-2">
                    {[
                      { n: "Sara K.", t: "Made it for date night — looked fancier than it was. Easy win.", r: 5 },
                      { n: "Tom R.",  t: "The chef's note about resting changed everything. Try it.", r: 5 },
                      { n: "Priya M.", t: "Took a bit longer than 35 min but worth every minute.", r: 4 },
                    ].map((rev, i) => (
                      <div key={i} className="bg-card ring-1 ring-border rounded-2xl p-3 shadow-soft animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-gradient-to-br from-saffron to-tangerine grid place-items-center text-white text-[10px] font-bold">
                            {rev.n[0]}
                          </div>
                          <p className="text-xs font-semibold">{rev.n}</p>
                          <div className="ml-auto flex text-saffron">
                            {Array.from({ length: rev.r }).map((_, k) => <Star key={k} className="size-3 fill-current" />)}
                          </div>
                        </div>
                        <p className="text-xs mt-1.5 leading-snug text-foreground/85">{rev.t}</p>
                        <button className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          <ThumbsUp className="size-3" /> Helpful
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Similar recipes */}
                <section className="mt-6">
                  <p className="font-display text-lg flex items-center gap-2"><Leaf className="size-4 text-leaf" /> You might also love</p>
                  <div className="mt-2 flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
                    {recipes.filter((x) => x.id !== r.id).slice(0, 5).map((s, i) => (
                      <Link key={s.id} to="/recipe/$id" params={{ id: s.id }}
                        className="shrink-0 w-40 rounded-2xl overflow-hidden bg-card ring-1 ring-border hover-lift animate-pop shadow-soft"
                        style={{ animationDelay: `${i * 50}ms` }}>
                        <img src={s.image} alt="" className="w-full h-24 object-cover" loading="lazy" />
                        <div className="p-2.5">
                          <p className="text-[9px] uppercase tracking-widest text-primary font-bold">{s.region}</p>
                          <p className="text-xs font-semibold line-clamp-2 mt-0.5 leading-tight">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">⏱ {s.time}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}

            {tab === "Ingredients" && (
              <ul className="space-y-2">
                {r.ingredients.map((ing, i) => (
                  <li key={ing.name}
                    className="flex justify-between items-center bg-card ring-1 ring-border rounded-2xl px-4 py-3 animate-slide-in-right shadow-soft"
                    style={{ animationDelay: `${i * 50}ms` }}>
                    <span className="text-sm flex items-center gap-3">
                      <span className="size-2 rounded-full bg-gradient-to-br from-primary to-tangerine" />
                      {ing.name}
                    </span>
                    <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-tangerine/15">{ing.qty}</span>
                  </li>
                ))}
                <button
                  onClick={async () => {
                    try {
                      for (const ing of r.ingredients) {
                        await addShoppingItem({
                          name: ing.name,
                          qty: ing.qty,
                          price: 2.5, // sensible mock price
                          aisle: getAisleForIngredient(ing.name),
                          note: `For ${r.title}`
                        });
                      }
                      toast.success(`Added ${r.ingredients.length} items to shopping list!`);
                    } catch (err) {
                      toast.error("Failed to add ingredients.");
                    }
                  }}
                  className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-leaf/15 to-ocean/15 ring-1 ring-leaf/30 text-leaf font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <BookmarkPlus className="size-4" /> Add all to shopping list
                </button>
              </ul>
            )}

            {tab === "Method" && (
              <ol className="space-y-3">
                {r.steps.map((s, i) => (
                  <li key={i}
                    className="flex gap-3 bg-card ring-1 ring-border rounded-2xl p-4 animate-slide-up shadow-soft"
                    style={{ animationDelay: `${i * 70}ms` }}>
                    <span className="size-9 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-tangerine text-white grid place-items-center text-sm font-bold shadow-warm">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Step {i + 1}</p>
                      <p className="text-sm leading-relaxed mt-0.5">{s}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Floating CTA */}
        <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-surface via-surface/95 to-transparent">
          <button className="w-full bg-gradient-to-r from-primary via-tangerine to-spice text-white py-4 rounded-2xl font-semibold shadow-warm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            <Check className="size-4 relative" /> <span className="relative">Start cooking</span>
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Meta({ Icon, label, value, grad }: { Icon: typeof Clock; label: string; value: string; grad: string }) {
  return (
    <div className={`rounded-2xl p-2.5 bg-gradient-to-br ${grad} text-white text-center shadow-warm animate-pop`}>
      <Icon className="size-3.5 mx-auto" />
      <p className="text-[8px] uppercase tracking-widest opacity-90 mt-1">{label}</p>
      <p className="text-xs font-bold mt-0.5 leading-tight">{value}</p>
    </div>
  );
}

function Nutri({ label, value, grad }: { label: string; value: string; grad: string }) {
  return (
    <div className={`rounded-2xl p-2.5 bg-gradient-to-br ${grad} text-white text-center shadow-warm animate-pop`}>
      <p className="font-display text-lg leading-none">{value}</p>
      <p className="text-[9px] uppercase tracking-widest opacity-90 mt-1">{label}</p>
    </div>
  );
}
