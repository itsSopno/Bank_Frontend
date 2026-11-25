"use client";

import { useState } from "react";
import { MoreVertical, Copy, Check, ChevronDown } from "lucide-react";
import type { BankAccount } from "@/types/banking";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAccount } from "@/store/slices/accountSlice";

interface EmeraldBalanceCardProps {
  accounts: BankAccount[];
  holderName: string;
}

export default function EmeraldBalanceCard({
  accounts,
  holderName,
}: EmeraldBalanceCardProps) {
  const dispatch = useAppDispatch();
  const { selectedAccountId } = useAppSelector((state) => state.account);
  const [copied, setCopied] = useState(false);

  const activeAccount =
    accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleCopy = () => {
    if (!activeAccount) return;
    navigator.clipboard.writeText(activeAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeAccount) {
    return (
      <div className="flex flex-col justify-between rounded-3xl bg-[#00E676] p-6 text-[#0A0A0C] shadow-xl shadow-[#00E676]/20">
        <p className="text-sm font-semibold">No Bank Account Found</p>
        <p className="text-xs opacity-75">
          Contact bank staff to open your first account.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between rounded-3xl bg-[#00E676] p-6 text-[#0A0A0C] shadow-xl shadow-[#00E676]/20 overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-xl" />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-85">
            {activeAccount.accountType} Account
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              activeAccount.status === "active"
                ? "bg-black/15 text-black"
                : "bg-red-600 text-white"
            }`}
          >
            {activeAccount.status}
          </span>
        </div>

        {/* Account Switcher if user has > 1 accounts */}
        {accounts.length > 1 ? (
          <div className="relative">
            <select
              value={activeAccount.id}
              onChange={(e) => dispatch(selectAccount(Number(e.target.value)))}
              className="appearance-none rounded-full bg-black/10 py-1 pl-3 pr-7 text-xs font-bold text-black focus:outline-none cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType.toUpperCase()} ••{acc.accountNumber.slice(-4)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
          </div>
        ) : (
          <button
            onClick={handleCopy}
            title="Copy Account Number"
            className="rounded-full p-1.5 hover:bg-black/10 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Main Balance */}
      <div className="my-5">
        <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          ${" "}
          {Number(activeAccount.balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <button
          onClick={handleCopy}
          className="mt-2 flex items-center gap-1.5 text-xs font-mono font-semibold opacity-80 hover:opacity-100"
        >
          <span>{activeAccount.accountNumber}</span>
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Cardholder Footer */}
      <div className="flex items-center justify-between border-t border-black/10 pt-3">
        <span className="text-xs font-bold uppercase tracking-widest">
          {holderName}
        </span>
        <span className="text-[10px] font-bold uppercase opacity-75">
          Limit: ${Number(activeAccount.dailyTransferLimit).toLocaleString()}/day
        </span>
      </div>
    </div>
  );
}

