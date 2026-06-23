import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { regions, regionDishes } from "@/lib/mock-data";
import { Clock, Flame, Sparkles, Users, MapPin, ChefHat, Check } from "lucide-react";

export const Route = createFileRoute("/region/$id/dish/$dish")({
  head: ({ params }) => ({
    meta: [{ title: `${decodeURIComponent(params.dish)} — Cultivate` }],
  }),
  component: DishDetail,
});

function DishDetail() {
  const { id, dish } = Route.useParams();
  const region = regions.find((r) => r.id === id);
  const name = decodeURIComponent(dish);
  const item = (regionDishes[id] ?? []).find((d) => d.name === name);

  if (!item || !region) {
    return (
      <PhoneFrame>
        <PageHeader title="Dish" />
        <div className="flex-1 grid place-items-center text-muted-foreground">Dish not found.</div>
      </PhoneFrame>
    );
  }

  // Generic recipe fields built from the dish definition
  const ingredients = [
    { name: "Fresh herbs", qty: "1 small bunch" },
    { name: "Quality oil or butter", qty: "2 tbsp" },
    { name: "Sea salt", qty: "to taste" },
    { name: "Main protein or grain", qty: "300g" },
    { name: "Aromatic (garlic, ginger, onion)", qty: "as needed" },
  ];
  const steps = [
    "Read the recipe through once before you start. Pull every ingredient onto the counter.",
    "Heat your pan or pot first — most home cooks under-heat. Wait for the shimmer.",
    `Build flavor in layers, seasoning lightly at each stage. ${item.note}`,
    "Taste before plating and adjust salt or acidity. Trust your tongue.",
    "Rest, plate, and finish with a final flourish — herbs, oil, or zest.",
  ];

  return (
    <PhoneFrame>
      <PageHeader title={region.name} />
      <main className="flex-1 overflow-y-auto no-scrollbar pb-28 bg-gradient-to-b from-tangerine/10 via-surface to-leaf/8">
        {/* Hero */}
        <div className={`mx-5 mt-3 rounded-[28px] p-6 bg-gradient-to-br ${region.grad} text-white relative overflow-hidden shadow-warm animate-scale-in`}>
          <div className="absolute -top-10 -right-6 size-32 rounded-full bg-white/20 blur-2xl animate-blob" />
          <span className="text-7xl drop-shadow-lg block animate-float">{item.emoji}</span>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-3 opacity-90 flex items-center gap-1">
            <MapPin className="size-3" /> {region.name} · {item.category}
          </p>
          <h1 className="font-display text-3xl leading-tight mt-1 text-balance">{item.name}</h1>
          <p className="text-sm mt-2 text-white/90">{item.note}</p>
        </div>

        {/* Meta */}
        <div className="px-5 mt-4 grid grid-cols-4 gap-2">
          <Meta Icon={Clock} label="Time" value={item.time} grad="from-primary to-tangerine" />
          <Meta Icon={Flame} label="Cals" value="~350" grad="from-spice to-berry" />
          <Meta Icon={Sparkles} label="Level" value={item.difficulty} grad="from-saffron to-spice" />
          <Meta Icon={Users} label="Serves" value="4" grad="from-leaf to-ocean" />
        </div>

        {/* Origin */}
        <div className="px-5 mt-5">
          <div className="rounded-3xl p-4 bg-gradient-to-br from-saffron/20 to-tangerine/15 ring-1 ring-tangerine/30">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1">
              <Sparkles className="size-3" /> Origin & story
            </p>
            <p className="text-sm mt-1.5 leading-relaxed">
              A staple of <strong>{region.name}</strong> cuisine. {region.country.split(" · ").join(", ")} — generations of home cooks made this dish their own. Cook it once, then make it yours.
            </p>
          </div>
        </div>

        {/* Ingredients */}
        <section className="px-5 mt-5">
          <h3 className="font-display text-xl">Ingredients</h3>
          <ul className="mt-3 space-y-2">
            {ingredients.map((ing, i) => (
              <li key={ing.name}
                className="flex justify-between items-center bg-card ring-1 ring-border rounded-2xl px-4 py-3 shadow-soft animate-slide-in-right"
                style={{ animationDelay: `${i * 50}ms` }}>
                <span className="text-sm flex items-center gap-3">
                  <span className="size-2 rounded-full bg-gradient-to-br from-primary to-tangerine" />
                  {ing.name}
                </span>
                <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-tangerine/15">{ing.qty}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Method */}
        <section className="px-5 mt-6">
          <h3 className="font-display text-xl">Method</h3>
          <ol className="mt-3 space-y-3">
            {steps.map((s, i) => (
              <li key={i}
                className="flex gap-3 bg-card ring-1 ring-border rounded-2xl p-4 shadow-soft animate-slide-up"
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
        </section>

        <div className="px-5 mt-6">
          <div className="rounded-2xl p-4 bg-card ring-1 ring-border flex items-center gap-3 shadow-soft">
            <div className="size-10 rounded-full bg-gradient-to-br from-primary to-tangerine grid place-items-center text-white">
              <ChefHat className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Cook the dish, save your version</p>
              <p className="font-semibold text-sm">Share with the community →</p>
            </div>
          </div>
        </div>

        <div className="px-5 mt-6">
          <button className="w-full bg-gradient-to-r from-primary via-tangerine to-spice text-white py-4 rounded-2xl font-semibold shadow-warm flex items-center justify-center gap-2 active:scale-[0.98] relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            <Check className="size-4 relative" /> <span className="relative">Start cooking</span>
          </button>
        </div>
      </main>
    </PhoneFrame>
  );
}

function Meta({ Icon, label, value, grad }: { Icon: typeof Clock; label: string; value: string; grad: string }) {
  return (
    <div className={`rounded-2xl p-2.5 bg-gradient-to-br ${grad} text-white text-center shadow-warm`}>
      <Icon className="size-3.5 mx-auto" />
      <p className="text-[8px] uppercase tracking-widest opacity-90 mt-1">{label}</p>
      <p className="text-xs font-bold mt-0.5 leading-tight">{value}</p>
    </div>
  );
}
