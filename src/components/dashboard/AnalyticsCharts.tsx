"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = ["#FF5A1F", "#00E676", "#3B82F6", "#A855F7", "#F59E0B"];

export function DepositWithdrawalBarChart({
  deposits,
  withdrawals,
}: {
  deposits: number;
  withdrawals: number;
}) {
  const data = [
    { name: "Deposits", amount: deposits },
    { name: "Withdrawals", amount: withdrawals },
  ];

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold">Deposit vs Withdrawal</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Completed liquidity comparison
          </p>
        </div>
        <span className="rounded-full bg-[#00E676]/15 px-3 py-1 text-[11px] font-bold text-[#00E676]">
          LIVE
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={46}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                borderRadius: "14px",
                fontSize: "12px",
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]}
            />
            <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
              <Cell fill="#00E676" />
              <Cell fill="#FF5A1F" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DistributionPieChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: { name: string; value: number }[];
}) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className="mb-3">
        <h3 className="text-base font-bold">{title}</h3>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-52 items-center justify-center text-xs text-[var(--text-muted)]">
          No data available yet.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="h-52 w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "14px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full sm:w-1/2 space-y-2">
            {data.map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="font-semibold capitalize">
                    {item.name.replace("_", " ")}
                  </span>
                </div>
                <span className="font-bold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

