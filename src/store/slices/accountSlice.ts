import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BankAccount } from "@/types/banking";

interface AccountState {
  selectedAccountId: number | null;
  accounts: BankAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  selectedAccountId: null,
  accounts: [],
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.accounts = action.payload;
      if (
        action.payload.length > 0 &&
        (!state.selectedAccountId ||
          !action.payload.some((a) => a.id === state.selectedAccountId))
      ) {
        state.selectedAccountId = action.payload[0].id;
      }
    },
    selectAccount: (state, action: PayloadAction<number>) => {
      state.selectedAccountId = action.payload;
    },
    clearAccountState: (state) => {
      state.accounts = [];
      state.selectedAccountId = null;
    },
  },
});

export const { setAccounts, selectAccount, clearAccountState } =
  accountSlice.actions;

export default accountSlice.reducer;

