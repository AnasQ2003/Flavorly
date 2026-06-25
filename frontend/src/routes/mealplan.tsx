import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { BottomTabBar } from "@/components/BottomTabBar";
import { recipes } from "@/lib/mock-data";
import { useFlavorStore } from "@/lib/flavor-store";
import { toast } from "sonner";
import { requireAuth } from "@/lib/route-guards";
import {
  Sunrise, Sun, Moon, Flame, Apple, Beef, Wheat, Droplet,
  Sparkles, Plus, ChevronRight, Clock, Users, ChefHat,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/mealplan")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Meal Plan — Cultivate" }] }),
  component: MealPlan,
});

const week = [
  { d: "Mon", n: 10, mood: "🥗" },
  { d: "Tue", n: 11, mood: "🍝" },
  { d: "Wed", n: 12, mood: "🥩" },
  { d: "Thu", n: 13, mood: "🍲" },
  { d: "Fri", n: 14, mood: "🍕" },
  { d: "Sat", n: 15, mood: "🍰" },
  { d: "Sun", n: 16, mood: "🥘" },
];

const slots = [
  { name: "Breakfast", Icon: Sunrise, grad: "from-saffron via-tangerine to-spice", time: "7:30 AM", key: "breakfast" },
  { name: "Lunch", Icon: Sun, grad: "from-leaf via-saffron to-tangerine", time: "12:45 PM", key: "lunch" },
  { name: "Snack", Icon: Apple, grad: "from-berry via-spice to-tangerine", time: "4:15 PM", key: "snack" },
  { name: "Dinner", Icon: Moon, grad: "from-grape via-ocean to-leaf", time: "7:30 PM", key: "dinner" },
] as const;

function MealPlan() {
  const [day, setDay] = useState(2); // Wed by default
  const [pairingOpen, setPairingOpen] = useState(false);

  const mealPlans = useFlavorStore((s) => s.mealPlans);
  const updateMealPlanSlot = useFlavorStore((s) => s.updateMealPlanSlot);

  const getMealPlanId = (dayOffset: number, slotIndex: number): string => {
    if (dayOffset === 2) {
      return ["m1", "m2", "m3", "m4"][slotIndex];
    }
    return `m_${dayOffset}_${slotIndex}`;
  };

  const activeMealPlans = mealPlans.filter((mp) => mp.dateOffset === day);

  const meals = [0, 1, 2, 3].map((slotIndex) => {
    const slotKey = slots[slotIndex].key;
    const mp = activeMealPlans.find((x) => x.slot === slotKey);

    if (mp && mp.recipeId) {
      const recipe = recipes.find((r) => r.id === mp.recipeId);
      if (recipe) {
        return {
          ...recipe,
          id: recipe.id,
          title: mp.title || recipe.title,
          chef: mp.chef || recipe.chef,
          time: mp.time || recipe.time,
          calories: mp.calories || recipe.calories,
          image: mp.image || recipe.image,
          slot: slotIndex,
          servings: mp.servings || 2,
          dbId: mp.id,
        };
      } else if (mp.title) {
        return {
          id: mp.recipeId,
          title: mp.title,
          chef: mp.chef || "Cultivate Kitchen",
          time: mp.time || "5 min",
          calories: mp.calories || 180,
          image: mp.image || recipes[4].image,
          slot: slotIndex,
          servings: mp.servings || 1,
          dbId: mp.id,
        };
      }
    }

    // Ultimate fallback if none
    return {
      id: "empty",
      title: "Tap to plan meal",
      chef: "Unplanned",
      time: "-- min",
      calories: 0,
      image: recipes[4].image,
      slot: slotIndex,
      servings: 0,
      dbId: getMealPlanId(day, slotIndex),
    };
  });

  const totalCal = meals.reduce((s, m) => s + (m.calories ?? 0), 0);

  const handleCycleServings = async (e: React.MouseEvent, meal: typeof meals[number], slotName: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (meal.id === "empty") {
      toast.info("Please plan a recipe first.");
      return;
    }

    const currentServings = meal.servings;
    const nextServings = currentServings === 1 ? 2 : currentServings === 2 ? 4 : currentServings === 4 ? 6 : 1;

    try {
      await updateMealPlanSlot(meal.dbId, { servings: nextServings });
      toast.success(`Updated servings to ${nextServings}`);
    } catch {
      toast.error("Failed to update servings.");
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="Weekly Plan" />
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-32 bg-gradient-to-b from-saffron/10 via-surface to-leaf/10">
        {/* Week strip */}
        <div className="px-5 pt-2">
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-display text-2xl">Week of June</p>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Plan #24
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {week.map((w, i) => {
              const active = i === day;
              return (
                <button
                  key={w.d}
                  onClick={() => setDay(i)}
                  className={`shrink-0 w-16 py-3 rounded-2xl flex flex-col items-center transition-all ring-1 ${
                    active
                      ? "bg-gradient-to-br from-spice via-tangerine to-saffron text-primary-foreground ring-tangerine shadow-warm scale-[1.04]"
                      : "bg-card ring-border text-foreground hover:ring-primary/40 glow-card-enhanced"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest opacity-80">{w.d}</span>
                  <span className="font-display text-xl leading-none mt-1">{w.n}</span>
                  <span className="text-base mt-1.5 leading-none">{w.mood}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily summary */}
        <div className="px-5 pt-4 animate-slide-up">
          <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-grape via-berry to-spice text-primary-foreground shadow-warm">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-card/10 blur-2xl" />
            <p className="text-[10px] uppercase tracking-widest opacity-80">Today's nutrition</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="font-display text-4xl">{totalCal}</span>
              <span className="text-xs opacity-85 mb-1.5">kcal · balanced</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-[10px]">
              {[
                { Icon: Beef, label: "Protein", v: `${Math.round(totalCal / 15)}g` },
                { Icon: Wheat, label: "Carbs", v: `${Math.round(totalCal / 8)}g` },
                { Icon: Droplet, label: "Fat", v: `${Math.round(totalCal / 25)}g` },
                { Icon: Flame, label: "Fiber", v: `${Math.round(totalCal / 50)}g` },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-card/15 backdrop-blur-md ring-1 ring-card/20 p-2 text-center">
                  <m.Icon className="size-3.5 mx-auto opacity-90" />
                  <p className="font-display text-sm mt-1 leading-none">{m.v}</p>
                  <p className="opacity-75 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-card/20 overflow-hidden">
                <div className="h-full w-3/4 bg-card/80 rounded-full" />
              </div>
              <span className="text-[10px] opacity-85">75% of goal</span>
            </div>
          </div>
        </div>

        {/* Meals */}
        <div className="px-5 pt-5 space-y-4">
          {slots.map((slot, i) => {
            const r = meals[i];
            const isPlanned = r.id !== "empty";

            return (
              <div
                key={slot.name}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={`size-7 rounded-lg grid place-items-center bg-gradient-to-br ${slot.grad} text-primary-foreground shadow-soft`}>
                    <slot.Icon className="size-3.5" strokeWidth={2.4} />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground">
                    {slot.name}
                  </p>
                  <span className="text-[10px] text-muted-foreground">· {slot.time}</span>
                  <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>

                {isPlanned ? (
                  <Link
                    to={r.id === "snack-yogurt" ? "/mealplan" : "/recipe/$id"}
                    params={r.id === "snack-yogurt" ? {} : { id: r.id }}
                    className="block relative overflow-hidden rounded-3xl bg-card ring-1 ring-border hover-lift glow-card-enhanced"
                  >
                    <div className="flex gap-3 items-stretch p-3">
                      <div className="relative shrink-0">
                        <img src={r.image} alt="" className="size-20 rounded-2xl object-cover" loading="lazy" />
                        <span className={`absolute -top-1 -left-1 size-6 rounded-full bg-gradient-to-br ${slot.grad} grid place-items-center text-primary-foreground shadow-warm`}>
                          <slot.Icon className="size-3" strokeWidth={2.6} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h5 className="font-display text-base leading-tight line-clamp-1">{r.title}</h5>
                          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <ChefHat className="size-3" /> {r.chef}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Chip Icon={Clock} label={r.time} />
                          <Chip Icon={Flame} label={`${r.calories} cal`} />
                          <button
                            onClick={(e) => handleCycleServings(e, r, slot.name)}
                            className="inline-flex items-center hover:scale-105 active:scale-95 transition"
                            title="Cycle servings (1x -> 2x -> 4x -> 6x)"
                          >
                            <Chip Icon={Users} label={`x${r.servings}`} />
                          </button>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground self-center shrink-0" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/search"
                    className="block p-5 text-center bg-card ring-1 ring-border rounded-3xl text-muted-foreground hover:text-primary hover:border-primary border border-dashed transition glow-card-enhanced"
                  >
                    <Plus className="size-4 mx-auto mb-1" />
                    <span className="text-xs font-semibold">Plan {slot.name}</span>
                  </Link>
                )}
              </div>
            );
          })}

          <button 
            onClick={() => setPairingOpen(true)}
            className="w-full p-4 rounded-3xl border-2 border-dashed border-border bg-card/50 text-muted-foreground font-medium flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition animate-slide-up glow-card-enhanced cursor-pointer"
          >
            <Plus className="size-4" />
            Add dessert or drink pairing
          </button>

          <div className="rounded-3xl bg-gradient-to-br from-leaf/15 via-saffron/15 to-tangerine/15 ring-1 ring-leaf/30 p-5 animate-slide-up">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-leaf" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-leaf">Chef's tip</p>
            </div>
            <p className="font-display text-lg mt-1 leading-snug">
              Prep tomorrow's chimichurri tonight.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Resting the parsley-garlic blend overnight deepens flavor by 40%.
            </p>
          </div>
        </div>
      </main>
      <BottomTabBar />

      <Dialog open={pairingOpen} onOpenChange={setPairingOpen}>
        <DialogContent className="max-w-[340px] rounded-[32px] p-6 bg-card/95 backdrop-blur-xl border border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center text-foreground">Add Pairing</DialogTitle>
            <DialogDescription className="text-xs text-center mt-1 text-muted-foreground">
              Select a chef-recommended dessert or drink pairing for today.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {[
              {
                id: "lava-cake",
                title: "Molten Chocolate Lava Cake",
                calories: 480,
                time: "30 min",
                chef: "Anika Sharma",
                emoji: "🍰",
                image: "/src/assets/recipe-dessert.jpg",
              },
              {
                id: "crema-catalana",
                title: "Crema Catalana",
                calories: 280,
                time: "40 min",
                chef: "Elena Rossi",
                emoji: "🍮",
                image: "/src/assets/recipe-dessert.jpg",
              },
              {
                id: "tiramisu",
                title: "Classic Tiramisu",
                calories: 320,
                time: "30 min",
                chef: "Marco Bellini",
                emoji: "☕",
                image: "/src/assets/recipe-dessert.jpg",
              },
              {
                id: "red-wine",
                title: "Cabernet Sauvignon",
                calories: 120,
                time: "5 min",
                chef: "Sommelier Choice",
                emoji: "🍷",
                image: "/src/assets/recipe-dessert.jpg",
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={async () => {
                  setPairingOpen(false);
                  const snackSlotId = getMealPlanId(day, 2); // 2 is snack slot
                  try {
                    await updateMealPlanSlot(snackSlotId, {
                      recipeId: p.id,
                      title: p.title,
                      chef: p.chef,
                      time: p.time,
                      calories: p.calories,
                      image: p.image,
                      servings: 1,
                    });
                    toast.success(`Successfully planned ${p.title}!`);
                  } catch {
                    toast.error("Failed to add pairing.");
                  }
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-card border border-border hover:border-primary hover:bg-primary/5 active:scale-[0.98] transition flex items-center gap-3 glow-card-enhanced cursor-pointer"
              >
                <span className="text-3xl shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight text-foreground truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {p.time} · {p.calories} cal · by {p.chef}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PhoneFrame>
  );
}

function Chip({ Icon, label }: { Icon: typeof Clock; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground/80 bg-muted/60 px-2 py-1 rounded-full">
      <Icon className="size-3" /> {label}
    </span>
  );
}
