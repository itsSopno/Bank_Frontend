"use client";

interface CircularProgressCardProps {
  title: string;
  amount: string | number;
  percentage: number;
  subtitle: string;
  accentColor?: "orange" | "emerald";
}

export default function CircularProgressCard({
  title,
  amount,
  percentage,
  subtitle,
  accentColor = "orange",
}: CircularProgressCardProps) {
  const strokeColor = accentColor === "orange" ? "#FF5A1F" : "#00E676";
  const dotBg = accentColor === "orange" ? "bg-[#FF5A1F]" : "bg-[#00E676]";
  const clampedPct = Math.min(100, Math.max(0, percentage));

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className="flex items-center justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all hover:border-[#FF5A1F]/40">
      {/* Circular Progress Ring */}
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 76 76">
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-gray-200 dark:text-[#26262C]"
          />
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-bold">{clampedPct}%</span>
      </div>

      {/* Right Metrics */}
      <div className="flex-1 pl-5">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
          <span className={`h-2 w-2 rounded-full ${dotBg}`} />
          <span>{title}</span>
        </div>
        <div className="mt-1.5 text-2xl font-bold tracking-tight">
          {typeof amount === "number"
            ? `$${amount.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}`
            : amount}
        </div>
        <div className="mt-1 text-[11px] text-[var(--text-muted)]">{subtitle}</div>
      </div>
    </div>
  );
}

