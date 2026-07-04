"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { Plus, Trash2, X, GraduationCap } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PALETTE = ["#3f6b4f", "#d9a441", "#7a5c3e", "#749a5f", "#b8842b", "#a97c50"];

export default function StudyPage() {
  const { data, addStudyBlock, deleteStudyBlock, addExam, deleteExam } = useStore();
  const [blockOpen, setBlockOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [block, setBlock] = useState({ day: 0, subject: "", start: "16:00", end: "17:00" });
  const [exam, setExam] = useState({ subject: "", date: "", notes: "" });

  const subjectHours = useMemo(() => {
    const map = new Map<string, number>();
    data.studyBlocks.forEach((b) => {
      const [sh, sm] = b.start.split(":").map(Number);
      const [eh, em] = b.end.split(":").map(Number);
      const hours = Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60);
      map.set(b.subject, (map.get(b.subject) ?? 0) + hours);
    });
    return Array.from(map.entries()).map(([subject, hours]) => ({ subject, hours: Math.round(hours * 10) / 10 }));
  }, [data.studyBlocks]);

  const upcomingExams = useMemo(
    () => [...data.exams].sort((a, b) => a.date.localeCompare(b.date)),
    [data.exams]
  );

  const submitBlock = () => {
    if (!block.subject.trim()) return;
    addStudyBlock(block);
    setBlock({ day: 0, subject: "", start: "16:00", end: "17:00" });
    setBlockOpen(false);
  };

  const submitExam = () => {
    if (!exam.subject.trim() || !exam.date) return;
    addExam(exam);
    setExam({ subject: "", date: "", notes: "" });
    setExamOpen(false);
  };

  return (
    <div className="px-5 md:px-10 py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Plan the hours"
        title="Study Planner"
        description="A weekly timetable, subject hours, and what's coming up on the calendar."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setExamOpen(true)}
              className="flex items-center gap-2 border border-[var(--border)] px-3.5 py-2.5 rounded-xl text-sm hover:bg-[var(--surface-2)]"
            >
              <GraduationCap size={16} /> Add exam
            </button>
            <button
              onClick={() => setBlockOpen(true)}
              className="flex items-center gap-2 bg-moss-500 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-moss-600 transition-colors"
            >
              <Plus size={16} /> Add block
            </button>
          </div>
        }
      />

      {/* Weekly timetable */}
      <div className="card p-5 mb-6 overflow-x-auto">
        <h2 className="font-display text-xl mb-4">Weekly timetable</h2>
        <div className="grid grid-cols-7 gap-2 min-w-[640px]">
          {DAYS.map((d, i) => (
            <div key={d}>
              <p className="text-xs text-[var(--ink-soft)] text-center mb-2 font-medium">{d}</p>
              <div className="space-y-1.5 min-h-[80px]">
                {data.studyBlocks
                  .filter((b) => b.day === i)
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((b) => (
                    <div
                      key={b.id}
                      className="group relative bg-moss-100 dark:bg-moss-800 rounded-lg px-2 py-1.5 text-[11px]"
                    >
                      <p className="font-medium truncate">{b.subject}</p>
                      <p className="text-[var(--ink-soft)]">{b.start}–{b.end}</p>
                      <button
                        onClick={() => deleteStudyBlock(b.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[var(--ink-soft)] hover:text-clay-500"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Subject hours */}
        <div className="card p-5">
          <h2 className="font-display text-xl mb-4">Subject-wise hours</h2>
          {subjectHours.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)] py-8 text-center">
              Add blocks to see how your week splits up.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={subjectHours} dataKey="hours" nameKey="subject" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {subjectHours.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {subjectHours.map((s, i) => (
              <span key={s.subject} className="text-[11px] flex items-center gap-1.5 text-[var(--ink-soft)]">
                <span className="w-2 h-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                {s.subject} · {s.hours}h
              </span>
            ))}
          </div>
        </div>

        {/* Upcoming exams / revision planner */}
        <div className="card p-5">
          <h2 className="font-display text-xl mb-4">Upcoming exams</h2>
          <div className="space-y-2">
            {upcomingExams.length === 0 && (
              <p className="text-sm text-[var(--ink-soft)] py-8 text-center">Nothing scheduled yet.</p>
            )}
            {upcomingExams.map((e) => {
              const daysLeft = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
              return (
                <div key={e.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--surface-2)] group">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{e.subject}</p>
                    <p className="text-xs text-[var(--ink-soft)]">
                      {e.date} · {daysLeft >= 0 ? `${daysLeft} days left` : "past"}
                    </p>
                    {e.notes && <p className="text-xs text-[var(--ink-soft)] mt-0.5">{e.notes}</p>}
                  </div>
                  <button
                    onClick={() => deleteExam(e.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--ink-soft)] hover:text-clay-500 shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {blockOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setBlockOpen(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">New study block</h3>
              <button onClick={() => setBlockOpen(false)} className="text-[var(--ink-soft)]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={block.subject}
                onChange={(e) => setBlock({ ...block, subject: e.target.value })}
                placeholder="Subject"
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
              <select
                value={block.day}
                onChange={(e) => setBlock({ ...block, day: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={block.start}
                  onChange={(e) => setBlock({ ...block, start: e.target.value })}
                  className="bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
                />
                <input
                  type="time"
                  value={block.end}
                  onChange={(e) => setBlock({ ...block, end: e.target.value })}
                  className="bg-[var(--surface-2)] rounded-xl px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <button
                onClick={submitBlock}
                className="w-full bg-moss-500 text-white rounded-xl py-2.5 text-sm hover:bg-moss-600 transition-colors"
              >
                Add block
              </button>
            </div>
          </div>
        </div>
      )}

      {examOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setExamOpen(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">New exam</h3>
              <button onClick={() => setExamOpen(false)} className="text-[var(--ink-soft)]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={exam.subject}
                onChange={(e) => setExam({ ...exam, subject: e.target.value })}
                placeholder="Subject"
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
              <input
                type="date"
                value={exam.date}
                onChange={(e) => setExam({ ...exam, date: e.target.value })}
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
              <input
                value={exam.notes}
                onChange={(e) => setExam({ ...exam, notes: e.target.value })}
                placeholder="Notes (optional)"
                className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
              <button
                onClick={submitExam}
                className="w-full bg-moss-500 text-white rounded-xl py-2.5 text-sm hover:bg-moss-600 transition-colors"
              >
                Add exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
