import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";

export const registerUser = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await client.post("/registration", payload);
      return res.data; 
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(data?.message || err.message || "Register gagal");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await client.post("/login", payload);
      const token = res.data?.data?.token || res.data?.token || null;
      if (token) localStorage.setItem("token", token);
      return res.data;
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(data?.message || err.message || "Login gagal");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: null,
    loading: false,
    error: null,

    registerSuccess: false,
    registerMessage: null,
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
        state.registerMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = true;
        state.registerMessage = action.payload?.message || "Registrasi berhasil!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const token = action.payload?.data?.token || action.payload?.token || null;
        state.token = token;
        state.user = action.payload?.data || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearRegisterState } = userSlice.actions;

export const selectToken = (state) => state.user.token;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
export const selectUser = (state) => state.user;



export const selectRegisterMessage = (state) => state.user.registerMessage;
export const selectRegisterSuccess = (state) => state.user.registerSuccess;

export default userSlice.reducer;
