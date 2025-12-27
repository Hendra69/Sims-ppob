import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";

export const fetchProfile = createAsyncThunk(
  "home/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get("/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchBalance = createAsyncThunk(
  "home/balance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get("/balance");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchServices = createAsyncThunk(
  "home/services",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get("/services");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchBanners = createAsyncThunk(
  "home/banners",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get("/banner");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    profile: null,
    balance: 0,
    services: [],
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload?.data?.balance ?? 0;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload?.data || [];
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload?.data || [];
      })

      .addMatcher(
        (action) => action.type.startsWith("home/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("home/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Gagal memuat data";
        }
      );
  },
});

export const selectHome = (state) => state.home;
export default homeSlice.reducer;
