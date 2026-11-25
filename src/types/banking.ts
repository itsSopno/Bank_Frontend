export type UserRole = "admin" | "bank_staff" | "customer";
export type UserStatus = "active" | "inactive" | "blocked";
export type AccountType = "savings" | "current" | "business";
export type AccountStatus = "active" | "frozen" | "closed";
export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "fund_transfer"
  | "loan_disbursement"
  | "loan_repayment";
export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";
export type LoanType = "personal" | "home" | "business" | "education";
export type LoanStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "active"
  | "completed";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
}

export interface BankAccount {
  id: number;
  accountNumber: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  accountType: AccountType;
  balance: string;
  status: AccountStatus;
  dailyTransferLimit: string;
  maxSingleTransactionLimit: string;
  minBalance: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  transactionId: string;
  senderAccountId?: number | null;
  receiverAccountId?: number | null;
  transactionType: TransactionType;
  amount: string;
  transactionFee: string;
  status: TransactionStatus;
  description?: string | null;
  reference?: string | null;
  isSuspicious: boolean;
  flaggedReason?: string | null;
  createdAt: string;
}

export interface DepositWithdrawalRequest {
  id: number;
  accountId: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  accountNumber?: string;
  type: "deposit" | "withdrawal";
  amount: string;
  description?: string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  createdAt: string;
}

export interface Loan {
  id: number;
  loanId: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  accountId: number;
  accountNumber?: string;
  loanType: LoanType;
  requestedAmount: string;
  approvedAmount?: string | null;
  interestRate: string;
  durationMonths: number;
  monthlyIncome: string;
  employmentStatus: string;
  applicationDescription?: string | null;
  status: LoanStatus;
  remainingBalance?: string | null;
  monthlyInstallment?: string | null;
  internalNotes?: string | null;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "transfer" | "deposit" | "withdrawal" | "loan" | "security" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

