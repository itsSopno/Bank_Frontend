"use client";

import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Landmark,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetAdminAnalyticsQuery,
  useGetCustomerAnalyticsQuery,
  useGetStaffAnalyticsQuery,
  useGetTransactionsQuery,
  useGetMyNotificationsQuery,
  useGetMyLoansQuery,
} from "@/store/api/bankingApi";
import CircularProgressCard from "@/components/dashboard/CircularProgressCard";
import CashflowWaveChart from "@/components/dashboard/CashflowWaveChart";
import EmeraldBalanceCard from "@/components/dashboard/EmeraldBalanceCard";
import { downloadTransactionReceiptPDF } from "@/utils/pdfExport";

export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { accounts } = useAppSelector((state) => state.account);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "bank_staff";
  const isCustomer = user?.role === "customer";

  const { data: adminData } = useGetAdminAnalyticsQuery(undefined, {
    skip: !isAdmin,
  });
  const { data: customerData } = useGetCustomerAnalyticsQuery(undefined, {
    skip: !isCustomer,
  });
  const { data: staffData } = useGetStaffAnalyticsQuery(undefined, {
    skip: !isStaff,
  });

  const { data: txnData } = useGetTransactionsQuery({ page: 1, limit: 5 });
  const { data: notifData } = useGetMyNotificationsQuery();
  const { data: myLoansData } = useGetMyLoansQuery(undefined, {
    skip: !isCustomer,
  });

  const recentTxns = txnData?.transactions || [];
  const recentNotifs = notifData?.notifications?.slice(0, 4) || [];

  // ==============================
  // ADMIN DASHBOARD VIEW
  // ==============================
  if (isAdmin) {
    const analytics = adminData?.analytics;
    const chartData = (analytics?.monthlyTransactionVolume || []).map(
      (item: any) => ({
        name: item.month,
        value: Number(item.volume),
      })
    );

    return (
      <div className="space-y-6">
        {/* Top Row Bento Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <CircularProgressCard
            title="Total Bank Reserve"
            amount={analytics?.totalBankBalance || 0}
            percentage={78}
            subtitle={`${analytics?.totalAccounts || 0} Active Bank Accounts`}
            accentColor="orange"
          />
          <CircularProgressCard
            title="Registered Customers"
            amount={String(analytics?.totalCustomers || 0)}
            percentage={65}
            subtitle="Verified Active Profiles"
            accentColor="emerald"
          />
          <CircularProgressCard
            title="Total Transactions"
            amount={Number(analytics?.totalTransactions || 0).toLocaleString()}
            percentage={92}
            subtitle={`${analytics?.pendingLoans || 0} Pending Loan Applications`}
            accentColor="orange"
          />
        </div>

        {/* Middle Row: Wave Chart + Bright Emerald System Card */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CashflowWaveChart
              title="Bank-Wide Monthly Transaction Volume"
              percentageLabel={`${Number(
                analytics?.totalTransactions || 0
              ).toLocaleString()} TXNs`}
              dateLabel="12-Month Trend"
              data={chartData}
            />
          </div>

          {/* Signature Emerald Green Summary Card */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#00E676] p-6 text-[#0A0A0C] shadow-xl shadow-[#00E676]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">
                Liquidity & Operations
              </span>
              <span className="rounded-full bg-black/15 px-3 py-1 text-[10px] font-bold">
                LIVE
              </span>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <p className="text-xs font-semibold opacity-75">Total Deposits</p>
                <p className="text-2xl font-extrabold">
                  ${Number(analytics?.totalDeposits || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold opacity-75">
                  Total Withdrawals
                </p>
                <p className="text-xl font-bold">
                  ${Number(analytics?.totalWithdrawals || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/15 pt-3 text-xs font-bold">
              <span>Pending Requests: {analytics?.pendingRequests || 0}</span>
              <Link href="/dashboard/reviews" className="underline">
                Review All →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent System History + Account Distribution */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Transactions</h2>
              <Link
                href="/dashboard/transactions"
                className="text-xs font-semibold text-[#FF5A1F] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {recentTxns.map((txn) => (
                <div
                  key={txn.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F]">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{txn.transactionId}</p>
                      <p className="text-[11px] text-[var(--text-muted)] capitalize">
                        {txn.transactionType.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-bold">
                    ${Number(txn.amount).toLocaleString()}
                  </span>
                  <span className="rounded-full bg-[#FF5A1F] px-3 py-1 text-[11px] font-bold text-white capitalize">
                    {txn.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Distribution */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <h2 className="mb-4 text-lg font-bold">Account Distribution</h2>
            <div className="space-y-3">
              {(analytics?.accountDistribution || []).map((item: any) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3.5"
                >
                  <div>
                    <p className="text-xs font-bold uppercase">{item.type}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {item.count} accounts
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FF5A1F]/15 px-3 py-1 text-xs font-bold text-[#FF5A1F]">
                    ${Number(item.totalBalance).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // BANK STAFF DASHBOARD VIEW
  // ==============================
  if (isStaff) {
    const sAnalytics = staffData?.analytics;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <CircularProgressCard
            title="Pending Deposit/Withdraw"
            amount={String(sAnalytics?.pendingDepositWithdrawalRequests || 0)}
            percentage={60}
            subtitle="Requires staff verification"
            accentColor="orange"
          />
          <CircularProgressCard
            title="Pending Loan Reviews"
            amount={String(sAnalytics?.pendingLoanApplications || 0)}
            percentage={45}
            subtitle="Add notes & forward to Admin"
            accentColor="emerald"
          />
          <CircularProgressCard
            title="Flagged Transactions"
            amount={String(sAnalytics?.flaggedSuspiciousTransactions || 0)}
            percentage={30}
            subtitle="Suspicious activity alerts"
            accentColor="orange"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Link
            href="/dashboard/reviews"
            className="flex items-center justify-between rounded-3xl bg-[#00E676] p-6 text-[#0A0A0C] shadow-lg hover:opacity-95 transition-opacity"
          >
            <div>
              <Clock className="h-8 w-8 mb-2" />
              <h3 className="text-xl font-bold">Review Pending Requests</h3>
              <p className="text-xs font-medium opacity-80">
                Approve or reject customer deposit & withdrawal requests
              </p>
            </div>
            <span className="text-2xl font-bold">→</span>
          </Link>

          <Link
            href="/dashboard/loans"
            className="flex items-center justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 hover:border-[#FF5A1F] transition-colors"
          >
            <div>
              <ShieldAlert className="h-8 w-8 mb-2 text-[#FF5A1F]" />
              <h3 className="text-xl font-bold">Loan Assistance</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Review loan applications, add internal notes & forward
              </p>
            </div>
            <span className="text-2xl font-bold text-[#FF5A1F]">→</span>
          </Link>
        </div>
      </div>
    );
  }

  // ==============================
  // CUSTOMER DASHBOARD VIEW (MATCHES REFERENCE SCREENSHOT)
  // ==============================
  const cAnalytics = customerData?.analytics;
  const waveChartData = (cAnalytics?.monthlySpending || []).map((m: any) => ({
    name: m.month,
    value: Number(m.amount),
  }));

  const activeLoansCount = (myLoansData?.loans || []).filter(
    (l) => l.status === "active"
  ).length;

  return (
    <div className="space-y-6">
      {/* TOP ROW BENTO: Ring Card 1 + Ring Card 2 + "+ ADD / Transfer" Card */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-5">
          <CircularProgressCard
            title="Total Sent"
            amount={cAnalytics?.totalSent || 0}
            percentage={50}
            subtitle="Outgoing transfers & payments"
            accentColor="orange"
          />
        </div>

        <div className="md:col-span-5">
          <CircularProgressCard
            title="Total Received"
            amount={cAnalytics?.totalReceived || 0}
            percentage={68}
            subtitle="Deposits & incoming transfers"
            accentColor="emerald"
          />
        </div>

        {/* Sleek "+ ADD / Send" Quick Action Card (Matching right-top card in screenshot) */}
        <Link
          href="/dashboard/transfer"
          className="md:col-span-2 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-center hover:border-[#FF5A1F] hover:bg-[#FF5A1F]/5 transition-all group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-elevated)] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
            <Plus className="h-5 w-5" />
          </div>
          <span className="mt-2 text-xs font-bold tracking-wider uppercase">
            Transfer
          </span>
        </Link>
      </div>

      {/* MIDDLE ROW: Glowing Orange Wave Chart + Signature Emerald Green Card */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <CashflowWaveChart
            title="Monthly Spending Overview"
            percentageLabel={`$${Number(
              cAnalytics?.totalSent || 0
            ).toLocaleString()}`}
            dateLabel="Recent Activity"
            data={waveChartData}
          />
        </div>

        <div className="lg:col-span-5">
          <EmeraldBalanceCard
            accounts={accounts}
            holderName={user?.name || "CUSTOMER"}
          />
        </div>
      </div>

      {/* BOTTOM ROW: "History" Table + "Recent Activities" Feed */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: History (Matching screenshot bottom-left) */}
        <div className="lg:col-span-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">History</h2>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-[#FF5A1F] hover:underline"
            >
              See All →
            </Link>
          </div>

          {recentTxns.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-muted)]">
              No transactions yet. Try sending money or making a deposit!
            </p>
          ) : (
            <div className="space-y-3">
              {recentTxns.map((txn) => (
                <div
                  key={txn.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        txn.transactionType === "deposit"
                          ? "bg-[#00E676]/15 text-[#00E676]"
                          : "bg-[#FF5A1F]/15 text-[#FF5A1F]"
                      }`}
                    >
                      {txn.transactionType === "deposit" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{txn.transactionId}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[140px]">
                        {txn.description ||
                          txn.transactionType.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-sm font-bold">
                    ${Number(txn.amount).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FF5A1F] px-3.5 py-1 text-[11px] font-bold text-white capitalize">
                      {txn.status}
                    </span>
                    <button
                      onClick={() => downloadTransactionReceiptPDF(txn)}
                      title="Download PDF Receipt"
                      className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[#FF5A1F]"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Activities & Loans (Matching screenshot bottom-right) */}
        <div className="lg:col-span-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Activities</h2>
              <span className="rounded-full bg-[#00E676]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#00E676]">
                {activeLoansCount} Active Loans
              </span>
            </div>

            <div className="space-y-3">
              {recentNotifs.length === 0 ? (
                <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                  No recent alerts.
                </p>
              ) : (
                recentNotifs.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        <Landmark className="h-4 w-4 text-[#FF5A1F]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{n.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                          {n.message}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#FF5A1F] px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                      {n.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/dashboard/loans"
            className="mt-4 block w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2.5 text-center text-xs font-bold hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors"
          >
            Apply or Manage Loans →
          </Link>
        </div>
      </div>
    </div>
  );
}

