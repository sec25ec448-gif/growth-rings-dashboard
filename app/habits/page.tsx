"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { dateKey, habitStreak, habitSuccessRate } from "@/lib/utils";
import HabitHeatmap from "@/components/HabitHeatmap";
import { Plus, Trash2, X, Flame } from "lucide-react";

const EMOJIS = ["🌅", "🏃", "📖", "🧘", "💧", "💻", "✍️", "🥗", "🎯", "🎨"];

export default function HabitsPage() {
  const { data, addHabit, toggleHabitDay, deleteHabit } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const today = dateKey();

  const submit = () => {
    if (!name.trim()) return;
    addHabit(name.trim(), emoji);
    setName("");
    setEmoji(EMOJIS[0]);
    setOpen(false);
  };

  return (
    <div className="px-5 md:px-10 py-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Water it daily"
        title="Habits"
        description="Check in each day. The rings are made of every small repeat."
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-moss-500 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-moss-600 transition-colors"
          >
            <Plus size={16} /> New habit
          </button>
        }
      />

      <div className="space-y-4">
        {data.habits.length === 0 && (
          <div className="card p-10 text-center text-[var(--ink-soft)] text-sm">
            No habits yet — start with one you can actually keep.
          </div>
        )}
        {data.habits.map((h) => {
          const streak = habitStreak(h.log);
          const rate = habitSuccessRate(h.log, 30);
          const doneToday = !!h.log[today];
          return (
            <div key={h.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{h.emoji}</span>
                  <div>
                    <p className="font-medium">{h.name}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Flame size={12} className="text-clay-500" /> {streak}-day streak
                      </span>
                      <span>{rate}% last 30 days</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHabitDay(h.id, today)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                      doneToday
                        ? "bg-moss-500 text-white"
                        : "bg-[var(--surface-2)] text-[var(--ink-soft)] hover:bg-moss-100"
                    }`}
                  >
                    {doneToday ? "Done today" : "Mark today"}
                  </button>
                  <button
                    onClick={() => deleteHabit(h.id)}
                    className="text-[var(--ink-soft)] hover:text-clay-500"
                    aria-label="Delete habit"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <HabitHeatmap log={h.log} weeks={14} onToggle={(key) => toggleHabitDay(h.id, key)} />
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setOpen(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">New habit</h3>
              <button onClick={() => setOpen(false)} className="text-[var(--ink-soft)]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Read 20 minutes"
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-moss-300"
              />
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center ${
                      emoji === e ? "bg-moss-500" : "bg-[var(--surface-2)]"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <button
                onClick={submit}
                className="w-full bg-moss-500 text-white rounded-xl py-2.5 text-sm hover:bg-moss-600 transition-colors"
              >
                Add habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
