import { useState, type ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { TopNav } from "./TopNav";
import { BottomTabBar } from "./BottomTabBar";
import { Drawer } from "./Drawer";

type Props = {
  children: ReactNode;
  showTopNav?: boolean;
  showTabBar?: boolean;
  greeting?: string;
};

export function AppShell({ children, showTopNav = true, showTabBar = true, greeting }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <PhoneFrame>
      {showTopNav && <TopNav onMenu={() => setDrawerOpen(true)} greeting={greeting} />}
      <main
        className={`flex-1 min-h-0 overflow-y-auto no-scrollbar animate-fade-in ${showTabBar ? "pb-28" : ""}`}
      >
        {children}
      </main>
      {showTabBar && <BottomTabBar />}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </PhoneFrame>
  );
}
