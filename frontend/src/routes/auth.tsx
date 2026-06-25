import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Mail, Lock, User, ChefHat, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [flashyMessage, setFlashyMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });

  useEffect(() => {
    if (localStorage.getItem("rememberMe") === "true") {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const loadFromApi = useFlavorStore((s) => s.loadFromApi);

  const funnyMessages = [
    "🍔 Hangry? Try remembering with a snack!",
    "🧠 Brain fog? Maybe check your cookie jar!",
    "🥱 Too tired? Passwords are like recipes - write them down!",
    "🤯 Memory leak? Have you tried turning it off and on again?",
    "🍕 Pizza password? No? Try thinking with your stomach!",
    "🥗 Salad days? Your password might be in the crisper drawer!",
    "🍩 Donut worry, be happy! Or just create a new account!",
    "🌮 Taco 'bout a memory problem! Maybe it's password123?",
  ];

  const showFlashyMessage = (message: string) => {
    setFlashyMessage(message);
    setTimeout(() => setFlashyMessage(null), 3000);
  };

  const handleForgotPassword = () => {
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    showFlashyMessage(randomMessage);
  };

  const handleSocialLogin = (provider: string) => {
    showFlashyMessage(`🚀 ${provider} login is cooking in the kitchen! Coming soon!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const res = await login(email, password);
      setLoading(false);
      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
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
        <span className="absolute bottom-56 left-10 text-2xl animate-float [animation-delay:300ms] drop-shadow-lg">🌿</span>
        <span className="absolute bottom-48 right-6 text-3xl animate-float [animation-delay:900ms] drop-shadow-lg">🍋</span>
        <span className="absolute top-36 left-16 text-2xl animate-float [animation-delay:1200ms] drop-shadow-lg">🥕</span>
        <span className="absolute top-52 right-8 text-2xl animate-float [animation-delay:1500ms] drop-shadow-lg">🍆</span>
        <span className="absolute bottom-64 left-4 text-2xl animate-float [animation-delay:1800ms] drop-shadow-lg">🥦</span>
        <span className="absolute bottom-60 right-16 text-2xl animate-float [animation-delay:2100ms] drop-shadow-lg">🌶️</span>
        <span className="absolute top-64 left-12 text-xl animate-float [animation-delay:2400ms] drop-shadow-lg">🥬</span>
        <span className="absolute bottom-72 right-10 text-xl animate-float [animation-delay:2700ms] drop-shadow-lg">🧅</span>
        <span className="absolute top-72 right-20 text-xl animate-float [animation-delay:3000ms] drop-shadow-lg">🥒</span>
        <span className="absolute bottom-80 left-16 text-xl animate-float [animation-delay:3300ms] drop-shadow-lg">🫑</span>

        {/* Header — over the gradient */}
        <div className="relative z-10 px-7 pt-12 pb-4">
          <div className="flex items-center justify-center gap-2 animate-slide-in-left">
            <div className="size-12 bg-white/95 backdrop-blur text-primary rounded-2xl grid place-items-center shadow-warm ring-2 ring-white/60 animate-logo-bounce">
              <ChefHat className="size-6" strokeWidth={1.8} />
            </div>
            <span className="font-display text-4xl text-white drop-shadow-md">Cultivate</span>
          </div>

          <div className="mt-6 animate-slide-up text-center">
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

        {/* Flashy message card - toast notification at bottom */}
        {flashyMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-white/95 backdrop-blur-xl ring-2 ring-tangerine/50 shadow-[0_15px_40px_-10px_rgba(255,150,50,0.5)] animate-slide-up max-w-[calc(100%-2.5rem)]">
            <p className="text-sm text-tangerine font-semibold text-center animate-pulse">
              {flashyMessage}
            </p>
          </div>
        )}

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
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox 
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <span className="text-xs font-medium text-foreground/75">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs text-primary font-semibold hover:underline"
                >
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
              <SocialBtn icon="google" label="Google" onClick={() => handleSocialLogin("Google")} />
              <SocialBtn icon="apple" label="Apple" onClick={() => handleSocialLogin("Apple")} />
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

function SocialBtn({ icon, label, onClick }: { icon: "google" | "apple"; label: string; onClick?: () => void }) {
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.08-3.11-1.05.05-2.31.71-3.06 1.61-.69.82-1.26 2.02-1.11 3.12 1.17.09 2.36-.65 3.09-1.62"/>
    </svg>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="py-2.5 rounded-xl bg-surface ring-1 ring-border text-sm font-semibold text-foreground hover-lift flex items-center justify-center gap-2"
    >
      {icon === "google" ? <GoogleIcon /> : <AppleIcon />}
      {label}
    </button>
  );
}
