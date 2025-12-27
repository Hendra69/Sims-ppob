import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";
import { fetchBalance } from "./homeSlice";

export const payService = createAsyncThunk(
  "transaction/pay",
  async ({ service_code, amount }, { rejectWithValue, dispatch }) => {
    try {
      const res = await client.post("/transaction", {
        service_code,
        amount,
      });

      dispatch(fetchBalance());

      return res.data;
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.message || data?.error || (typeof data === "string" ? data : null) || err.message;
      return rejectWithValue(message || "Transaksi gagal");
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  successMessage: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearTransactionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(payService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(payService.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || "Pembayaran berhasil";
      })
      .addCase(payService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Pembayaran gagal";
      });
  },
});

export const { clearTransactionState } = transactionSlice.actions;

export const selectTxnLoading = (state) => state.transaction.loading;
export const selectTxnError = (state) => state.transaction.error;
export const selectTxnSuccess = (state) => state.transaction.successMessage;

export default transactionSlice.reducer;
