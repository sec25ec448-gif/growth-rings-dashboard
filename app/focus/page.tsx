"use client";

import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import GrowthRing from "@/components/GrowthRing";
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from "lucide-react";

const PRESETS = [
  { label: "25 / 5", minutes: 25 },
  { label: "50 / 10", minutes: 50 },
  { label: "Custom", minutes: 0 },
];

export default function FocusPage() {
  const { data, logFocusSession } = useStore();
  const [presetMinutes, setPresetMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [label, setLabel] = useState("Deep work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const totalRef = useRef(25 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setDuration = (mins: number) => {
    setPresetMinutes(mins);
    const m = mins || customMinutes;
    setSecondsLeft(m * 60);
    totalRef.current = m * 60;
    setRunning(false);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            const mins = Math.round(totalRef.current / 60);
            logFocusSession(mins, label || "Focus session");
            return totalRef.current;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(totalRef.current);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progress = 100 - (secondsLeft / totalRef.current) * 100;

  const totalMinutesLogged = data.focusSessions.reduce((s, f) => s + f.minutes, 0);
  const recent = [...data.focusSessions].slice(-8).reverse();

  return (
    <div className={`px-5 md:px-10 py-8 max-w-3xl mx-auto ${fullscreen ? "fixed inset-0 z-40 bg-[var(--bg)] max-w-none flex flex-col items-center justify-center" : ""}`}>
      {!fullscreen && (
        <PageHeader
          eyebrow="Undivided attention"
          title="Focus Mode"
          description="Pomodoro sessions, distraction-free, with your history kept quietly in the background."
        />
      )}

      <div className={`card p-8 flex flex-col items-center gap-6 ${fullscreen ? "border-none shadow-none bg-transparent" : ""}`}>
        {!fullscreen && (
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setDuration(p.minutes)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                  presetMinutes === p.minutes ? "bg-moss-500 text-white" : "bg-[var(--surface-2)] text-[var(--ink-soft)]"
                }`}
              >
                {p.label}
              </button>
            ))}
            {presetMinutes === 0 && (
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1;
                  setCustomMinutes(v);
                  setSecondsLeft(v * 60);
                  totalRef.current = v * 60;
                }}
                className="w-16 bg-[var(--surface-2)] rounded-full px-2 text-xs text-center outline-none"
              />
            )}
          </div>
        )}

        <GrowthRing progress={progress} size={220} strokeWidth={14} color="#3f6b4f" label={`${mm}:${ss}`} sublabel={label} />

        {!fullscreen && (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="What are you focusing on?"
            className="w-full max-w-xs text-center bg-[var(--surface-2)] rounded-xl px-3.5 py-2 text-sm outline-none"
          />
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)]"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="w-16 h-16 rounded-full bg-moss-500 text-white flex items-center justify-center hover:bg-moss-600 transition-colors"
          >
            {running ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            onClick={() => setFullscreen((f) => !f)}
            className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)]"
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {!fullscreen && (
        <div className="card p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Session history</h2>
            <span className="text-xs text-[var(--ink-soft)] mono-num">{totalMinutesLogged} min total</span>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)] py-6 text-center">No sessions logged yet.</p>
          ) : (
            <div className="space-y-1.5">
              {recent.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface-2)] text-sm">
                  <span>{f.label}</span>
                  <span className="text-[var(--ink-soft)] mono-num text-xs">
                    {f.minutes}m · {new Date(f.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
