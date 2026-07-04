"use client";

import { dateKey } from "@/lib/utils";

export default function HabitHeatmap({
  log,
  weeks = 12,
  onToggle,
}: {
  log: Record<string, boolean>;
  weeks?: number;
  onToggle?: (key: string) => void;
}) {
  const days: string[] = [];
  const today = new Date();
  const totalDays = weeks * 7;
  // align to start of week (Sunday)
  const start = new Date(today);
  start.setDate(start.getDate() - totalDays + 1 + (6 - today.getDay()));

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(dateKey(d));
  }

  const cols: string[][] = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));

  const todayKey = dateKey();

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((key) => {
            const filled = !!log[key];
            const isFuture = key > todayKey;
            return (
              <button
                key={key}
                disabled={isFuture}
                onClick={() => onToggle?.(key)}
                title={key}
                className={`w-3 h-3 rounded-[3px] transition-colors ${
                  isFuture ? "opacity-20 cursor-default" : "cursor-pointer"
                }`}
                style={{
                  background: filled ? "#3f6b4f" : "var(--surface-2)",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
