"use client";

import React from "react";

interface GrowthRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  rings?: boolean; // draw faint concentric tree-rings behind the progress arc
}

export default function GrowthRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = "#3f6b4f",
  trackColor,
  label,
  sublabel,
  rings = true,
}: GrowthRingProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const innerRingCount = 3;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {rings &&
          Array.from({ length: innerRingCount }).map((_, i) => {
            const r = radius - strokeWidth * (i + 1) * 1.3;
            if (r <= 4) return null;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={trackColor ?? "currentColor"}
                strokeOpacity={0.06 + i * 0.02}
                strokeWidth={1}
              />
            );
          })}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "currentColor"}
          strokeOpacity={0.1}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={
            {
              "--ring-full": circumference,
              "--ring-offset": offset,
            } as React.CSSProperties
          }
          className="animate-grow"
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && (
            <span className="mono-num text-lg font-semibold leading-none">{label}</span>
          )}
          {sublabel && (
            <span className="text-[11px] mt-1 text-[var(--ink-soft)] leading-none">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
