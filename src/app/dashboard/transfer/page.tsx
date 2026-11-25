"use client";

import { useState } from "react";
import {
  Send,
  KeyRound,
  CheckCircle2,
  Download,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useTransferFundsMutation } from "@/store/api/bankingApi";
import type { Transaction } from "@/types/banking";
import { downloadTransactionReceiptPDF } from "@/utils/pdfExport";

export default function FundTransferPage() {
  const { accounts } = useAppSelector((state) => state.account);
  const { selectedAccountId } = useAppSelector((state) => state.account);

  const [senderAccountId, setSenderAccountId] = useState<number>(
    selectedAccountId || accounts[0]?.id || 0
  );
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successTxn, setSuccessTxn] = useState<Transaction | null>(null);

  const [transferFunds, { isLoading }] = useTransferFundsMutation();

  const activeAccountId = senderAccountId || accounts[0]?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessTxn(null);

    if (!activeAccountId) {
      setErrorMsg("No active sender account selected.");
      return;
    }

    try {
      const res = await transferFunds({
        senderAccountId: activeAccountId,
        recipientAccountNumber: recipientAccountNumber.trim(),
        amount: Number(amount),
        description: description.trim() || undefined,
        transactionPin,
      }).unwrap();

      setSuccessTxn(res.transaction);
      setRecipientAccountNumber("");
      setAmount("");
      setDescription("");
      setTransactionPin("");
    } catch (err: any) {
      setErrorMsg(
        err?.data?.errors?.[0]?.message ||
          err?.data?.message ||
          "Fund transfer failed."
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Fund Transfer</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Send funds instantly between your accounts or to another NovaBank
          customer.
        </p>
      </div>

      {successTxn && (
        <div className="rounded-3xl border border-[#00E676]/40 bg-[#00E676]/10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-[#00E676] shrink-0" />
              <div>
                <h3 className="text-base font-bold text-[#00E676]">
                  Transfer Successful!
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Reference: <strong>{successTxn.transactionId}</strong> • Amount:{" "}
                  <strong>${Number(successTxn.amount).toLocaleString()}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => downloadTransactionReceiptPDF(successTxn)}
              className="flex items-center gap-2 rounded-full bg-[#00E676] px-4 py-2 text-xs font-bold text-black hover:opacity-90 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> PDF Receipt
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
            From Account
          </label>
          <select
            value={activeAccountId || ""}
            onChange={(e) => setSenderAccountId(Number(e.target.value))}
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#FF5A1F] focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountType.toUpperCase()} ({acc.accountNumber}) — Balance:
                ${Number(acc.balance).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Recipient Account Number
            </label>
            <button
              type="button"
              onClick={() => setRecipientAccountNumber("1003333333")}
              className="text-[11px] font-semibold text-[#FF5A1F] hover:underline"
            >
              Demo Recipient: 1003333333
            </button>
          </div>
          <input
            type="text"
            required
            value={recipientAccountNumber}
            onChange={(e) => setRecipientAccountNumber(e.target.value)}
            placeholder="Enter 10-digit account number"
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-mono focus:border-[#FF5A1F] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
              Transfer Amount ($)
            </label>
            <input
              type="number"
              required
              min={1}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-bold focus:border-[#FF5A1F] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
              4-Digit Transaction PIN
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                maxLength={4}
                pattern="\d{4}"
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                placeholder="••••"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm tracking-widest focus:border-[#FF5A1F] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
            Description / Note (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly Rent or Family Support"
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#FF5A1F] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] disabled:opacity-60 transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
          {isLoading ? "Processing Atomic Transfer..." : "Confirm & Transfer Funds"}
        </button>
      </form>
    </div>
  );
}

