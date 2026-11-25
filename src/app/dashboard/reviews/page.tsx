"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
  useGetPendingRequestsQuery,
  useReviewDepositWithdrawalMutation,
} from "@/store/api/bankingApi";

export default function PendingReviewsPage() {
  const { data, isLoading } = useGetPendingRequestsQuery();
  const [reviewRequest] = useReviewDepositWithdrawalMutation();
  const [feedback, setFeedback] = useState("");

  const requests = data?.requests || [];

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await reviewRequest({
        id,
        action,
        rejectionReason:
          action === "reject" ? "Rejected during staff verification" : undefined,
      }).unwrap();
      setFeedback(res.message);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err: any) {
      setFeedback(err?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Pending Deposit & Withdrawal Approvals
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          Verify and approve or reject customer simulated cash requests
        </p>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-[#00E676]/40 bg-[#00E676]/10 p-4 text-xs font-semibold text-[#00E676]">
          {feedback}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-sm">Loading pending queue...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 text-center">
          <Clock className="mx-auto mb-2 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-semibold">All caught up!</p>
          <p className="text-xs text-[var(--text-muted)]">
            No pending deposit or withdrawal requests at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                      req.type === "deposit"
                        ? "bg-[#00E676]/15 text-[#00E676]"
                        : "bg-[#FF5A1F]/15 text-[#FF5A1F]"
                    }`}
                  >
                    {req.type} Request
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="my-4">
                  <p className="text-2xl font-extrabold">
                    ${Number(req.amount).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs font-semibold">
                    {req.userName} ({req.userEmail})
                  </p>
                  <p className="text-[11px] font-mono text-[var(--text-muted)]">
                    Account: {req.accountNumber}
                  </p>
                  {req.description && (
                    <p className="mt-2 text-xs text-[var(--text-muted)] italic">
                      &ldquo;{req.description}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00E676] py-2.5 text-xs font-bold text-black cursor-pointer"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleAction(req.id, "reject")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500/15 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

