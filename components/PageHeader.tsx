import React from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-moss-500 font-medium mb-1.5">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl md:text-[34px] leading-tight">{title}</h1>
        {description && (
          <p className="text-[var(--ink-soft)] mt-1.5 max-w-xl text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
