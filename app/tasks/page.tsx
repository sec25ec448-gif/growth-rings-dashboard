"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { CATEGORY_COLOR, CATEGORY_LABEL, Category, Priority, Task } from "@/lib/types";
import { CheckCircle2, Circle, Plus, Trash2, X } from "lucide-react";
import { dateKey } from "@/lib/utils";

const PRIORITIES: Priority[] = ["high", "medium", "low"];
const CATEGORIES: Category[] = ["study", "health", "work", "personal", "fitness"];
const PRIORITY_DOT: Record<Priority, string> = {
  high: "#b8703a",
  medium: "#d9a441",
  low: "#749a5f",
};

export default function TasksPage() {
  const { data, addTask, toggleTask, deleteTask } = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [form, setForm] = useState({
    title: "",
    priority: "medium" as Priority,
    category: "personal" as Category,
    dueDate: dateKey(),
  });

  const filtered = useMemo(() => {
    return data.tasks
      .filter((t) => (filter === "all" ? true : filter === "completed" ? t.completed : !t.completed))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
      });
  }, [data.tasks, filter]);

  const completedCount = data.tasks.filter((t) => t.completed).length;
  const pct = data.tasks.length ? Math.round((completedCount / data.tasks.length) * 100) : 0;

  const submit = () => {
    if (!form.title.trim()) return;
    addTask({ title: form.title.trim(), priority: form.priority, category: form.category, dueDate: form.dueDate || null });
    setForm({ title: "", priority: "medium", category: "personal", dueDate: dateKey() });
    setOpen(false);
  };

  return (
    <div className="px-5 md:px-10 py-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Stay on track"
        title="Tasks"
        description="Create, prioritize, and clear what the day needs from you."
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-moss-500 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-moss-600 transition-colors"
          >
            <Plus size={16} /> New task
          </button>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div className="h-full bg-moss-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs mono-num text-[var(--ink-soft)] shrink-0">
          {completedCount}/{data.tasks.length} done
        </span>
      </div>

      <div className="flex gap-2 mb-5">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs capitalize transition-colors ${
              filter === f ? "bg-moss-500 text-white" : "bg-[var(--surface-2)] text-[var(--ink-soft)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card p-10 text-center text-[var(--ink-soft)] text-sm">
            No tasks here. Add one above to get moving.
          </div>
        )}
        {filtered.map((t) => (
          <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id)} onDelete={() => deleteTask(t.id)} />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setOpen(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">New task</h3>
              <button onClick={() => setOpen(false)} className="text-[var(--ink-soft)]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What needs doing?"
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-moss-300"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                  className="bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p} priority
                    </option>
                  ))}
                </select>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
              <button
                onClick={submit}
                className="w-full bg-moss-500 text-white rounded-xl py-2.5 text-sm hover:bg-moss-600 transition-colors"
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className="card p-3.5 flex items-center gap-3 group">
      <button onClick={onToggle} className="shrink-0">
        {task.completed ? (
          <CheckCircle2 size={20} className="text-moss-500" />
        ) : (
          <Circle size={20} className="text-[var(--ink-soft)]" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? "line-through text-[var(--ink-soft)]" : ""}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: PRIORITY_DOT[task.priority] }} />
          <span className="text-[11px] text-[var(--ink-soft)] capitalize">{task.priority}</span>
          {task.dueDate && <span className="text-[11px] text-[var(--ink-soft)]">· {task.dueDate}</span>}
        </div>
      </div>
      <span
        className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
        style={{ background: `${CATEGORY_COLOR[task.category]}1a`, color: CATEGORY_COLOR[task.category] }}
      >
        {task.category}
      </span>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-[var(--ink-soft)] hover:text-clay-500 transition-opacity shrink-0"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
