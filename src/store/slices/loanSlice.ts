import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoanStatus } from "@/types/banking";

interface LoanState {
  statusFilter: LoanStatus | "";
  selectedLoanId: string | null;
}

const initialState: LoanState = {
  statusFilter: "",
  selectedLoanId: null,
};

const loanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    setLoanStatusFilter: (state, action: PayloadAction<LoanStatus | "">) => {
      state.statusFilter = action.payload;
    },
    setSelectedLoanId: (state, action: PayloadAction<string | null>) => {
      state.selectedLoanId = action.payload;
    },
  },
});

export const { setLoanStatusFilter, setSelectedLoanId } = loanSlice.actions;

export default loanSlice.reducer;

