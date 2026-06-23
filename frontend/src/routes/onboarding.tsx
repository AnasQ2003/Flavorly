import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { regions, mealTypes } from "@/lib/mock-data";
import { ArrowRight, Check, Flame, Leaf, Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Personalize — Cultivate" }] }),
  component: Onboarding,
});

const skillLevels = [
  { id: "beginner", label: "Beginner", emoji: "🌱", desc: "Walk me through every step.", Icon: Leaf, grad: "from-leaf to-saffron" },
  { id: "home", label: "Home Cook", emoji: "🍳", desc: "I cook a few times a week.", Icon: Flame, grad: "from-saffron via-tangerine to-spice" },
  { id: "pro", label: "Pro", emoji: "🔥", desc: "Bring on the technique.", Icon: Sparkles, grad: "from-spice via-berry to-grape" },
];

const diets = [
  { id: "omni", label: "Everything", emoji: "🍽️" },
  { id: "veg", label: "Vegetarian", emoji: "🥗" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "pesc", label: "Pescatarian", emoji: "🐟" },
  { id: "gf", label: "Gluten-free", emoji: "🌾" },
  { id: "keto", label: "Keto", emoji: "🥑" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [skill, setSkill] = useState<string>("home");
  const [regs, setRegs] = useState<string[]>(["med"]);
  const [meals, setMeals] = useState<string[]>(["Starters"]);
  const [diet, setDiet] = useState<string[]>(["omni"]);

  const toggle = <T,>(arr: T[], set: (v: T[]) => void, v: T, single = false) => {
    if (single) return set([v]);
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const total = 3;
  const canNext =
    (step === 0 && skill) ||
    (step === 1 && regs.length > 0) ||
    (step === 2 && meals.length > 0 && diet.length > 0);

  const next = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else navigate({ to: "/home" });
  };
  const back = () => (step > 0 ? setStep((s) => s - 1) : navigate({ to: "/auth" }));

  return (
    <PhoneFrame>
      <div className="flex-1 min-h-0 flex flex-col bg-gradient-to-br from-saffron/20 via-surface to-grape/15 animate-fade-in relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-tangerine/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-16 size-44 rounded-full bg-leaf/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-0 size-56 rounded-full bg-grape/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 pt-10 pb-2 animate-slide-in-left">
          <div className="flex items-center gap-3">
            <button
              onClick={back}
              className="size-10 rounded-full bg-card ring-1 ring-border grid place-items-center shadow-soft active:scale-95 transition"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.22em]">
                Step {step + 1} of {total}
              </p>
              <div className="mt-1.5 flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i <= step
                        ? "bg-gradient-to-r from-spice via-tangerine to-saffron shadow-warm"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <h2 className="font-display text-4xl mt-5 text-balance leading-tight">
            {step === 0 && "How comfy are you in the kitchen?"}
            {step === 1 && "What flavors call your name?"}
            {step === 2 && "Last thing — what do you cook?"}
          </h2>
          <p className="text-muted-foreground mt-2 text-pretty text-sm">
            {step === 0 && "We'll match recipe difficulty and explanation depth to you."}
            {step === 1 && "Pick one or more regions — we'll spotlight them on your feed."}
            {step === 2 && "Favorites & dietary style. You can change any of this later."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 py-5 space-y-7 relative">
          {step === 0 && (
            <div className="space-y-3 animate-slide-up">
              {skillLevels.map((s, i) => {
                const active = skill === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSkill(s.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-3xl ring-1 text-left transition-all animate-pop ${
                      active
                        ? "bg-card ring-foreground shadow-warm scale-[1.01]"
                        : "bg-card/70 ring-border hover:ring-primary/40"
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className={`size-14 rounded-2xl grid place-items-center bg-gradient-to-br ${s.grad} text-primary-foreground shadow-warm text-2xl`}>
                      {s.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xl leading-tight">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                    <span
                      className={`size-7 rounded-full grid place-items-center transition-all ${
                        active
                          ? "bg-gradient-to-br from-spice to-tangerine text-primary-foreground scale-100"
                          : "bg-muted text-transparent scale-90"
                      }`}
                    >
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <section>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.22em]">
                Regional cuisines · multi-select
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {regions.map((r, i) => {
                  const active = regs.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggle(regs, setRegs, r.id)}
                      className={`relative aspect-square rounded-3xl p-4 flex flex-col justify-between text-left transition-all duration-300 animate-pop ring-1 overflow-hidden ${
                        active
                          ? `bg-gradient-to-br ${r.grad} text-primary-foreground ring-transparent shadow-warm scale-[1.03]`
                          : "bg-card ring-border hover:ring-primary/40"
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {active && (
                        <span className="absolute -right-6 -top-6 size-20 rounded-full bg-card/20 blur-2xl" />
                      )}
                      <span className="text-4xl drop-shadow-sm">{r.emoji}</span>
                      <div className="relative">
                        <p className="font-display text-lg leading-tight">{r.name}</p>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${active ? "opacity-90" : "text-muted-foreground"}`}>
                          {r.country}
                        </p>
                      </div>
                      {active && (
                        <span className="absolute top-3 right-3 size-7 bg-card text-foreground rounded-full grid place-items-center animate-scale-in shadow-soft">
                          <Check className="size-4" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <>
              <section>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.22em]">
                  Favorite meals
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {mealTypes.map((m, i) => {
                    const active = meals.includes(m);
                    return (
                      <button
                        key={m}
                        onClick={() => toggle(meals, setMeals, m)}
                        className={`py-2.5 px-5 rounded-full text-sm font-semibold transition-all duration-200 ring-1 animate-pop ${
                          active
                            ? "bg-gradient-to-r from-spice via-tangerine to-saffron text-primary-foreground ring-transparent shadow-warm scale-[1.03]"
                            : "bg-card text-foreground ring-border hover:ring-primary/40"
                        }`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.22em]">
                  Dietary style
                </p>
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {diets.map((d, i) => {
                    const active = diet.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        onClick={() => toggle(diet, setDiet, d.id)}
                        className={`p-3 rounded-2xl ring-1 text-center transition-all animate-pop ${
                          active
                            ? "bg-leaf/15 ring-leaf text-foreground scale-[1.03] shadow-soft"
                            : "bg-card ring-border hover:ring-primary/40"
                        }`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <span className="text-2xl block">{d.emoji}</span>
                        <span className="text-[11px] font-semibold mt-1 block">{d.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="relative p-6 bg-surface/85 backdrop-blur-md border-t border-border">
          <button
            onClick={next}
            disabled={!canNext}
            className="w-full bg-gradient-to-r from-spice via-tangerine to-saffron text-primary-foreground py-4 rounded-2xl font-semibold shadow-warm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step < total - 1 ? "Continue" : "Cook with these preferences"}
            <ArrowRight className="size-4" />
          </button>
          {step < total - 1 && (
            <button
              onClick={() => navigate({ to: "/home" })}
              className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground transition py-2"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
