import { Link } from "@tanstack/react-router";
import { ChefHat, HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 px-6 pb-10 pt-8 border-t border-border/40 text-center flex flex-col items-center gap-3 bg-muted/10">
      <div className="flex items-center gap-2">
        <div className="size-7 bg-primary/10 rounded-xl grid place-items-center text-primary shadow-soft">
          <ChefHat className="size-4" />
        </div>
        <span className="font-display text-base tracking-wide text-foreground/80">Cultivate</span>
      </div>
      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
        Your dynamic kitchen assistant for smart recipes, regional menus, and daily cooking.
      </p>
      <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/85 mt-2">
        <Link to="/terms" className="hover:text-primary hover:underline">Terms</Link>
        <span className="size-1 rounded-full bg-muted-foreground/30" />
        <Link to="/privacy" className="hover:text-primary hover:underline">Privacy</Link>
        <span className="size-1 rounded-full bg-muted-foreground/30" />
        <a href="mailto:support@cultivate.app" className="hover:text-primary hover:underline flex items-center gap-1">
          <HelpCircle className="size-3.5" /> Support
        </a>
      </div>
      <div className="mt-4 text-[10px] text-muted-foreground/40 font-medium uppercase tracking-wider">
        © 2026 Cultivate Kitchen Inc. · v1.0.2 Beta Build
      </div>
    </footer>
  );
}
