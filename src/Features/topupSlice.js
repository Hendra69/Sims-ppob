import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";
import { fetchBalance } from "./homeSlice";


export const topupBalance = createAsyncThunk(
  "topup/submit",
  async (amount, { rejectWithValue, dispatch }) => {
    try {
      const topUpAmount = Number(amount);

      if (!Number.isFinite(topUpAmount)) {
        return rejectWithValue("Nominal top up tidak valid");
      }

      const res = await client.post("/topup", { top_up_amount: topUpAmount });

      dispatch(fetchBalance());

      return res.data;
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : null) ||
        err.message;

      return rejectWithValue(message || "Top up gagal");
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  successMessage: null,
};

const topupSlice = createSlice({
  name: "topup",
  initialState,
  reducers: {
    clearTopupState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(topupBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(topupBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || "Top up berhasil";
      })
      .addCase(topupBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Top up gagal";
      });
  },
});

export const { clearTopupState } = topupSlice.actions;

export const selectTopupLoading = (state) => state.topup.loading;
export const selectTopupError = (state) => state.topup.error;
export const selectTopupSuccess = (state) => state.topup.successMessage;

export default topupSlice.reducer;
