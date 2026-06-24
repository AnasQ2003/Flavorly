import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Phone-frame wrapper. Cylindrical (rotateY) page transition keyed by pathname,
 * fills the viewport on mobile, vibrant animated backdrop on desktop preview.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative h-[100dvh] w-full flex items-stretch justify-center sm:py-6 overflow-hidden bg-[linear-gradient(135deg,oklch(0.97_0.04_55),oklch(0.96_0.05_85),oklch(0.95_0.05_145),oklch(0.96_0.05_25))] animate-gradient">
      <div className="hidden sm:block absolute -top-20 -left-20 size-96 rounded-full bg-tangerine/40 blur-3xl animate-blob" />
      <div className="hidden sm:block absolute top-40 -right-24 size-[420px] rounded-full bg-berry/30 blur-3xl animate-blob [animation-delay:2s]" />
      <div className="hidden sm:block absolute -bottom-32 left-1/3 size-[460px] rounded-full bg-leaf/35 blur-3xl animate-blob [animation-delay:4s]" />
      <div className="hidden sm:block absolute top-10 right-10 size-40 rounded-full bg-saffron/40 blur-2xl animate-blob [animation-delay:1s]" />

      <div
        className="relative z-10 w-full max-w-[430px] h-[100dvh] sm:h-[min(900px,calc(100dvh-3rem))] bg-surface overflow-hidden sm:rounded-[44px] sm:border-[10px] sm:border-foreground/90 sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
        style={{ perspective: "1400px" }}
      >
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/90 rounded-b-3xl z-50" />
        <div key={pathname} className="flex-1 min-h-0 flex flex-col animate-cylinder-in">
          {children}
        </div>
      </div>
    </div>
  );
}
