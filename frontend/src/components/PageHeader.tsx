import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 bg-surface/85 backdrop-blur-md">
      <button
        onClick={() => router.history.back()}
        className="size-10 grid place-items-center rounded-full bg-card ring-1 ring-border hover-lift"
        aria-label="Back"
      >
        <ChevronLeft className="size-5" />
      </button>
      <h1 className="font-display text-xl text-foreground">{title}</h1>
      <div className="size-10">{right}</div>
    </header>
  );
}
