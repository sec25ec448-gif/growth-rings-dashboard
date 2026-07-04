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
} from "lucide-react";

const NAV = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/habits", label: "Habits", icon: Sprout },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/study", label: "Study", icon: CalendarClock },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/focus", label: "Focus", icon: Timer },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur px-1 py-1.5 overflow-x-auto">
      <div className="flex justify-between min-w-[560px]">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] flex-1 ${
                active ? "text-moss-500" : "text-[var(--ink-soft)]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
