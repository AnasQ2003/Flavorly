import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Mail, Lock, User, ChefHat, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useFlavorStore } from "@/lib/flavor-store";
import { redirectIfAuthenticated } from "@/lib/route-guards";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => redirectIfAuthenticated(),
  head: () => ({
    meta: [{ title: "Welcome — Cultivate" }, { name: "description", content: "Sign in or create an account." }],
  }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const loadFromApi = useFlavorStore((s) => s.loadFromApi);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const res = await login(email, password);
      setLoading(false);
      if (res.ok) {
        await loadFromApi();
        navigate({ to: "/home" });
      } else {
        setError(res.error ?? "Login failed.");
      }
    } else {
      const res = await signup(name, email, password);
      setLoading(false);
      if (res.ok) {
        await loadFromApi();
        navigate({ to: "/onboarding" });
      } else {
        setError(res.error ?? "Registration failed.");
      }
    }
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col relative overflow-y-auto no-scrollbar bg-[linear-gradient(135deg,oklch(0.82_0.16_55),oklch(0.76_0.2_45),oklch(0.7_0.22_30),oklch(0.85_0.16_75))] animate-gradient">
        {/* Warm glow blobs (no pink) */}
        <div className="size-80 rounded-full bg-saffron/70 absolute -top-32 -right-24 blur-3xl animate-blob" />
        <div className="size-72 rounded-full bg-spice/60 absolute top-40 -left-32 blur-3xl animate-blob [animation-delay:1.5s]" />
        <div className="size-56 rounded-full bg-tangerine/70 absolute -bottom-16 -right-16 blur-3xl animate-blob [animation-delay:3s]" />
        <div className="size-40 rounded-full bg-leaf/40 absolute bottom-32 -left-10 blur-3xl animate-blob [animation-delay:2s]" />

        {/* Floaty 3D shapes */}
        <div className="size-20 bg-saffron/70 rounded-3xl absolute top-20 right-8 animate-tilt-3d shadow-warm" />
        <div className="size-12 bg-leaf/70 rounded-2xl absolute top-72 left-4 animate-tilt-3d [animation-delay:500ms]" />
        <span className="absolute top-28 left-6 text-3xl animate-float drop-shadow-lg">🥑</span>
        <span className="absolute top-44 right-14 text-2xl animate-float [animation-delay:600ms] drop-shadow-lg">🍅</span>
        <span className="absolute bottom-40 left-10 text-2xl animate-float [animation-delay:300ms] drop-shadow-lg">🌿</span>
        <span className="absolute bottom-24 right-6 text-3xl animate-float [animation-delay:900ms] drop-shadow-lg">🍋</span>
        <span className="absolute top-36 left-16 text-2xl animate-float [animation-delay:1200ms] drop-shadow-lg">🥕</span>
        <span className="absolute top-52 right-8 text-2xl animate-float [animation-delay:1500ms] drop-shadow-lg">🍆</span>
        <span className="absolute bottom-52 left-4 text-2xl animate-float [animation-delay:1800ms] drop-shadow-lg">🥦</span>
        <span className="absolute bottom-36 right-16 text-2xl animate-float [animation-delay:2100ms] drop-shadow-lg">🌶️</span>
        <span className="absolute top-64 left-12 text-xl animate-float [animation-delay:2400ms] drop-shadow-lg">🥬</span>
        <span className="absolute bottom-48 right-10 text-xl animate-float [animation-delay:2700ms] drop-shadow-lg">🧅</span>

        {/* Header — over the gradient */}
        <div className="relative z-10 px-7 pt-12 pb-4">
          <div className="flex items-center justify-center gap-2 animate-slide-in-left">
            <div className="size-12 bg-white/95 backdrop-blur text-primary rounded-2xl grid place-items-center shadow-warm ring-2 ring-white/60 animate-logo-bounce">
              <ChefHat className="size-6" strokeWidth={1.8} />
            </div>
            <span className="font-display text-2xl text-white drop-shadow-md">Cultivate</span>
          </div>

          <div className="mt-6 animate-slide-up">
            <h2 className="font-display text-[34px] leading-tight text-white drop-shadow-md text-balance">
              {mode === "login" ? "Welcome back\nto the table." : "Pull up a chair."}
            </h2>
            <p className="text-white/90 mt-2 text-sm">
              {mode === "login"
                ? "Pick up where you left off in the kitchen."
                : "Join a community of home cooks and chefs."}
            </p>
          </div>
        </div>

        {/* Card with form — sits above the gradient */}
        <div className="relative z-10 mx-5 mt-2 mb-5 rounded-[32px] bg-card/95 backdrop-blur-2xl ring-1 ring-white/60 shadow-[0_30px_70px_-20px_rgba(120,60,20,0.4)] p-6 animate-slide-up [animation-delay:120ms]">
          {/* segmented control */}
          <div className="relative flex p-1 bg-muted rounded-2xl ring-1 ring-border">
            <span
              className={`absolute inset-y-1 w-[calc(50%-4px)] bg-gradient-to-r from-primary to-tangerine rounded-xl shadow-warm transition-transform duration-400 ease-out ${
                mode === "login" ? "translate-x-0" : "translate-x-[calc(100%+4px)]"
              }`}
            />
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-semibold relative z-10 transition-colors ${
                mode === "login" ? "text-white" : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-semibold relative z-10 transition-colors ${
                mode === "signup" ? "text-white" : "text-muted-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-spice/10 border border-spice/20 text-xs text-spice font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          <form
            key={mode}
            onSubmit={handleSubmit}
            className="mt-5 space-y-3.5 animate-slide-in-right"
          >
            {mode === "signup" && (
              <Field
                icon={User}
                label="Full name"
                placeholder="Julian Thorne"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Field
              icon={Mail}
              label="Email address"
              placeholder="you@cultivate.app"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              icon={Lock}
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary font-semibold">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-gradient-to-r from-primary via-tangerine to-spice text-white py-3.5 rounded-2xl font-semibold shadow-warm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all relative overflow-hidden disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
              <span className="relative">
                {loading ? "Please wait..." : mode === "login" ? "Continue" : "Create my account"}
              </span>
              {!loading && <ArrowRight className="size-4 relative" />}
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialBtn emoji="🇬" label="Google" />
              <SocialBtn emoji="" label="Apple" />
            </div>
          </form>

          <p className="mt-5 text-center text-[11px] text-muted-foreground">
            By continuing you agree to our{" "}
            <Link to="/terms" className="text-primary font-semibold underline-offset-2 hover:underline">Terms</Link>{" "}&{" "}
            <Link to="/privacy" className="text-primary font-semibold underline-offset-2 hover:underline">Privacy</Link>.
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: { icon: typeof Mail; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-foreground/70 ml-1 uppercase tracking-wider">{label}</span>
      <div className="mt-1.5 flex items-center gap-3 px-4 h-12 bg-surface ring-1 ring-border rounded-xl focus-within:ring-2 focus-within:ring-primary transition-all">
        <Icon className="size-4 text-primary" />
        <input
          {...rest}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
        />
      </div>
    </label>
  );
}

function SocialBtn({ emoji, label }: { emoji: string; label: string }) {
  return (
    <button
      type="button"
      className="py-2.5 rounded-xl bg-surface ring-1 ring-border text-sm font-semibold text-foreground hover-lift flex items-center justify-center gap-2"
    >
      {emoji && <span className="text-base">{emoji}</span>}
      {label}
    </button>
  );
}
