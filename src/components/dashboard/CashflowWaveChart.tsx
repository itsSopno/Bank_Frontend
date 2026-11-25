"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ChartDataPoint {
  name: string;
  value: number;
}

interface CashflowWaveChartProps {
  title?: string;
  percentageLabel?: string;
  dateLabel?: string;
  data: ChartDataPoint[];
}

export default function CashflowWaveChart({
  title = "Monthly Volume",
  percentageLabel = "+18.4%",
  dateLabel = "Last 6 Months",
  data,
}: CashflowWaveChartProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold tracking-tight">
            {percentageLabel}
          </span>
          <p className="text-xs text-[var(--text-muted)]">{title}</p>
        </div>
        <span className="rounded-full bg-[var(--bg-elevated)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] border border-[var(--border-subtle)]">
          {dateLabel}
        </span>
      </div>

      <div className="h-44 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
            No chart data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="orangeGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5A1F" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FF5A1F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#16161A",
                  border: "1px solid #26262C",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [
                  `$${Number(val).toLocaleString()}`,
                  "Volume",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FF5A1F"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#orangeGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

