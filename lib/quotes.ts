export const QUOTES: string[] = [
  "Growth is a rhythm, not a race.",
  "Small rings, stacked daily, become a trunk.",
  "You don't need a bigger day, just a kept promise.",
  "Consistency is the quiet form of ambition.",
  "Water the habit, not the outcome.",
  "Every ring you close today is proof for tomorrow.",
  "Progress hides in the boring repeats.",
  "The season changes because the roots kept working.",
  "Show up small. Show up often.",
  "What you repeat, you become.",
  "One honest hour beats ten planned ones.",
  "The work you avoid is the ring you need most.",
];

export function quoteForToday(): string {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return QUOTES[day % QUOTES.length];
}
