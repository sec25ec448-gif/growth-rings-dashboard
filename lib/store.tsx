"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import {
  AppData,
  Exam,
  FocusSession,
  Goal,
  Habit,
  JournalEntry,
  Milestone,
  StudyBlock,
  Task,
} from "./types";

const STORAGE_KEY = "growth-rings:data:v1";

const emptyData: AppData = {
  tasks: [],
  habits: [],
  goals: [],
  journal: [],
  studyBlocks: [],
  exams: [],
  focusSessions: [],
  xp: 0,
};

function load(): AppData {
  if (typeof window === "undefined") return emptyData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw);
    return { ...emptyData, ...parsed };
  } catch {
    return emptyData;
  }
}

interface StoreShape {
  data: AppData;
  ready: boolean;
  addTask: (t: Omit<Task, "id" | "createdAt" | "completed">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;

  addHabit: (name: string, emoji: string) => void;
  toggleHabitDay: (id: string, dateKey: string) => void;
  deleteHabit: (id: string) => void;

  addGoal: (g: Omit<Goal, "id" | "createdAt" | "milestones"> & { milestones: string[] }) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  addJournalEntry: (e: Omit<JournalEntry, "id" | "createdAt">) => void;
  deleteJournalEntry: (id: string) => void;

  addStudyBlock: (b: Omit<StudyBlock, "id">) => void;
  deleteStudyBlock: (id: string) => void;
  addExam: (e: Omit<Exam, "id">) => void;
  deleteExam: (id: string) => void;

  logFocusSession: (minutes: number, label: string) => void;

  addXp: (amount: number) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreShape | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const addXp = useCallback((amount: number) => {
    setData((d) => ({ ...d, xp: Math.max(0, d.xp + amount) }));
  }, []);

  const addTask = useCallback<StoreShape["addTask"]>((t) => {
    setData((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        { ...t, id: uuid(), completed: false, createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setData((d) => {
      let delta = 0;
      const tasks = d.tasks.map((t) => {
        if (t.id !== id) return t;
        delta = t.completed ? -8 : 8;
        return { ...t, completed: !t.completed };
      });
      return { ...d, tasks, xp: Math.max(0, d.xp + delta) };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const addHabit = useCallback((name: string, emoji: string) => {
    setData((d) => ({
      ...d,
      habits: [
        ...d.habits,
        { id: uuid(), name, emoji, createdAt: new Date().toISOString(), log: {} },
      ],
    }));
  }, []);

  const toggleHabitDay = useCallback((id: string, dateKey: string) => {
    setData((d) => {
      let delta = 0;
      const habits = d.habits.map((h) => {
        if (h.id !== id) return h;
        const next = { ...h.log };
        if (next[dateKey]) {
          delete next[dateKey];
          delta = -5;
        } else {
          next[dateKey] = true;
          delta = 5;
        }
        return { ...h, log: next };
      });
      return { ...d, habits, xp: Math.max(0, d.xp + delta) };
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  }, []);

  const addGoal = useCallback<StoreShape["addGoal"]>((g) => {
    const milestones: Milestone[] = g.milestones
      .filter((m) => m.trim().length > 0)
      .map((title) => ({ id: uuid(), title, done: false }));
    setData((d) => ({
      ...d,
      goals: [
        ...d.goals,
        {
          id: uuid(),
          title: g.title,
          description: g.description,
          deadline: g.deadline,
          term: g.term,
          status: g.status,
          milestones,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  }, []);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, done: !m.done } : m
          ),
        };
      }),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }, []);

  const addJournalEntry = useCallback<StoreShape["addJournalEntry"]>((e) => {
    setData((d) => ({
      ...d,
      journal: [
        { ...e, id: uuid(), createdAt: new Date().toISOString() },
        ...d.journal,
      ],
      xp: d.xp + 6,
    }));
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setData((d) => ({ ...d, journal: d.journal.filter((j) => j.id !== id) }));
  }, []);

  const addStudyBlock = useCallback<StoreShape["addStudyBlock"]>((b) => {
    setData((d) => ({ ...d, studyBlocks: [...d.studyBlocks, { ...b, id: uuid() }] }));
  }, []);

  const deleteStudyBlock = useCallback((id: string) => {
    setData((d) => ({ ...d, studyBlocks: d.studyBlocks.filter((b) => b.id !== id) }));
  }, []);

  const addExam = useCallback<StoreShape["addExam"]>((e) => {
    setData((d) => ({ ...d, exams: [...d.exams, { ...e, id: uuid() }] }));
  }, []);

  const deleteExam = useCallback((id: string) => {
    setData((d) => ({ ...d, exams: d.exams.filter((e) => e.id !== id) }));
  }, []);

  const logFocusSession = useCallback((minutes: number, label: string) => {
    setData((d) => ({
      ...d,
      focusSessions: [
        ...d.focusSessions,
        { id: uuid(), date: new Date().toISOString(), minutes, label },
      ],
      xp: d.xp + Math.round(minutes / 5),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setData(emptyData);
  }, []);

  const value = useMemo<StoreShape>(
    () => ({
      data,
      ready,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      addHabit,
      toggleHabitDay,
      deleteHabit,
      addGoal,
      updateGoal,
      toggleMilestone,
      deleteGoal,
      addJournalEntry,
      deleteJournalEntry,
      addStudyBlock,
      deleteStudyBlock,
      addExam,
      deleteExam,
      logFocusSession,
      addXp,
      resetAll,
    }),
    [
      data,
      ready,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      addHabit,
      toggleHabitDay,
      deleteHabit,
      addGoal,
      updateGoal,
      toggleMilestone,
      deleteGoal,
      addJournalEntry,
      deleteJournalEntry,
      addStudyBlock,
      deleteStudyBlock,
      addExam,
      deleteExam,
      logFocusSession,
      addXp,
      resetAll,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
