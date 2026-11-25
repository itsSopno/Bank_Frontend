import { baseApi } from "./baseApi";
import type {
  BankAccount,
  DepositWithdrawalRequest,
  Loan,
  NotificationItem,
  PaginationMeta,
  Transaction,
  User,
} from "@/types/banking";

export const bankingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================
    // 1. AUTH ENDPOINTS
    // ========================
    login: builder.mutation<
      {
        success: boolean;
        message: string;
        user: User;
        accounts: BankAccount[];
        token: string;
      },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Account", "Analytics", "Notification"],
    }),

    register: builder.mutation<
      {
        success: boolean;
        message: string;
        user: User;
        account: BankAccount | null;
        token: string;
      },
      {
        name: string;
        email: string;
        password: string;
        role?: "admin" | "bank_staff" | "customer";
        phone?: string;
        address?: string;
        transactionPin?: string;
      }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Account", "Customer", "Analytics"],
    }),

    getMe: builder.query<
      { success: boolean; user: User; accounts: BankAccount[] },
      void
    >({
      query: () => "/auth/me",
      providesTags: ["Auth", "Account"],
    }),

    setPin: builder.mutation<
      { success: boolean; message: string },
      { pin: string; currentPassword: string }
    >({
      query: (body) => ({
        url: "/auth/set-pin",
        method: "POST",
        body,
      }),
    }),

    // ========================
    // 2. ACCOUNTS ENDPOINTS
    // ========================
    getMyAccounts: builder.query<
      { success: boolean; accounts: BankAccount[] },
      void
    >({
      query: () => "/accounts/my-accounts",
      providesTags: ["Account"],
    }),

    getAllAccounts: builder.query<
      {
        success: boolean;
        accounts: BankAccount[];
        pagination: PaginationMeta;
      },
      { page?: number; limit?: number; search?: string; status?: string; type?: string }
    >({
      query: (params) => ({
        url: "/accounts/all",
        params,
      }),
      providesTags: ["Account"],
    }),

    createAccount: builder.mutation<
      { success: boolean; message: string; account: BankAccount },
      {
        userId: number;
        accountType: "savings" | "current" | "business";
        initialDeposit?: number;
      }
    >({
      query: (body) => ({
        url: "/accounts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account", "Analytics", "Customer"],
    }),

    updateAccountStatus: builder.mutation<
      { success: boolean; message: string; account: BankAccount },
      { id: number; status: "active" | "frozen" | "closed" }
    >({
      query: ({ id, status }) => ({
        url: `/accounts/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Account"],
    }),

    updateAccountLimits: builder.mutation<
      { success: boolean; message: string; account: BankAccount },
      {
        id: number;
        dailyTransferLimit?: number;
        maxSingleTransactionLimit?: number;
        minBalance?: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${id}/limits`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Account"],
    }),

    // ========================
    // 3. TRANSACTIONS ENDPOINTS
    // ========================
    transferFunds: builder.mutation<
      {
        success: boolean;
        message: string;
        transactionId: string;
        transaction: Transaction;
        senderBalance: string;
      },
      {
        senderAccountId: number;
        recipientAccountNumber: string;
        amount: number;
        description?: string;
        transactionPin: string;
      }
    >({
      query: (body) => ({
        url: "/transactions/transfer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account", "Transaction", "Analytics", "Notification"],
    }),

    requestDepositWithdrawal: builder.mutation<
      { success: boolean; message: string; request: DepositWithdrawalRequest },
      {
        accountId: number;
        type: "deposit" | "withdrawal";
        amount: number;
        description?: string;
      }
    >({
      query: (body) => ({
        url: "/transactions/request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transaction", "Analytics"],
    }),

    getPendingRequests: builder.query<
      { success: boolean; requests: DepositWithdrawalRequest[] },
      void
    >({
      query: () => "/transactions/pending-requests",
      providesTags: ["Transaction"],
    }),

    reviewDepositWithdrawal: builder.mutation<
      { success: boolean; message: string },
      { id: number; action: "approve" | "reject"; rejectionReason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/transactions/request/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Transaction", "Account", "Analytics", "Notification"],
    }),

    getTransactions: builder.query<
      {
        success: boolean;
        transactions: Transaction[];
        pagination: PaginationMeta;
      },
      {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        accountId?: string;
      }
    >({
      query: (params) => {
        const cleanParams: Record<string, string | number> = {};
        Object.entries(params).forEach(([k, v]) => {
          if (v !== "" && v !== undefined) cleanParams[k] = v;
        });
        return { url: "/transactions/history", params: cleanParams };
      },
      providesTags: ["Transaction"],
    }),

    flagTransaction: builder.mutation<
      { success: boolean; message: string },
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/transactions/${id}/flag`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Transaction", "Analytics"],
    }),

    // ========================
    // 4. LOANS ENDPOINTS
    // ========================
    applyLoan: builder.mutation<
      { success: boolean; message: string; loan: Loan },
      {
        accountId: number;
        loanType: "personal" | "home" | "business" | "education";
        requestedAmount: number;
        durationMonths: number;
        monthlyIncome: number;
        employmentStatus: string;
        applicationDescription?: string;
      }
    >({
      query: (body) => ({
        url: "/loans/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loan", "Analytics", "Notification"],
    }),

    getMyLoans: builder.query<{ success: boolean; loans: Loan[] }, void>({
      query: () => "/loans/my-loans",
      providesTags: ["Loan"],
    }),

    getAllLoans: builder.query<
      { success: boolean; loans: Loan[]; pagination: PaginationMeta },
      { page?: number; limit?: number; status?: string; type?: string }
    >({
      query: (params) => ({
        url: "/loans/all",
        params,
      }),
      providesTags: ["Loan"],
    }),

    staffReviewLoan: builder.mutation<
      { success: boolean; message: string; loan: Loan },
      { id: number | string; internalNotes: string; forwardToAdmin: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/loans/${id}/staff-review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Loan"],
    }),

    adminReviewLoan: builder.mutation<
      { success: boolean; message: string; loan: Loan },
      {
        id: number | string;
        action: "approve" | "reject";
        approvedAmount?: number;
        interestRate?: number;
        rejectionReason?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/loans/${id}/admin-review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Loan", "Account", "Transaction", "Analytics", "Notification"],
    }),

    repayLoan: builder.mutation<
      { success: boolean; message: string; loan: Loan; transactionId: string },
      {
        id: number | string;
        accountId: number;
        amount: number;
        transactionPin: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/loans/${id}/repay`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loan", "Account", "Transaction", "Analytics", "Notification"],
    }),

    // ========================
    // 5. CUSTOMERS ENDPOINTS
    // ========================
    getAllCustomers: builder.query<
      { success: boolean; customers: User[]; pagination: PaginationMeta },
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: (params) => ({
        url: "/customers",
        params,
      }),
      providesTags: ["Customer"],
    }),

    getCustomerById: builder.query<
      {
        success: boolean;
        customer: User;
        accounts: BankAccount[];
        loans: Loan[];
        recentTransactions: Transaction[];
      },
      number | string
    >({
      query: (id) => `/customers/${id}`,
      providesTags: ["Customer"],
    }),

    updateCustomerStatus: builder.mutation<
      { success: boolean; message: string; customer: User },
      { id: number; status: "active" | "inactive" | "blocked" }
    >({
      query: ({ id, status }) => ({
        url: `/customers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Customer", "Analytics"],
    }),

    // ========================
    // 6. ANALYTICS ENDPOINTS
    // ========================
    getAdminAnalytics: builder.query<{ success: boolean; analytics: any }, void>({
      query: () => "/analytics/admin",
      providesTags: ["Analytics"],
    }),

    getCustomerAnalytics: builder.query<{ success: boolean; analytics: any }, void>(
      {
        query: () => "/analytics/customer",
        providesTags: ["Analytics"],
      }
    ),

    getStaffAnalytics: builder.query<{ success: boolean; analytics: any }, void>({
      query: () => "/analytics/staff",
      providesTags: ["Analytics"],
    }),

    // ========================
    // 7. NOTIFICATIONS ENDPOINTS
    // ========================
    getMyNotifications: builder.query<
      {
        success: boolean;
        notifications: NotificationItem[];
        unreadCount: number;
      },
      void
    >({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllNotificationsAsRead: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useSetPinMutation,
  useGetMyAccountsQuery,
  useGetAllAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountStatusMutation,
  useUpdateAccountLimitsMutation,
  useTransferFundsMutation,
  useRequestDepositWithdrawalMutation,
  useGetPendingRequestsQuery,
  useReviewDepositWithdrawalMutation,
  useGetTransactionsQuery,
  useFlagTransactionMutation,
  useApplyLoanMutation,
  useGetMyLoansQuery,
  useGetAllLoansQuery,
  useStaffReviewLoanMutation,
  useAdminReviewLoanMutation,
  useRepayLoanMutation,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerStatusMutation,
  useGetAdminAnalyticsQuery,
  useGetCustomerAnalyticsQuery,
  useGetStaffAnalyticsQuery,
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = bankingApi;

