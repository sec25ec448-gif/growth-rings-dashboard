# Growth Rings — Life Improvement Dashboard

A personal growth dashboard: tasks, habits, goals, a study planner, a journal,
and a distraction-free focus timer. Everything is saved to your browser's
local storage — no account, no server, no data leaving your machine.

## Design

The visual identity is built around **growth rings** — a tree-ring inspired
circular progress indicator used everywhere progress needs to be shown
(today's tasks, habit consistency, goal completion, focus sessions), instead
of generic flat progress bars. Palette: moss green, warm clay, and harvest
gold, on a soft parchment (light) or deep forest (dark) background. Type is
Fraunces (display) + Inter (body) + JetBrains Mono (numbers).

## Getting started

Requires [Node.js](https://nodejs.org/) 18.18 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## What's included

- **Dashboard** — greeting, daily quote, growth-ring stats, today's tasks,
  weekly activity chart, goals-in-motion preview.
- **Tasks** — create/edit/complete/delete, priority, category, due date,
  filters.
- **Habits** — daily check-ins, streaks, 30-day success rate, 14-week
  calendar heatmap.
- **Goals** — short & long term, milestones, deadlines, days-remaining,
  circular progress.
- **Study Planner** — weekly timetable, subject-hours breakdown, upcoming
  exams.
- **Journal** — mood-tagged daily entries with search.
- **Focus Mode** — Pomodoro timer (25/5, 50/10, custom), full-screen mode,
  session history.
- **Dark / light mode**, XP + level system, fully responsive with a mobile
  bottom nav.

## Data & persistence

All data lives in `localStorage` under the key `growth-rings:data:v1`. To
start fresh, clear your browser's site data for this app, or wire up the
`resetAll()` function exposed by `useStore()`.

## Upgrading later

The store (`lib/store.tsx`) is a single place that currently reads/writes
`localStorage`. To move to a real backend (e.g. Supabase or Firebase), swap
the `load()`/persistence `useEffect` for API calls — the rest of the app
only talks to `useStore()` and won't need to change.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts · lucide-react
