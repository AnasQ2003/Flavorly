import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useAuthStore } from "@/lib/auth-store";
import { requireAuth } from "@/lib/route-guards";

import {
  Bell, Moon, Globe, Lock, HelpCircle, ChevronRight, Sparkles,
  Volume2, ShieldCheck, CreditCard, Download, Trash2, LogOut,
  Utensils, Flame, Heart, MessageSquare, Crown,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Settings — Cultivate" }] }),
  component: Settings,
});

const COMING_SOON = (label: string) =>
  toast.info(`${label} is on the way`, {
    description: "Our team is polishing this feature — it will land in an upcoming release.",
  });

function Settings() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [push, setPush] = useState(true);
  const [sound, setSound] = useState(true);
  const [dark, setDark] = useState(false);
  const [weekly, setWeekly] = useState(true);
  const [comments, setComments] = useState(false);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [skill, setSkill] = useState<"Beginner" | "Home Cook" | "Pro">("Home Cook");

  // Initialise from prior session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedDark = window.localStorage.getItem("cultivate-dark") === "1";
    setDark(savedDark);
    document.documentElement.classList.toggle("dark", savedDark);
    const savedAccent = window.localStorage.getItem("cultivate-accent");
    if (savedAccent) document.documentElement.setAttribute("data-accent", savedAccent);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("cultivate-dark", dark ? "1" : "0");
  }, [dark]);

  return (
    <PhoneFrame>
      <PageHeader title="Settings" />
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-32 bg-gradient-to-b from-saffron/10 via-surface to-grape/10">
        {/* Premium banner */}
        <div className="px-5 pt-2">
          <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-grape via-berry to-spice text-primary-foreground shadow-warm animate-slide-up">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-card/15 blur-2xl" />
            <div className="absolute -right-4 -bottom-6 size-24 rounded-full bg-card/10 blur-xl" />
            <div className="relative flex items-center gap-3">
              <span className="size-14 rounded-2xl bg-gradient-to-br from-saffron to-tangerine grid place-items-center shadow-warm">
                <Crown className="size-6 text-foreground" strokeWidth={2.2} />
              </span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest opacity-80">Cultivate</p>
                <p className="font-display text-xl leading-tight">You're on Premium</p>
                <p className="text-xs opacity-85 mt-0.5">Unlimited recipes · Renews Jul 12</p>
              </div>
              <ChevronRight className="size-4 opacity-80" />
            </div>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Cooking preferences */}
          <Group title="Cooking preferences" Icon={Utensils} grad="from-leaf via-saffron to-tangerine">
            <SegmentRow
              Icon={Flame}
              label="Skill level"
              options={["Beginner", "Home Cook", "Pro"] as const}
              value={skill}
              onChange={setSkill}
            />
            <SegmentRow
              Icon={Globe}
              label="Units"
              options={["metric", "imperial"] as const}
              value={units}
              onChange={setUnits}
              renderLabel={(o) => (o === "metric" ? "Metric" : "Imperial")}
            />
            <Row Icon={Heart} label="Dietary preferences" value="Vegetarian-friendly" onClick={() => COMING_SOON("Dietary preferences editor")} />
          </Group>

          {/* Notifications */}
          <Group title="Notifications" Icon={Bell} grad="from-spice via-tangerine to-saffron">
            <Toggle Icon={Bell} label="Push notifications" value={push} onChange={setPush} />
            <Toggle Icon={Volume2} label="Sound & haptics" value={sound} onChange={setSound} />
            <Toggle Icon={Sparkles} label="Weekly meal plan recap" value={weekly} onChange={setWeekly} />
            <Toggle Icon={MessageSquare} label="Comment replies" value={comments} onChange={setComments} />
          </Group>

          {/* Appearance */}
          <Group title="Appearance" Icon={Moon} grad="from-grape via-ocean to-leaf">
            <Toggle Icon={Moon} label="Dark mode" value={dark} onChange={setDark} />
            <Row Icon={Globe} label="Language" value="English" onClick={() => COMING_SOON("Language selection")} />
            <ThemePicker />
          </Group>

          {/* Account */}
          <Group title="Account & privacy" Icon={ShieldCheck} grad="from-ocean via-grape to-berry">
            <Row Icon={Lock} label="Change password" onClick={() => COMING_SOON("Password management")} />
            <Row Icon={ShieldCheck} label="Two-factor authentication" value="On" onClick={() => COMING_SOON("Two-factor authentication")} />
            <Row Icon={CreditCard} label="Subscription & billing" onClick={() => COMING_SOON("Subscription & billing")} />
            <Row Icon={Download} label="Export your data" onClick={() => COMING_SOON("Data export")} />
          </Group>

          {/* Help */}
          <Group title="Help" Icon={HelpCircle} grad="from-saffron via-tangerine to-spice">
            <Row Icon={HelpCircle} label="Help & support" onClick={() => COMING_SOON("Help center")} />
            <LinkRow Icon={ShieldCheck} label="Privacy policy" to="/privacy" />
            <LinkRow Icon={ShieldCheck} label="Terms of service" to="/terms" />
          </Group>

          {/* Danger */}
          <div className="space-y-2">
            <button
              onClick={() => { logout(); toast.success("Signed out", { description: "You have been signed out of this device." }); navigate({ to: "/auth" }); }}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-card ring-1 ring-border text-foreground font-medium hover:ring-primary/40 transition"
            >
              <LogOut className="size-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm">Sign out</span>
            </button>
            <button
              onClick={() => COMING_SOON("Account deletion")}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-spice/10 ring-1 ring-spice/30 text-spice font-medium hover:bg-spice/15 transition"
            >
              <Trash2 className="size-4" />
              <span className="flex-1 text-left text-sm">Delete account</span>
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground pt-2 pb-4 uppercase tracking-widest">
            Cultivate v1.0 · made with ♥ in 2026
          </p>
        </div>
      </main>
      <BottomTabBar />
    </PhoneFrame>
  );
}

function Group({
  title, Icon, grad, children,
}: { title: string; Icon: typeof Bell; grad: string; children: React.ReactNode }) {
  return (
    <section className="animate-slide-up">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className={`size-7 rounded-lg grid place-items-center bg-gradient-to-br ${grad} text-primary-foreground shadow-soft`}>
          <Icon className="size-3.5" strokeWidth={2.4} />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground">{title}</p>
        <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="bg-card ring-1 ring-border rounded-3xl divide-y divide-border overflow-hidden shadow-soft">
        {children}
      </div>
    </section>
  );
}

function Row({ Icon, label, value, onClick }: { Icon: typeof Bell; label: string; value?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors active:scale-[0.99]">
      <span className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
        <Icon className="size-4" />
      </span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function LinkRow({ Icon, label, to }: { Icon: typeof Bell; label: string; to: string }) {
  return (
    <Link to={to} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors">
      <span className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
        <Icon className="size-4" />
      </span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function Toggle({
  Icon, label, value, onChange,
}: { Icon: typeof Bell; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
        <Icon className="size-4" />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full p-0.5 transition-colors ${
          value ? "bg-gradient-to-r from-spice to-tangerine shadow-warm" : "bg-muted"
        }`}
      >
        <span
          className={`block size-6 rounded-full bg-card shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SegmentRow<T extends string>({
  Icon, label, options, value, onChange, renderLabel,
}: {
  Icon: typeof Bell;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel?: (o: T) => string;
}) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <Icon className="size-4" />
        </span>
        <span className="flex-1 text-sm font-medium">{label}</span>
      </div>
      <div className="flex gap-1 bg-muted/60 p-1 rounded-2xl">
        {options.map((o) => {
          const on = o === value;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`flex-1 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                on
                  ? "bg-card text-foreground shadow-soft ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {renderLabel ? renderLabel(o) : o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ACCENT_THEMES = [
  { id: "warm",   label: "Warm",   grad: "from-spice via-tangerine to-saffron", primary: "0.62 0.18 35",  ring: "0.62 0.18 35" },
  { id: "forest", label: "Forest", grad: "from-leaf via-ocean to-grape",        primary: "0.55 0.14 155", ring: "0.55 0.14 155" },
  { id: "berry",  label: "Berry",  grad: "from-grape via-berry to-spice",       primary: "0.5 0.2 340",   ring: "0.5 0.2 340" },
  { id: "noir",   label: "Noir",   grad: "from-foreground via-grape to-ocean",  primary: "0.28 0.04 260", ring: "0.28 0.04 260" },
];

function ThemePicker() {
  const [active, setActive] = useState("warm");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("cultivate-accent") || "warm";
    setActive(saved);
  }, []);

  const apply = (id: string) => {
    setActive(id);
    const t = ACCENT_THEMES.find((x) => x.id === id);
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", `oklch(${t.primary})`);
    root.style.setProperty("--ring", `oklch(${t.ring})`);
    root.setAttribute("data-accent", id);
    window.localStorage.setItem("cultivate-accent", id);
    toast.success(`${t.label} accent applied`);
  };

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <Sparkles className="size-4" />
        </span>
        <span className="flex-1 text-sm font-medium">Accent theme</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ACCENT_THEMES.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => apply(t.id)}
              className={`aspect-square rounded-2xl bg-gradient-to-br ${t.grad} ring-2 transition-all ${
                on ? "ring-foreground scale-105 shadow-warm" : "ring-transparent hover:scale-105"
              } relative overflow-hidden`}
            >
              <span className="absolute bottom-1 inset-x-0 text-[9px] font-semibold text-primary-foreground/90 uppercase tracking-widest">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
