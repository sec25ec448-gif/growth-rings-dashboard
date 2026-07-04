"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { quoteForToday } from "@/lib/quotes";
import { dateKey, lastNDays, weekdayLabel, habitSuccessRate } from "@/lib/utils";
import GrowthRing from "@/components/GrowthRing";
import WeeklyChart from "@/components/WeeklyChart";
import { CATEGORY_COLOR, Priority } from "@/lib/types";
import { Plus, Sparkles, CheckCircle2, Circle, Target } from "lucide-react";
import Link from "next/link";

const PRIORITY_DOT: Record<Priority, string> = {
  high: "#b8703a",
  medium: "#d9a441",
  low: "#749a5f",
};

export default function Dashboard() {
  const { data, addTask, toggleTask } = useStore();
  const [quickTitle, setQuickTitle] = useState("");
  const today = dateKey();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const todayTasks = useMemo(
    () => data.tasks.filter((t) => !t.dueDate || t.dueDate === today),
    [data.tasks, today]
  );
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const taskPct = todayTasks.length
    ? Math.round((completedToday / todayTasks.length) * 100)
    : 0;

  const habitPct = useMemo(() => {
    if (data.habits.length === 0) return 0;
    const done = data.habits.filter((h) => h.log[today]).length;
    return Math.round((done / data.habits.length) * 100);
  }, [data.habits, today]);

  const avgHabitConsistency = useMemo(() => {
    if (data.habits.length === 0) return 0;
    const total = data.habits.reduce((s, h) => s + habitSuccessRate(h.log, 14), 0);
    return Math.round(total / data.habits.length);
  }, [data.habits]);

  const focusMinutesToday = useMemo(
    () =>
      data.focusSessions
        .filter((f) => f.date.startsWith(today))
        .reduce((s, f) => s + f.minutes, 0),
    [data.focusSessions, today]
  );

  const productivityScore = Math.round((taskPct * 0.5 + habitPct * 0.3 + Math.min(100, focusMinutesToday) * 0.2));

  const weekly = useMemo(() => {
    const days = lastNDays(7);
    return days.map((d) => ({
      day: weekdayLabel(d),
      tasks: data.tasks.filter((t) => t.completed && t.dueDate === d).length,
      habits: data.habits.filter((h) => h.log[d]).length,
    }));
  }, [data.tasks, data.habits]);

  const upcomingGoals = useMemo(
    () =>
      data.goals
        .filter((g) => g.status !== "completed")
        .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"))
        .slice(0, 3),
    [data.goals]
  );

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return;
    addTask({ title: quickTitle.trim(), priority: "medium", category: "personal", dueDate: today });
    setQuickTitle("");
  };

  return (
    <div className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-moss-500 font-medium mb-1.5">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display text-3xl md:text-[36px] leading-tight">{greeting}.</h1>
        </div>
        <div className="flex items-center gap-2 card px-4 py-2.5 max-w-sm">
          <Sparkles size={16} className="text-gold-400 shrink-0" />
          <p className="text-sm italic text-[var(--ink-soft)] font-display">
            {quoteForToday()}
          </p>
        </div>
      </div>

      {/* Rings row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 flex flex-col items-center gap-3">
          <GrowthRing progress={taskPct} color="#3f6b4f" label={`${taskPct}%`} sublabel="tasks" size={96} />
          <p className="text-sm text-[var(--ink-soft)]">Today's tasks</p>
        </div>
        <div className="card p-5 flex flex-col items-center gap-3">
          <GrowthRing progress={habitPct} color="#d9a441" label={`${habitPct}%`} sublabel="habits" size={96} />
          <p className="text-sm text-[var(--ink-soft)]">Habit check-ins</p>
        </div>
        <div className="card p-5 flex flex-col items-center gap-3">
          <GrowthRing progress={avgHabitConsistency} color="#7a5c3e" label={`${avgHabitConsistency}%`} sublabel="14-day" size={96} />
          <p className="text-sm text-[var(--ink-soft)]">Habit consistency</p>
        </div>
        <div className="card p-5 flex flex-col items-center gap-3">
          <GrowthRing progress={productivityScore} color="#3f6b4f" label={`${productivityScore}`} sublabel="score" size={96} />
          <p className="text-sm text-[var(--ink-soft)]">Productivity score</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-5 mb-6">
        {/* Today's tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Today's tasks</h2>
            <Link href="/tasks" className="text-xs text-moss-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              placeholder="Quick add a task for today…"
              className="flex-1 bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-moss-300"
            />
            <button
              onClick={handleQuickAdd}
              className="w-10 h-10 rounded-xl bg-moss-500 text-white flex items-center justify-center shrink-0 hover:bg-moss-600 transition-colors"
              aria-label="Add task"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {todayTasks.length === 0 && (
              <p className="text-sm text-[var(--ink-soft)] py-6 text-center">
                Nothing on the list yet. Add what today needs.
              </p>
            )}
            {todayTasks.slice(0, 8).map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-2)] text-left transition-colors"
              >
                {t.completed ? (
                  <CheckCircle2 size={18} className="text-moss-500 shrink-0" />
                ) : (
                  <Circle size={18} className="text-[var(--ink-soft)] shrink-0" />
                )}
                <span
                  className={`text-sm flex-1 ${t.completed ? "line-through text-[var(--ink-soft)]" : ""}`}
                >
                  {t.title}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: PRIORITY_DOT[t.priority] }}
                  title={t.priority}
                />
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: `${CATEGORY_COLOR[t.category]}1a`,
                    color: CATEGORY_COLOR[t.category],
                  }}
                >
                  {t.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly chart */}
        <div className="card p-6">
          <h2 className="font-display text-xl mb-4">This week</h2>
          <WeeklyChart data={weekly} />
          <div className="flex items-center gap-4 text-xs text-[var(--ink-soft)] mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-moss-500" /> Tasks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400" /> Habits
            </span>
          </div>
        </div>
      </div>

      {/* Goals preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Goals in motion</h2>
          <Link href="/goals" className="text-xs text-moss-500 hover:underline">
            View all
          </Link>
        </div>
        {upcomingGoals.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)] py-4">
            No active goals yet. Set one worth growing toward.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingGoals.map((g) => {
              const pct = g.milestones.length
                ? Math.round((g.milestones.filter((m) => m.done).length / g.milestones.length) * 100)
                : 0;
              const daysLeft = g.deadline
                ? Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000))
                : null;
              return (
                <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)]">
                  <GrowthRing progress={pct} size={56} strokeWidth={6} color="#3f6b4f" rings={false} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate flex items-center gap-1.5">
                      <Target size={13} className="text-moss-500" /> {g.title}
                    </p>
                    <p className="text-xs text-[var(--ink-soft)]">
                      {daysLeft !== null ? `${daysLeft} days left` : "No deadline"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
