"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Sprout,
  Target,
  NotebookPen,
  CalendarClock,
  Timer,
  Moon,
  Sun,
  TreeDeciduous,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { levelFromXp } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/habits", label: "Habits", icon: Sprout },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/study", label: "Study Planner", icon: CalendarClock },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/focus", label: "Focus Mode", icon: Timer },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { data } = useStore();
  const { level, into, span } = levelFromXp(data.xp);

  return (
    <aside className="hidden md:flex md:w-64 flex-col shrink-0 h-screen sticky top-0 border-r border-[var(--border)] px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-full bg-moss-500 text-parchment flex items-center justify-center">
          <TreeDeciduous size={18} />
        </div>
        <div>
          <p className="font-display text-[17px] leading-none">Growth Rings</p>
          <p className="text-[11px] text-[var(--ink-soft)]">personal growth, tracked</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-moss-500 text-white"
                  : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between px-2 mb-3">
          <div>
            <p className="text-[11px] text-[var(--ink-soft)]">Level</p>
            <p className="font-display text-lg leading-none">{level}</p>
          </div>
          <div className="flex-1 mx-3 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div
              className="h-full bg-gold-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (into / span) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] mono-num text-[var(--ink-soft)]">
            {into}/{span}
          </p>
        </div>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2 justify-center px-3 py-2 rounded-xl text-sm border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </aside>
  );
}
