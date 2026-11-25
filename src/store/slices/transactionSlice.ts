import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TransactionStatus, TransactionType } from "@/types/banking";

interface TransactionFilterState {
  page: number;
  limit: number;
  search: string;
  type: TransactionType | "";
  status: TransactionStatus | "";
  startDate: string;
  endDate: string;
}

interface TransactionState {
  filters: TransactionFilterState;
  selectedTransactionId: string | null;
}

const initialState: TransactionState = {
  filters: {
    page: 1,
    limit: 10,
    search: "",
    type: "",
    status: "",
    startDate: "",
    endDate: "",
  },
  selectedTransactionId: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionFilters: (
      state,
      action: PayloadAction<Partial<TransactionFilterState>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetTransactionFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedTransactionId: (state, action: PayloadAction<string | null>) => {
      state.selectedTransactionId = action.payload;
    },
  },
});

export const {
  setTransactionFilters,
  resetTransactionFilters,
  setSelectedTransactionId,
} = transactionSlice.actions;

export default transactionSlice.reducer;

