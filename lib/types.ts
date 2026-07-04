export type Priority = "low" | "medium" | "high";
export type Category = "study" | "health" | "work" | "personal" | "fitness";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: Category;
  dueDate: string | null; // ISO date
  completed: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  // map of "yyyy-MM-dd" -> true
  log: Record<string, boolean>;
}

export type GoalStatus = "not_started" | "in_progress" | "completed";

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  term: "short" | "long";
  status: GoalStatus;
  milestones: Milestone[];
  createdAt: string;
}

export type Mood = "great" | "good" | "okay" | "low" | "rough";

export interface JournalEntry {
  id: string;
  date: string; // yyyy-MM-dd
  mood: Mood;
  content: string;
  createdAt: string;
}

export interface StudyBlock {
  id: string;
  day: number; // 0=Mon .. 6=Sun
  subject: string;
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  notes: string;
}

export interface FocusSession {
  id: string;
  date: string;
  minutes: number;
  label: string;
}

export interface AppData {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  journal: JournalEntry[];
  studyBlocks: StudyBlock[];
  exams: Exam[];
  focusSessions: FocusSession[];
  xp: number;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  study: "Study",
  health: "Health",
  work: "Work",
  personal: "Personal",
  fitness: "Fitness",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  study: "#3f6b4f",
  health: "#b8842b",
  work: "#7a5c3e",
  personal: "#749a5f",
  fitness: "#d9a441",
};

export const MOOD_LABEL: Record<Mood, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  low: "Low",
  rough: "Rough",
};

export const MOOD_EMOJI: Record<Mood, string> = {
  great: "🌿",
  good: "🌤️",
  okay: "🌥️",
  low: "🌧️",
  rough: "⛈️",
};
