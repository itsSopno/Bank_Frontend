"use client";

import { useState } from "react";
import {
  Landmark,
  Plus,
  CheckCircle,
  XCircle,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetMyLoansQuery,
  useGetAllLoansQuery,
  useApplyLoanMutation,
  useStaffReviewLoanMutation,
  useAdminReviewLoanMutation,
  useRepayLoanMutation,
} from "@/store/api/bankingApi";

export default function LoansPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { accounts } = useAppSelector((state) => state.account);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "bank_staff";
  const isCustomer = user?.role === "customer";

  const { data: myLoansData } = useGetMyLoansQuery(undefined, {
    skip: !isCustomer,
  });
  const { data: allLoansData } = useGetAllLoansQuery(
    { page: 1, limit: 30 },
    { skip: isCustomer }
  );

  const [applyLoan, { isLoading: isApplying }] = useApplyLoanMutation();
  const [staffReview] = useStaffReviewLoanMutation();
  const [adminReview] = useAdminReviewLoanMutation();
  const [repayLoan, { isLoading: isRepaying }] = useRepayLoanMutation();

  const [showApply, setShowApply] = useState(false);
  const [applyForm, setApplyForm] = useState({
    accountId: accounts[0]?.id || 0,
    loanType: "personal" as "personal" | "home" | "business" | "education",
    requestedAmount: "",
    durationMonths: "12",
    monthlyIncome: "",
    employmentStatus: "Employed",
    applicationDescription: "",
  });

  const [staffNoteModal, setStaffNoteModal] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState("");

  const [repayLoanModal, setRepayLoanModal] = useState<string | null>(null);
  const [repayForm, setRepayForm] = useState({
    accountId: accounts[0]?.id || 0,
    amount: "",
    pin: "",
  });

  const [feedback, setFeedback] = useState("");

  const loans = isCustomer
    ? myLoansData?.loans || []
    : allLoansData?.loans || [];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyLoan({
        accountId: applyForm.accountId || accounts[0]?.id,
        loanType: applyForm.loanType,
        requestedAmount: Number(applyForm.requestedAmount),
        durationMonths: Number(applyForm.durationMonths),
        monthlyIncome: Number(applyForm.monthlyIncome),
        employmentStatus: applyForm.employmentStatus,
        applicationDescription: applyForm.applicationDescription || undefined,
      }).unwrap();
      setShowApply(false);
      setFeedback("Loan application submitted successfully!");
    } catch (err: any) {
      setFeedback(err?.data?.message || "Failed to apply for loan.");
    }
  };

  const handleStaffReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffNoteModal) return;
    await staffReview({
      id: staffNoteModal,
      internalNotes,
      forwardToAdmin: true,
    }).unwrap();
    setStaffNoteModal(null);
    setInternalNotes("");
    setFeedback("Notes saved and forwarded to Admin for final approval.");
  };

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayLoanModal) return;
    try {
      const res = await repayLoan({
        id: repayLoanModal,
        accountId: repayForm.accountId || accounts[0]?.id,
        amount: Number(repayForm.amount),
        transactionPin: repayForm.pin,
      }).unwrap();
      setRepayLoanModal(null);
      setRepayForm({ accountId: accounts[0]?.id || 0, amount: "", pin: "" });
      setFeedback(res.message);
    } catch (err: any) {
      setFeedback(err?.data?.message || "Repayment failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {isCustomer ? "My Loans & Applications" : "Loan Management"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isCustomer
              ? "Apply for personal, home, or business loans and manage EMI repayments"
              : isStaff
              ? "Review customer loan applications and forward with internal notes"
              : "Approve, disburse, or reject loan applications"}
          </p>
        </div>

        {isCustomer && (
          <button
            onClick={() => setShowApply(!showApply)}
            className="flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Apply for Loan
          </button>
        )}
      </div>

      {feedback && (
        <div className="rounded-2xl border border-[#00E676]/40 bg-[#00E676]/10 p-4 text-xs font-semibold text-[#00E676]">
          {feedback}
        </div>
      )}

      {/* Customer Apply Loan Form */}
      {showApply && isCustomer && (
        <form
          onSubmit={handleApply}
          className="grid grid-cols-1 gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Disbursement Account
            </label>
            <select
              value={applyForm.accountId || accounts[0]?.id || ""}
              onChange={(e) =>
                setApplyForm({
                  ...applyForm,
                  accountId: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType.toUpperCase()} ({acc.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Loan Type
            </label>
            <select
              value={applyForm.loanType}
              onChange={(e) =>
                setApplyForm({ ...applyForm, loanType: e.target.value as any })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            >
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="business">Business Loan</option>
              <option value="education">Education Loan</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Requested Amount ($)
            </label>
            <input
              type="number"
              required
              min={100}
              value={applyForm.requestedAmount}
              onChange={(e) =>
                setApplyForm({ ...applyForm, requestedAmount: e.target.value })
              }
              placeholder="e.g. 10000"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Duration (Months)
            </label>
            <input
              type="number"
              required
              min={6}
              max={120}
              value={applyForm.durationMonths}
              onChange={(e) =>
                setApplyForm({ ...applyForm, durationMonths: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Monthly Income ($)
            </label>
            <input
              type="number"
              required
              min={100}
              value={applyForm.monthlyIncome}
              onChange={(e) =>
                setApplyForm({ ...applyForm, monthlyIncome: e.target.value })
              }
              placeholder="e.g. 5000"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Employment Status
            </label>
            <input
              type="text"
              required
              value={applyForm.employmentStatus}
              onChange={(e) =>
                setApplyForm({ ...applyForm, employmentStatus: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
            <button
              type="submit"
              disabled={isApplying}
              className="rounded-xl bg-[#FF5A1F] px-6 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              {isApplying ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={() => setShowApply(false)}
              className="rounded-xl border border-[var(--border-subtle)] px-6 py-2.5 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Staff Internal Notes Modal */}
      {staffNoteModal && isStaff && (
        <form
          onSubmit={handleStaffReview}
          className="rounded-3xl border border-[#FF5A1F]/40 bg-[var(--bg-surface)] p-6 space-y-3"
        >
          <h3 className="text-sm font-bold">
            Add Staff Review Notes for {staffNoteModal}
          </h3>
          <textarea
            required
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Income & credit verification remarks..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-[#00E676] px-5 py-2 text-xs font-bold text-black cursor-pointer"
            >
              Save & Forward to Admin
            </button>
            <button
              type="button"
              onClick={() => setStaffNoteModal(null)}
              className="rounded-xl border border-[var(--border-subtle)] px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Customer Repay Loan Modal */}
      {repayLoanModal && isCustomer && (
        <form
          onSubmit={handleRepay}
          className="grid grid-cols-1 gap-4 rounded-3xl border border-[#00E676]/40 bg-[var(--bg-surface)] p-6 sm:grid-cols-4 items-end"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Pay From Account
            </label>
            <select
              value={repayForm.accountId || accounts[0]?.id || ""}
              onChange={(e) =>
                setRepayForm({
                  ...repayForm,
                  accountId: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType.toUpperCase()} (${Number(acc.balance).toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Amount ($)
            </label>
            <input
              type="number"
              required
              min={1}
              step="0.01"
              value={repayForm.amount}
              onChange={(e) =>
                setRepayForm({ ...repayForm, amount: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Transaction PIN
            </label>
            <input
              type="password"
              required
              maxLength={4}
              value={repayForm.pin}
              onChange={(e) =>
                setRepayForm({ ...repayForm, pin: e.target.value })
              }
              placeholder="••••"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isRepaying}
              className="flex-1 rounded-xl bg-[#00E676] py-2.5 text-xs font-bold text-black cursor-pointer"
            >
              Pay Now
            </button>
            <button
              type="button"
              onClick={() => setRepayLoanModal(null)}
              className="rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Loans List */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {loans.length === 0 ? (
          <div className="md:col-span-2 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12 text-center text-sm text-[var(--text-muted)]">
            No loan applications found.
          </div>
        ) : (
          loans.map((loan) => (
            <div
              key={loan.id}
              className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A1F]/15 text-[#FF5A1F]">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono">{loan.loanId}</p>
                      <p className="text-[11px] text-[var(--text-muted)] capitalize">
                        {loan.loanType} Loan • {loan.durationMonths} Months
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                      loan.status === "active" || loan.status === "completed"
                        ? "bg-[#00E676]/15 text-[#00E676]"
                        : loan.status === "rejected"
                        ? "bg-red-500/15 text-red-500"
                        : "bg-amber-500/15 text-amber-500"
                    }`}
                  >
                    {loan.status.replace("_", " ")}
                  </span>
                </div>

                {loan.userName && (
                  <p className="mt-3 text-xs font-semibold">
                    Applicant: {loan.userName} ({loan.userEmail})
                  </p>
                )}

                <div className="my-4 grid grid-cols-2 gap-3 rounded-2xl bg-[var(--bg-elevated)] p-4 text-xs">
                  <div>
                    <span className="text-[var(--text-muted)]">Requested</span>
                    <p className="text-base font-bold">
                      ${Number(loan.requestedAmount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">
                      {loan.remainingBalance ? "Remaining Balance" : "Monthly Income"}
                    </span>
                    <p className="text-base font-bold text-[#00E676]">
                      $
                      {Number(
                        loan.remainingBalance || loan.monthlyIncome
                      ).toLocaleString()}
                    </p>
                  </div>
                  {loan.monthlyInstallment && (
                    <div>
                      <span className="text-[var(--text-muted)]">Monthly EMI</span>
                      <p className="font-bold">
                        ${Number(loan.monthlyInstallment).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-[var(--text-muted)]">Interest Rate</span>
                    <p className="font-bold">{loan.interestRate}%</p>
                  </div>
                </div>

                {loan.internalNotes && (
                  <p className="mb-3 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-500">
                    <strong>Staff Note:</strong> {loan.internalNotes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {isCustomer && loan.status === "active" && (
                  <button
                    onClick={() => {
                      setRepayLoanModal(loan.loanId);
                      setRepayForm({
                        accountId: accounts[0]?.id || 0,
                        amount: loan.monthlyInstallment || "500",
                        pin: "",
                      });
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00E676] py-2.5 text-xs font-bold text-black cursor-pointer"
                  >
                    <DollarSign className="h-3.5 w-3.5" /> Pay Installment
                  </button>
                )}

                {isStaff &&
                  (loan.status === "pending" || loan.status === "under_review") && (
                    <button
                      onClick={() => setStaffNoteModal(loan.loanId)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#FF5A1F] py-2.5 text-xs font-bold text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Review & Forward
                    </button>
                  )}

                {isAdmin &&
                  (loan.status === "pending" || loan.status === "under_review") && (
                    <>
                      <button
                        onClick={() =>
                          adminReview({
                            id: loan.loanId,
                            action: "approve",
                          })
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00E676] py-2.5 text-xs font-bold text-black cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve & Disburse
                      </button>
                      <button
                        onClick={() =>
                          adminReview({
                            id: loan.loanId,
                            action: "reject",
                            rejectionReason: "Credit eligibility requirements not met",
                          })
                        }
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

