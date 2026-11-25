# NovaBank — Advanced Digital Banking Management System

A full-stack, role-based **Digital Banking Management System** built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit & RTK Query**, **Recharts**, and an **Express + Drizzle ORM + Supabase PostgreSQL** backend.

---

## 1. Project Overview
NovaBank simulates a real-world digital banking platform with strict server-side validation, atomic database transactions, role-based access control (RBAC), loan management, suspicious transaction detection, PDF/CSV exports, and a responsive Dark (`#100C08`) / Light (`#FEFEF3`) fintech UI.

---

## 2. Application Features
- **Landing Page & Auth**: Modern fintech landing page with Dark/Light mode toggle, Login, and Customer Registration (auto-creates a Savings Account).
- **Tri-Role Dashboards**: Dedicated analytics & operational dashboards for **Admin**, **Bank Staff**, and **Customer**.
- **Account Management**: Multi-account support (`savings`, `current`, `business`), account switching, freeze/unfreeze/close controls, configurable transaction limits, and CSV statement export.
- **Atomic Fund Transfers**: PIN-verified transfers between own accounts or to other customers with server-side balance, status, and daily/single-transaction limit checks.
- **Deposit & Withdrawal Workflow**: Customer request submission with Staff/Admin approval & rejection workflow.
- **Loan Management System**: Loan application (`personal`, `home`, `business`, `education`), auto EMI calculation, Staff internal review & forwarding, Admin approval & automated disbursement, and Customer EMI repayment.
- **Transactions & Receipts**: Paginated transaction history with search by `TXN ID`, date range & type filters, suspicious transaction flagging, and **downloadable PDF receipts** (`jsPDF`).
- **Notifications**: Real-time alerts for transfers, deposits, withdrawals, and loan decisions.

---

## 3. User Roles & Permissions
| Capability | Admin | Bank Staff | Customer |
|---|:---:|:---:|:---:|
| View Bank-Wide Analytics & Charts | ✅ | ❌ | ❌ |
| Manage Customers (View, Search, Block/Activate) | ✅ | View/Register | ❌ |
| Open Accounts, Freeze/Unfreeze, Set Limits | ✅ | Create/View | Own Only |
| Review & Approve Deposit/Withdrawal Requests | ✅ | ✅ | Submit Only |
| Flag Suspicious Transactions | ✅ | ✅ | ❌ |
| Loan Staff Review & Internal Notes | ✅ | ✅ | ❌ |
| Approve / Reject / Disburse Loans | ✅ | ❌ | Apply & Repay |
| Fund Transfer & PDF/CSV Export | ❌ | ❌ | ✅ |

All authorization checks are enforced on the Express API server using JWT + RBAC middleware (`authenticate`, `authorize`).

---

## 4. Redux Toolkit Architecture
Global state is organized into modular feature slices under `src/store/slices/`:
- `authSlice.ts`: Authenticated user profile, JWT token, `localStorage` hydration & logout cleanup.
- `accountSlice.ts`: Active selected bank account and user accounts list.
- `transactionSlice.ts`: Filter & pagination state for transaction history.
- `loanSlice.ts`: Loan filter & active selection state.
- `uiSlice.ts`: Theme (`dark` / `light`), sidebar drawer state, and global search query.

---

## 5. RTK Query Implementation
API communication is handled centrally via `src/store/api/baseApi.ts` and `src/store/api/bankingApi.ts`:
- Automatic Bearer token injection via `prepareHeaders`.
- Tag-based cache invalidation (`Auth`, `Account`, `Transaction`, `Loan`, `Customer`, `Analytics`, `Notification`) ensures balances, transaction tables, and charts stay synchronized after every mutation.

---

## 6. Authentication Strategy
- **JWT Authentication**: Issued on `/api/auth/login` and `/api/auth/register` (7-day expiry), verified on every protected endpoint against live database user status.
- **4-Digit Transaction PIN**: Bcrypt-hashed and required for sensitive financial operations (fund transfers & loan repayments).

---

## 7. Transaction Processing Logic
- **Atomic Transfers**: Executed inside a PostgreSQL database transaction (`db.transaction(...)`).
- Validates account ownership, `active` status, sufficient balance, minimum balance, max single transaction limit, daily transfer limit, and transaction PIN.
- Generates a unique `TXN-...` reference ID and updates both sender and receiver balances atomically. Failed transfers roll back completely.

---

## 8. Database Structure (`bank` schema on PostgreSQL / Supabase)
8 normalized tables managed with Drizzle ORM (`DataBackend/src/db/schema.ts`):
- `users` (Admin, Bank Staff, Customer accounts + hashed password & PIN)
- `accounts` (Account number, type, balance, status, daily/single/min limits)
- `transactions` (Atomic ledger, fees, status, suspicious flag)
- `deposit_withdrawal_requests` (Pending/Approved/Rejected workflow)
- `loans` & `loan_repayments` (EMI, interest rate, remaining balance, staff notes)
- `notifications` (Per-user alerts & read status)
- `bank_settings` (System-wide configuration)

---

## 9. Security Implementation
- Passwords & 4-digit PINs hashed with `bcryptjs`.
- Zod v4 request validation middleware on all inputs.
- Strict server-side ownership checks (customers cannot view other customers' accounts/transactions or approve their own requests).
- Balances are never accepted from frontend payloads.

---

## 10. Environment Variables
### Frontend (`Frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`DataBackend/.env`)
```env
DATABASE_URL=postgresql://user:password@host:5432/postgres
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

---

## 11. Local Setup Instructions
### Backend
```bash
cd DataBackend
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

---

## 12. Deployment Instructions
- **Backend**: Deploy `DataBackend/` to Vercel (configured via `vercel.json` and `npx tsc` build). Add `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV=production` in Vercel Environment Variables.
- **Frontend**: Deploy `Frontend/` to Vercel or Netlify. Set `NEXT_PUBLIC_API_URL` to your deployed backend `/api` URL.

---

## 13. Demo Credentials
| Role | Email | Password | Transaction PIN |
|---|---|---|---|
| **Admin** | `admin@bank.com` | `Password123!` | — |
| **Bank Staff** | `staff@bank.com` | `Password123!` | — |
| **Customer 1** | `customer@bank.com` | `Password123!` | `1234` |
| **Customer 2** | `customer2@bank.com` | `Password123!` | `5678` |
