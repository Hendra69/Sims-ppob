import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://take-home-test-api.nutech-integrasi.com";

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/registration`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data; // { status, message, data }
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(
        data?.message || data?.error || err.message || "Register gagal"
      );
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const token = res.data?.data?.token || res.data?.token;
      if (token) localStorage.setItem("token", token);

      return res.data;
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(
        data?.message || data?.error || err.message || "Login gagal"
      );
    }
  }
);

/* ================= SLICE ================= */
export const userSlice = createSlice({
  name: "user",
  initialState: {
    /* login */
    user: null,
    token: localStorage.getItem("token") || null,

    /* register */
    registerSuccess: false,
    registerMessage: null,

    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterState: (state) => {
      state.registerSuccess = false;
      state.registerMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== REGISTER ===== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
        state.registerMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        // 🔴 PENTING: JANGAN SET state.user
        state.registerSuccess = true;
        state.registerMessage =
          action.payload?.message || "Registrasi berhasil!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      })

      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ login baru isi user
        state.user = action.payload;
        state.token =
          action.payload?.data?.token || action.payload?.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ================= EXPORT ================= */
export const {
  logout,
  clearError,
  clearRegisterState,
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

/* REGISTER STATE */
export const selectRegisterSuccess = (state) =>
  state.user.registerSuccess;
export const selectRegisterMessage = (state) =>
  state.user.registerMessage;

export default userSlice.reducer;
