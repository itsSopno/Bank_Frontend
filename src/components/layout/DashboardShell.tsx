"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetMeQuery } from "@/store/api/bankingApi";
import { clearCredentials } from "@/store/slices/authSlice";
import { clearAccountState, setAccounts } from "@/store/slices/accountSlice";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);

  const { data: meData, isError, error } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (isError && (error as any)?.status === 401) {
      dispatch(clearCredentials());
      dispatch(clearAccountState());
      router.replace("/login");
    }
  }, [isError, error, dispatch, router]);

  useEffect(() => {
    if (meData?.accounts) {
      dispatch(setAccounts(meData.accounts));
    }
  }, [meData, dispatch]);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF5A1F] border-t-transparent" />
          <p className="text-sm text-[var(--text-muted)]">
            Securing Banking Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

