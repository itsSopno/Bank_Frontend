"use client";

import { useState } from "react";
import {
  Wallet,
  Download,
  Lock,
  Unlock,
  Plus,
  Sliders,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetMyAccountsQuery,
  useGetAllAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountStatusMutation,
  useUpdateAccountLimitsMutation,
} from "@/store/api/bankingApi";

export default function AccountsPage() {
  const { user, token } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "bank_staff";
  const isStaffOrAdmin = isAdmin || isStaff;

  const { data: myAccData } = useGetMyAccountsQuery(undefined, {
    skip: isStaffOrAdmin,
  });
  const { data: allAccData } = useGetAllAccountsQuery(
    { page: 1, limit: 50 },
    { skip: !isStaffOrAdmin }
  );

  const [createAccount] = useCreateAccountMutation();
  const [updateStatus] = useUpdateAccountStatusMutation();
  const [updateLimits] = useUpdateAccountLimitsMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [newAccForm, setNewAccForm] = useState({
    userId: "",
    accountType: "savings" as "savings" | "current" | "business",
    initialDeposit: "0",
  });

  const [editingLimitAccId, setEditingLimitAccId] = useState<number | null>(
    null
  );
  const [limitForm, setLimitForm] = useState({
    dailyTransferLimit: "50000",
    maxSingleTransactionLimit: "25000",
    minBalance: "500",
  });

  const accounts = isStaffOrAdmin
    ? allAccData?.accounts || []
    : myAccData?.accounts || [];

  const handleDownloadStatementCSV = async (accountId: number, accNum: string) => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(
      `${apiBase}/accounts/${accountId}/statement?format=csv`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${accNum}.csv`;
    a.click();
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount({
      userId: Number(newAccForm.userId),
      accountType: newAccForm.accountType,
      initialDeposit: Number(newAccForm.initialDeposit),
    }).unwrap();
    setShowCreate(false);
    setNewAccForm({ userId: "", accountType: "savings", initialDeposit: "0" });
  };

  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLimitAccId) return;
    await updateLimits({
      id: editingLimitAccId,
      dailyTransferLimit: Number(limitForm.dailyTransferLimit),
      maxSingleTransactionLimit: Number(limitForm.maxSingleTransactionLimit),
      minBalance: Number(limitForm.minBalance),
    }).unwrap();
    setEditingLimitAccId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {isStaffOrAdmin ? "Bank Accounts Management" : "My Bank Accounts"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isStaffOrAdmin
              ? "Manage customer accounts, statuses, and transaction limits"
              : "View balances, account details, and export statements"}
          </p>
        </div>

        {isStaffOrAdmin && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Open New Account
          </button>
        )}
      </div>

      {/* Create Account Modal / Form */}
      {showCreate && isStaffOrAdmin && (
        <form
          onSubmit={handleCreateAccount}
          className="grid grid-cols-1 gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:grid-cols-4 items-end"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Customer User ID
            </label>
            <input
              type="number"
              required
              value={newAccForm.userId}
              onChange={(e) =>
                setNewAccForm({ ...newAccForm, userId: e.target.value })
              }
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Account Type
            </label>
            <select
              value={newAccForm.accountType}
              onChange={(e) =>
                setNewAccForm({
                  ...newAccForm,
                  accountType: e.target.value as any,
                })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Initial Deposit ($)
            </label>
            <input
              type="number"
              min={0}
              value={newAccForm.initialDeposit}
              onChange={(e) =>
                setNewAccForm({ ...newAccForm, initialDeposit: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#00E676] py-2.5 text-xs font-bold text-black cursor-pointer"
          >
            Create Account
          </button>
        </form>
      )}

      {/* Limit Editor for Admin */}
      {editingLimitAccId && isAdmin && (
        <form
          onSubmit={handleSaveLimits}
          className="grid grid-cols-1 gap-4 rounded-3xl border border-[#FF5A1F]/40 bg-[var(--bg-surface)] p-6 sm:grid-cols-4 items-end"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Daily Transfer Limit ($)
            </label>
            <input
              type="number"
              value={limitForm.dailyTransferLimit}
              onChange={(e) =>
                setLimitForm({
                  ...limitForm,
                  dailyTransferLimit: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Max Single Txn ($)
            </label>
            <input
              type="number"
              value={limitForm.maxSingleTransactionLimit}
              onChange={(e) =>
                setLimitForm({
                  ...limitForm,
                  maxSingleTransactionLimit: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Min Balance ($)
            </label>
            <input
              type="number"
              value={limitForm.minBalance}
              onChange={(e) =>
                setLimitForm({ ...limitForm, minBalance: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#FF5A1F] py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingLimitAccId(null)}
              className="rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all hover:border-[#FF5A1F]/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00E676]/15 text-[#00E676]">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {acc.accountType}
                    </span>
                    {acc.userName && (
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {acc.userName}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                    acc.status === "active"
                      ? "bg-[#00E676]/15 text-[#00E676]"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {acc.status}
                </span>
              </div>

              <div className="my-5">
                <p className="text-3xl font-extrabold tracking-tight">
                  ${Number(acc.balance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                  A/C: {acc.accountNumber}
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-3">
                <div className="flex justify-between">
                  <span>Daily Limit:</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    ${Number(acc.dailyTransferLimit).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Single Txn Limit:</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    ${Number(acc.maxSingleTransactionLimit).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Min Balance:</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    ${Number(acc.minBalance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleDownloadStatementCSV(acc.id, acc.accountNumber)
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold hover:border-[#FF5A1F] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> CSV Statement
              </button>

              {isStaffOrAdmin && (
                <button
                  onClick={() =>
                    updateStatus({
                      id: acc.id,
                      status: acc.status === "active" ? "frozen" : "active",
                    })
                  }
                  className={`flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer ${
                    acc.status === "active"
                      ? "bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white"
                      : "bg-[#00E676]/15 text-[#00E676] hover:bg-[#00E676] hover:text-black"
                  }`}
                >
                  {acc.status === "active" ? (
                    <>
                      <Lock className="h-3.5 w-3.5" /> Freeze
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3.5 w-3.5" /> Unfreeze
                    </>
                  )}
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingLimitAccId(acc.id);
                    setLimitForm({
                      dailyTransferLimit: acc.dailyTransferLimit,
                      maxSingleTransactionLimit: acc.maxSingleTransactionLimit,
                      minBalance: acc.minBalance,
                    });
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-xs font-semibold hover:border-[#FF5A1F] cursor-pointer"
                >
                  <Sliders className="h-3.5 w-3.5" /> Limits
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

