"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  Flag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setTransactionFilters,
  resetTransactionFilters,
} from "@/store/slices/transactionSlice";
import {
  useGetTransactionsQuery,
  useFlagTransactionMutation,
} from "@/store/api/bankingApi";
import { downloadTransactionReceiptPDF } from "@/utils/pdfExport";

function TransactionsContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const { user } = useAppSelector((state) => state.auth);
  const { filters } = useAppSelector((state) => state.transaction);
  const [flagMsg, setFlagMsg] = useState("");

  useEffect(() => {
    if (urlSearch) {
      dispatch(setTransactionFilters({ search: urlSearch, page: 1 }));
    }
  }, [urlSearch, dispatch]);

  const { data, isLoading, isFetching } = useGetTransactionsQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    type: filters.type,
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const [flagTransaction] = useFlagTransactionMutation();

  const isStaffOrAdmin = user?.role === "admin" || user?.role === "bank_staff";
  const txns = data?.transactions || [];
  const pagination = data?.pagination;

  const handleFlag = async (txnId: string) => {
    try {
      await flagTransaction({
        id: txnId,
        reason: "Flagged by staff/admin for suspicious activity review",
      }).unwrap();
      setFlagMsg(`Transaction ${txnId} flagged for admin review.`);
      setTimeout(() => setFlagMsg(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {pagination
              ? `Showing ${txns.length} of ${pagination.total.toLocaleString()} total records`
              : "Loading transaction ledger..."}
          </p>
        </div>

        <button
          onClick={() => dispatch(resetTransactionFilters())}
          className="flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold hover:border-[#FF5A1F] transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
        </button>
      </div>

      {flagMsg && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-500">
          {flagMsg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              dispatch(setTransactionFilters({ search: e.target.value, page: 1 }))
            }
            placeholder="Search TXN ID..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 pl-9 pr-3 text-xs focus:border-[#FF5A1F] focus:outline-none"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) =>
            dispatch(
              setTransactionFilters({ type: e.target.value as any, page: 1 })
            )
          }
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="fund_transfer">Fund Transfer</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="loan_disbursement">Loan Disbursement</option>
          <option value="loan_repayment">Loan Repayment</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(
              setTransactionFilters({ status: e.target.value as any, page: 1 })
            )
          }
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="reversed">Reversed</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            dispatch(
              setTransactionFilters({ startDate: e.target.value, page: 1 })
            )
          }
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-none"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            dispatch(setTransactionFilters({ endDate: e.target.value, page: 1 }))
          }
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-none"
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase">
              <tr>
                <th className="px-5 py-4 font-semibold">Transaction ID</th>
                <th className="px-5 py-4 font-semibold">Type</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Description</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm">
                    Loading transactions...
                  </td>
                </tr>
              ) : txns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-[var(--text-muted)]"
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                txns.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-[var(--bg-elevated)]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold">
                      {txn.transactionId}
                      {txn.isSuspicious && (
                        <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-500">
                          FLAGGED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 capitalize">
                      {txn.transactionType.replace("_", " ")}
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      ${Number(txn.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)]">
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                          txn.status === "completed"
                            ? "bg-[#00E676]/15 text-[#00E676]"
                            : txn.status === "pending"
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-red-500/15 text-red-500"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-[200px] truncate text-[var(--text-muted)]">
                      {txn.description || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => downloadTransactionReceiptPDF(txn)}
                        title="Download PDF Receipt"
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 hover:border-[#FF5A1F] hover:text-[#FF5A1F] cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>

                      {isStaffOrAdmin && !txn.isSuspicious && (
                        <button
                          onClick={() => handleFlag(txn.transactionId)}
                          title="Flag Suspicious"
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-500 hover:bg-amber-500 hover:text-white cursor-pointer"
                        >
                          <Flag className="h-3.5 w-3.5" /> Flag
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-6 py-4 text-xs">
            <span className="text-[var(--text-muted)]">
              Page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.totalPages.toLocaleString()}</strong>
              {isFetching && " (Updating...)"}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() =>
                  dispatch(setTransactionFilters({ page: pagination.page - 1 }))
                }
                className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] px-3 py-1.5 font-semibold disabled:opacity-40 hover:border-[#FF5A1F] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  dispatch(setTransactionFilters({ page: pagination.page + 1 }))
                }
                className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] px-3 py-1.5 font-semibold disabled:opacity-40 hover:border-[#FF5A1F] cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TransactionsHistoryPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-sm text-[var(--text-muted)]">Loading transactions...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}

