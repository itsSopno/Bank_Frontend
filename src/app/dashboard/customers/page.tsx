"use client";

import { useState } from "react";
import { Search, ShieldBan, CheckCircle, Eye, UserPlus } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetAllCustomersQuery,
  useUpdateCustomerStatusMutation,
  useGetCustomerByIdQuery,
  useRegisterMutation,
} from "@/store/api/bankingApi";

export default function CustomersManagementPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  const { data, isLoading } = useGetAllCustomersQuery({
    page: 1,
    limit: 30,
    search,
  });

  const { data: detailsData } = useGetCustomerByIdQuery(
    selectedCustomerId || 0,
    { skip: !selectedCustomerId }
  );

  const [updateStatus] = useUpdateCustomerStatusMutation();
  const [registerCustomer, { isLoading: isRegistering }] = useRegisterMutation();
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "Password123!",
    phone: "",
    address: "",
    transactionPin: "1234",
  });
  const [regMsg, setRegMsg] = useState("");
  const customers = data?.customers || [];

  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegMsg("");
    try {
      await registerCustomer({ ...regForm, role: "customer" }).unwrap();
      setShowRegister(false);
      setRegForm({
        name: "",
        email: "",
        password: "Password123!",
        phone: "",
        address: "",
        transactionPin: "1234",
      });
      setRegMsg("New customer registered with default Savings Account!");
    } catch (err: any) {
      setRegMsg(err?.data?.message || "Failed to register customer.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Directory</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Search customers, inspect account portfolios, and manage access
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2.5 pl-10 pr-4 text-xs focus:border-[#FF5A1F] focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Register Customer
          </button>
        </div>
      </div>

      {regMsg && (
        <div className="rounded-2xl border border-[#00E676]/40 bg-[#00E676]/10 p-3 text-xs font-semibold text-[#00E676]">
          {regMsg}
        </div>
      )}

      {showRegister && (
        <form
          onSubmit={handleRegisterCustomer}
          className="grid grid-cols-1 gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:grid-cols-3"
        >
          <input
            type="text"
            required
            placeholder="Full Name"
            value={regForm.name}
            onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={regForm.email}
            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={regForm.phone}
            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Address"
            value={regForm.address}
            onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Initial Password"
            value={regForm.password}
            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isRegistering}
              className="flex-1 rounded-xl bg-[#00E676] px-4 py-2 text-xs font-bold text-black cursor-pointer"
            >
              {isRegistering ? "Creating..." : "Create Customer"}
            </button>
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className="rounded-xl border border-[var(--border-subtle)] px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Customer Details Drawer / Card */}
      {selectedCustomerId && detailsData?.customer && (
        <div className="rounded-3xl border border-[#FF5A1F]/40 bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{detailsData.customer.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                {detailsData.customer.email} • {detailsData.customer.phone || "No Phone"}
              </p>
            </div>
            <button
              onClick={() => setSelectedCustomerId(null)}
              className="rounded-xl border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {detailsData.accounts.map((acc) => (
              <div
                key={acc.id}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
              >
                <p className="text-xs font-bold uppercase text-[#00E676]">
                  {acc.accountType} • {acc.status}
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  ${Number(acc.balance).toLocaleString()}
                </p>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  {acc.accountNumber}
                </p>
              </div>
            ))}
          </div>

          {detailsData.recentTransactions?.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase text-[var(--text-muted)]">
                Recent Transaction History
              </h4>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {detailsData.recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs"
                  >
                    <span className="font-mono font-bold">{t.transactionId}</span>
                    <span className="capitalize text-[var(--text-muted)]">
                      {t.transactionType.replace("_", " ")}
                    </span>
                    <span className="font-bold">${Number(t.amount).toLocaleString()}</span>
                    <span className="rounded-full bg-[#FF5A1F]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF5A1F] uppercase">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customers Table */}
      <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase">
              <tr>
                <th className="px-5 py-4 font-semibold">ID</th>
                <th className="px-5 py-4 font-semibold">Customer Name</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    Loading customers...
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[var(--bg-elevated)]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono">#{c.id}</td>
                    <td className="px-5 py-3.5 font-bold">{c.name}</td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)]">
                      {c.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                          c.status === "active"
                            ? "bg-[#00E676]/15 text-[#00E676]"
                            : "bg-red-500/15 text-red-500"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomerId(c.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 hover:border-[#FF5A1F] cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() =>
                            updateStatus({
                              id: c.id,
                              status:
                                c.status === "active" ? "blocked" : "active",
                            })
                          }
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold cursor-pointer ${
                            c.status === "active"
                              ? "bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white"
                              : "bg-[#00E676]/15 text-[#00E676] hover:bg-[#00E676] hover:text-black"
                          }`}
                        >
                          {c.status === "active" ? (
                            <>
                              <ShieldBan className="h-3.5 w-3.5" /> Block
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" /> Activate
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

