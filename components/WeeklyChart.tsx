"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WeeklyChart({
  data,
}: {
  data: { day: string; tasks: number; habits: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--ink-soft)", fontSize: 12 }}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12,
          }}
          cursor={{ fill: "var(--surface-2)" }}
        />
        <Bar dataKey="tasks" name="Tasks done" fill="#3f6b4f" radius={[6, 6, 0, 0]} />
        <Bar dataKey="habits" name="Habits done" fill="#d9a441" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
