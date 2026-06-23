import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { ScrollText, ShieldCheck, BookOpen, Users, Pencil } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Use — Cultivate" }] }),
  component: Terms,
});

const sections = [
  { Icon: ShieldCheck, title: "Acceptance", body: "By using Cultivate you agree to these Terms. We aim to keep them short and human — read them once, refer back any time.", grad: "from-primary to-tangerine" },
  { Icon: Users, title: "Your account", body: "You're responsible for activity on your account. Keep your password safe and tell us right away if something looks off.", grad: "from-leaf to-ocean" },
  { Icon: BookOpen, title: "Content & recipes", body: "Recipes are for personal, non-commercial use. When you publish your own creations, you grant us a license to display them in the app.", grad: "from-saffron to-spice" },
  { Icon: ScrollText, title: "Community", body: "Be kind to fellow cooks. We reserve the right to remove content that crosses the line.", grad: "from-spice to-berry" },
  { Icon: Pencil, title: "Changes", body: "If we make significant updates to these terms, we'll let you know in-app first.", grad: "from-tangerine to-saffron" },
];

function Terms() {
  return (
    <PhoneFrame>
      <PageHeader title="Terms of Use" />
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-tangerine/10 via-surface to-saffron/10">
        {/* Hero */}
        <div className="mx-5 mt-4 rounded-[28px] p-6 bg-[linear-gradient(135deg,var(--primary),var(--tangerine),var(--spice))] animate-gradient text-white relative overflow-hidden shadow-warm animate-scale-in">
          <div className="absolute -top-10 -right-6 size-40 rounded-full bg-saffron/40 blur-3xl animate-blob" />
          <div className="absolute -bottom-12 -left-4 size-32 rounded-full bg-leaf/30 blur-2xl animate-blob [animation-delay:2s]" />
          <ScrollText className="size-10 relative" />
          <p className="text-[10px] uppercase tracking-[0.3em] mt-3 opacity-90 relative">Last updated · June 2026</p>
          <h2 className="font-display text-3xl mt-1 leading-tight relative">A handshake, in writing.</h2>
          <p className="text-sm mt-2 text-white/90 relative">Five short promises between us and you.</p>
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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Section {i + 1}</p>
                  <h3 className="font-display text-lg leading-tight mt-0.5">{s.title}</h3>
                  <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-3xl p-5 bg-gradient-to-br from-leaf/15 to-ocean/15 ring-1 ring-leaf/30 text-center animate-fade-in">
            <p className="text-2xl">🤝</p>
            <p className="font-display text-lg mt-1">Questions?</p>
            <p className="text-xs text-muted-foreground mt-1">Reach us at hello@cultivate.app</p>
          </div>
        </div>
      </main>
    </PhoneFrame>
  );
}
