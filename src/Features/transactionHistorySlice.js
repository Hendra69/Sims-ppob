import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../api/client";

const LIMIT = 5;

// GET /transaction/history?offset=0&limit=5
export const fetchHistory = createAsyncThunk(
  "history/fetch",
  async ({ offset = 0, limit = LIMIT }, { rejectWithValue }) => {
    try {
      const res = await client.get(`/transaction/history?offset=${offset}&limit=${limit}`);
      // response: { status, message, data: { offset, limit, records } } (umumnya)
      return { offset, limit, payload: res.data };
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.message || data?.error || (typeof data === "string" ? data : null) || err.message;
      return rejectWithValue(message || "Gagal memuat riwayat transaksi");
    }
  }
);

const initialState = {
  items: [],
  offset: 0,
  limit: LIMIT,
  loading: false,
  error: null,
  hasMore: true,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    resetHistory: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;

        const { offset, limit, payload } = action.payload;

        // fleksibel: records bisa di payload.data.records / payload.data
        const records =
          payload?.data?.records ||
          payload?.data?.history ||
          payload?.data ||
          [];

        if (offset === 0) state.items = records;
        else state.items = [...state.items, ...records];

        state.offset = offset;
        state.limit = limit;

        // kalau records kurang dari limit -> sudah habis
        state.hasMore = Array.isArray(records) && records.length === limit;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Gagal memuat riwayat transaksi";
      });
  },
});

export const { resetHistory } = historySlice.actions;

export const selectHistoryItems = (state) => state.history.items;
export const selectHistoryOffset = (state) => state.history.offset;
export const selectHistoryLimit = (state) => state.history.limit;
export const selectHistoryLoading = (state) => state.history.loading;
export const selectHistoryError = (state) => state.history.error;
export const selectHistoryHasMore = (state) => state.history.hasMore;

export default historySlice.reducer;
