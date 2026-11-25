"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { hydrateAuth } from "@/store/slices/authSlice";
import { hydrateTheme } from "@/store/slices/uiSlice";

function StoreHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateTheme());
    store.dispatch(hydrateAuth());
  }, []);

  return <>{children}</>;
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}

