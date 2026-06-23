import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { Lock, Eye, Settings2, Baby, Mail, Database } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Cultivate" }] }),
  component: Privacy,
});

const sections = [
  { Icon: Database, title: "What we collect", body: "Account email, the recipes you save, and basic device info so the app stays fast.", grad: "from-ocean to-leaf" },
  { Icon: Eye, title: "How we use it", body: "To personalize your home feed, sync favorites across devices, and improve the app. We don't sell your data — not now, not later.", grad: "from-primary to-tangerine" },
  { Icon: Settings2, title: "Your controls", body: "Edit, export, or delete your account at any time from Settings.", grad: "from-saffron to-spice" },
  { Icon: Baby, title: "Children", body: "Cultivate is intended for users 13 years and older.", grad: "from-leaf to-saffron" },
  { Icon: Mail, title: "Contact us", body: "Questions? Reach us at hello@cultivate.app — a real human reads every message.", grad: "from-tangerine to-spice" },
];

const promises = [
  { e: "🚫", t: "No selling" },
  { e: "🔐", t: "Encrypted" },
  { e: "📤", t: "Export anytime" },
  { e: "🗑️", t: "Delete forever" },
];

function Privacy() {
  return (
    <PhoneFrame>
      <PageHeader title="Privacy Policy" />
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-ocean/10 via-surface to-leaf/10">
        <div className="mx-5 mt-4 rounded-[28px] p-6 bg-[linear-gradient(135deg,var(--ocean),var(--leaf),var(--primary))] animate-gradient text-white relative overflow-hidden shadow-warm animate-scale-in">
          <div className="absolute -top-10 -right-6 size-40 rounded-full bg-saffron/40 blur-3xl animate-blob" />
          <div className="absolute -bottom-12 -left-4 size-32 rounded-full bg-tangerine/30 blur-2xl animate-blob [animation-delay:2s]" />
          <Lock className="size-10 relative" />
          <p className="text-[10px] uppercase tracking-[0.3em] mt-3 opacity-90 relative">Last updated · June 2026</p>
          <h2 className="font-display text-3xl mt-1 leading-tight relative">Your data, your kitchen.</h2>
          <p className="text-sm mt-2 text-white/90 relative">What we keep, why we keep it, and how to get it back.</p>
        </div>

        {/* Promise chips */}
        <div className="px-5 mt-4 grid grid-cols-4 gap-2 animate-slide-up">
          {promises.map((p, i) => (
            <div
              key={p.t}
              className="bg-card ring-1 ring-border rounded-2xl py-3 text-center shadow-soft animate-pop"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <p className="text-xl">{p.e}</p>
              <p className="text-[10px] font-semibold mt-1 leading-tight">{p.t}</p>
            </div>
          ))}
        </div>

        <div className="px-5 mt-5 space-y-3 pb-6">
          {sections.map((s, i) => (
            <div
              key={s.title}
              className="relative bg-card rounded-3xl p-4 pl-5 ring-1 ring-border shadow-soft animate-slide-up overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${s.grad}`} />
              <div className="flex items-start gap-3">
                <div className={`size-11 shrink-0 rounded-2xl bg-gradient-to-br ${s.grad} text-white grid place-items-center shadow-warm`}>
                  <s.Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-tight">{s.title}</h3>
                  <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PhoneFrame>
  );
}
