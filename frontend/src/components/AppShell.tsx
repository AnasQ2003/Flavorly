import { useState, useEffect, type ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { TopNav } from "./TopNav";
import { BottomTabBar } from "./BottomTabBar";
import { Drawer } from "./Drawer";
import { useRouterState } from "@tanstack/react-router";
import { Footer } from "./Footer";

type Props = {
  children: ReactNode;
  showTopNav?: boolean;
  showTabBar?: boolean;
  greeting?: string;
};

export function AppShell({ children, showTopNav = true, showTabBar = true, greeting }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PhoneFrame>
      {showTopNav && <TopNav onMenu={() => setDrawerOpen(true)} greeting={greeting} />}
      <main
        className={`flex-1 min-h-0 overflow-y-auto no-scrollbar animate-fade-in ${showTabBar ? "pb-28" : ""}`}
      >
        {children}
        <Footer />
      </main>
      {showTabBar && <BottomTabBar />}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </PhoneFrame>
  );
}
