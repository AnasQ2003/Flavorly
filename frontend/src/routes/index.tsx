import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChefHat } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cultivate — Honest food, daily" },
      { name: "description", content: "Animated food app for recipes, regional cuisine and chef stories." },
    ],
  }),
  component: Splash,
});

const FLOATERS = [
  { e: "🍅", top: "8%", left: "10%", d: "0ms" },
  { e: "🥑", top: "16%", right: "10%", d: "200ms" },
  { e: "🌶️", top: "32%", left: "5%", d: "400ms" },
  { e: "🍋", top: "28%", right: "8%", d: "600ms" },
  { e: "🥐", bottom: "30%", left: "8%", d: "300ms" },
  { e: "🍇", bottom: "22%", right: "12%", d: "500ms" },
  { e: "🧄", bottom: "12%", left: "22%", d: "700ms" },
  { e: "🥕", bottom: "10%", right: "24%", d: "100ms" },
];

const ORBIT = ["🍓", "🌿", "🧀", "🥬"];
const LOADING_PHASES = ["Warming the pan…", "Chopping herbs…", "Plating up…", "Ready to taste."];

function Splash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phaseTimer = setInterval(
      () => setPhase((p) => Math.min(p + 1, LOADING_PHASES.length - 1)),
      750,
    );
    const t = setTimeout(() => {
      const auth = useAuthStore.getState().isAuthenticated;
      navigate({ to: auth ? "/home" : "/auth" });
    }, 3000);
    return () => {
      clearInterval(phaseTimer);
      clearTimeout(t);
    };
  }, [navigate]);

  return (
    <PhoneFrame>
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center text-primary-foreground bg-[linear-gradient(140deg,var(--primary),var(--tangerine),var(--spice),var(--saffron))] animate-gradient">
        {/* Glow blobs */}
        <div className="size-80 rounded-full bg-saffron/50 absolute -top-24 -right-16 blur-3xl animate-blob" />
        <div className="size-96 rounded-full bg-spice/40 absolute -bottom-32 -left-24 blur-3xl animate-blob [animation-delay:2s]" />
        <div className="size-48 rounded-full bg-leaf/35 absolute top-1/2 -left-10 blur-2xl animate-blob [animation-delay:4s]" />

        {/* Floating emojis */}
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            className="absolute text-3xl drop-shadow-lg animate-float"
            style={{
              top: f.top,
              left: f.left,
              right: f.right,
              bottom: f.bottom,
              animationDelay: f.d,
            }}
          >
            {f.e}
          </span>
        ))}

        {/* Geometric 3D-feel cards */}
        <div className="size-24 bg-saffron/40 backdrop-blur-md rounded-3xl absolute top-28 left-8 animate-tilt-3d shadow-2xl [animation-delay:300ms]" />
        <div className="size-16 bg-leaf/60 backdrop-blur-md rounded-2xl absolute bottom-44 right-10 animate-tilt-3d shadow-xl [animation-delay:500ms]" />

        {/* Center logo */}
        <div className="relative z-10 flex flex-col items-center" style={{ perspective: "1000px" }}>
          <div className="relative size-52 grid place-items-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/40 animate-spin-slow" />
            <div className="absolute inset-3 rounded-full border border-white/30 animate-spin-slow [animation-direction:reverse] [animation-duration:20s]" />
            <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-sm animate-pulse-ring" />

            {ORBIT.map((e, i) => (
              <span
                key={i}
                className="absolute text-2xl drop-shadow-lg animate-orbit"
                style={{ animationDelay: `${i * -2}s` }}
              >
                {e}
              </span>
            ))}

            {/* Logo card with bounce + 3d */}
            <div className="relative animate-logo-bounce">
              <span className="absolute -inset-2 rounded-[32px] bg-saffron/40 blur-xl" />
              <div className="relative size-28 bg-card text-primary rounded-[28px] ring-2 ring-white/60 grid place-items-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
                <ChefHat className="size-14 relative animate-wiggle" strokeWidth={1.6} />
              </div>
            </div>
          </div>

          <h1 className="font-display text-6xl tracking-tight mt-6 animate-slide-up [animation-delay:200ms] drop-shadow-lg">
            Cultivate
          </h1>
          <div className="mt-2 h-0.5 w-16 bg-white/80 rounded-full animate-slide-up [animation-delay:350ms]" />
          <p className="mt-3 text-white/90 text-base animate-slide-up [animation-delay:400ms] tracking-wide">
            Honest food, daily.
          </p>

          {/* Loading bar */}
          <div className="mt-10 w-56 animate-slide-up [animation-delay:600ms]">
            <div className="relative h-2 rounded-full bg-white/20 ring-1 ring-white/30 overflow-hidden backdrop-blur">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-saffron via-white to-saffron animate-progress-fill shadow-[0_0_18px_rgba(255,255,255,0.7)]" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shine" />
            </div>
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.3em] text-white/90 transition-all">
              {LOADING_PHASES[phase]}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] text-white/70 animate-fade-in [animation-delay:1s]">
          — A chef's kitchen, in your pocket —
        </div>
      </div>
    </PhoneFrame>
  );
}
