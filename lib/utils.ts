export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysAgoKey(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateKey(d);
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(daysAgoKey(i));
  return out;
}

export function weekdayLabel(key: string): string {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function shortDate(key: string): string {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

export function habitStreak(log: Record<string, boolean>): number {
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = dateKey(cursor);
    if (log[key]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function habitSuccessRate(log: Record<string, boolean>, days = 30): number {
  const keys = lastNDays(days);
  const hits = keys.filter((k) => log[k]).length;
  return Math.round((hits / days) * 100);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function levelFromXp(xp: number): { level: number; into: number; span: number } {
  // simple curve: each level needs level*50 xp
  let level = 1;
  let remaining = xp;
  let span = 50;
  while (remaining >= span) {
    remaining -= span;
    level++;
    span = level * 50;
  }
  return { level, into: remaining, span };
}
