"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useRequestDepositWithdrawalMutation } from "@/store/api/bankingApi";

export default function DepositWithdrawPage() {
  const { accounts } = useAppSelector((state) => state.account);
  const [accountId, setAccountId] = useState<number>(accounts[0]?.id || 0);
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const [submitRequest, { isLoading }] = useRequestDepositWithdrawalMutation();
  const activeAccountId = accountId || accounts[0]?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!activeAccountId) return;

    try {
      const res = await submitRequest({
        accountId: activeAccountId,
        type,
        amount: Number(amount),
        description: description.trim() || undefined,
      }).unwrap();

      setFeedback({ ok: true, text: res.message });
      setAmount("");
      setDescription("");
    } catch (err: any) {
      setFeedback({
        ok: false,
        text: err?.data?.message || "Failed to submit request.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Deposit & Withdrawal Requests</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Submit a simulated deposit or withdrawal request for staff/admin
          approval.
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-2xl border p-4 text-xs font-semibold ${
            feedback.ok
              ? "border-[#00E676]/40 bg-[#00E676]/10 text-[#00E676]"
              : "border-red-500/30 bg-red-500/10 text-red-500"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
      >
        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType("deposit")}
            className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-bold transition-all cursor-pointer ${
              type === "deposit"
                ? "border-[#00E676] bg-[#00E676]/15 text-[#00E676]"
                : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
            }`}
          >
            <ArrowDownCircle className="h-4 w-4" /> Deposit
          </button>

          <button
            type="button"
            onClick={() => setType("withdrawal")}
            className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-bold transition-all cursor-pointer ${
              type === "withdrawal"
                ? "border-[#FF5A1F] bg-[#FF5A1F]/15 text-[#FF5A1F]"
                : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
            }`}
          >
            <ArrowUpCircle className="h-4 w-4" /> Withdrawal
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
            Select Account
          </label>
          <select
            value={activeAccountId || ""}
            onChange={(e) => setAccountId(Number(e.target.value))}
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#FF5A1F] focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountType.toUpperCase()} ({acc.accountNumber}) — $
                {Number(acc.balance).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
            Amount ($)
          </label>
          <input
            type="number"
            required
            min={1}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-bold focus:border-[#FF5A1F] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Reason or source of funds"
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#FF5A1F] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-[#FF5A1F] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] disabled:opacity-60 cursor-pointer"
        >
          {isLoading
            ? "Submitting..."
            : `Submit ${type === "deposit" ? "Deposit" : "Withdrawal"} Request`}
        </button>
      </form>
    </div>
  );
}

