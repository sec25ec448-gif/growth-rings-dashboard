"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import GrowthRing from "@/components/GrowthRing";
import { Plus, Trash2, X, Check } from "lucide-react";

export default function GoalsPage() {
  const { data, addGoal, toggleMilestone, deleteGoal, updateGoal } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    term: "short" as "short" | "long",
    milestonesRaw: "",
  });

  const submit = () => {
    if (!form.title.trim()) return;
    addGoal({
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: form.deadline || null,
      term: form.term,
      status: "in_progress",
      milestones: form.milestonesRaw.split("\n"),
    });
    setForm({ title: "", description: "", deadline: "", term: "short", milestonesRaw: "" });
    setOpen(false);
  };

  return (
    <div className="px-5 md:px-10 py-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Aim, then tend"
        title="Goals"
        description="Short-term sprints and long-term roots — broken into milestones you can actually check off."
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-moss-500 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-moss-600 transition-colors"
          >
            <Plus size={16} /> New goal
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-5">
        {data.goals.length === 0 && (
          <div className="card p-10 text-center text-[var(--ink-soft)] text-sm md:col-span-2">
            No goals yet. Name one thing worth working toward.
          </div>
        )}
        {data.goals.map((g) => {
          const pct = g.milestones.length
            ? Math.round((g.milestones.filter((m) => m.done).length / g.milestones.length) * 100)
            : g.status === "completed"
            ? 100
            : 0;
          const daysLeft = g.deadline
            ? Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)
            : null;

          return (
            <div key={g.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-4">
                  <GrowthRing progress={pct} size={64} strokeWidth={7} color="#3f6b4f" rings={false} />
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gold-500 font-medium">
                      {g.term === "short" ? "Short-term" : "Long-term"}
                    </span>
                    <p className="font-display text-lg leading-tight">{g.title}</p>
                    {g.deadline && (
                      <p className="text-xs text-[var(--ink-soft)]">
                        {daysLeft !== null && daysLeft >= 0
                          ? `${daysLeft} days remaining`
                          : "past deadline"}{" "}
                        · due {g.deadline}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteGoal(g.id)} className="text-[var(--ink-soft)] hover:text-clay-500 shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
              {g.description && <p className="text-sm text-[var(--ink-soft)] mb-3">{g.description}</p>}
              {g.milestones.length > 0 && (
                <div className="space-y-1.5">
                  {g.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleMilestone(g.id, m.id)}
                      className="w-full flex items-center gap-2.5 text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--surface-2)]"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          m.done ? "bg-moss-500 border-moss-500" : "border-[var(--border)]"
                        }`}
                      >
                        {m.done && <Check size={10} className="text-white" />}
                      </span>
                      <span className={`text-sm ${m.done ? "line-through text-[var(--ink-soft)]" : ""}`}>
                        {m.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                {(["in_progress", "completed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateGoal(g.id, { status: s })}
                    className={`text-[11px] px-2.5 py-1 rounded-full capitalize ${
                      g.status === s ? "bg-moss-500 text-white" : "bg-[var(--surface-2)] text-[var(--ink-soft)]"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setOpen(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">New goal</h3>
              <button onClick={() => setOpen(false)} className="text-[var(--ink-soft)]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Goal title"
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.term}
                  onChange={(e) => setForm({ ...form, term: e.target.value as "short" | "long" })}
                  className="bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  <option value="short">Short-term</option>
                  <option value="long">Long-term</option>
                </select>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <textarea
                value={form.milestonesRaw}
                onChange={(e) => setForm({ ...form, milestonesRaw: e.target.value })}
                placeholder={"Milestones, one per line\ne.g.\nOutline plan\nFirst draft\nReview"}
                rows={3}
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
              />
              <button
                onClick={submit}
                className="w-full bg-moss-500 text-white rounded-xl py-2.5 text-sm hover:bg-moss-600 transition-colors"
              >
                Add goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
