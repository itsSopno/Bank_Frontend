import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "bankingApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth?: { token?: string | null } };
      const token =
        state.auth?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("bank_token")
          : null);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Account",
    "Transaction",
    "Loan",
    "Customer",
    "Analytics",
    "Notification",
  ],
  endpoints: () => ({}),
});

