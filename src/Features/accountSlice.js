import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";

export const fetchAccountProfile = createAsyncThunk(
  "account/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get("/profile");
      return res.data; 
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(
        data?.message || data?.error || err.message || "Gagal mengambil profile"
      );
    }
  }
);

export const updateAccountProfile = createAsyncThunk(
  "account/updateProfile",
  async ({ first_name, last_name }, { rejectWithValue }) => {
    try {
      const res = await client.put("/profile/update", {
        first_name,
        last_name,
      });
      return res.data;
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(
        data?.message || data?.error || err.message || "Gagal update profile"
      );
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "account/updateImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await client.put("/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      const data = err.response?.data;
      return rejectWithValue(
        data?.message || data?.error || err.message || "Gagal upload foto"
      );
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAccountState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || null;
      })
      .addCase(fetchAccountProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAccountProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAccountProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || state.profile;
        state.successMessage =
          action.payload?.message || "Profile berhasil diperbarui";
      })
      .addCase(updateAccountProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || state.profile;
        state.successMessage =
          action.payload?.message || "Foto profile berhasil diperbarui";
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearAccountState } = accountSlice.actions;

export const selectAccountProfile = (state) => state.account.profile;
export const selectAccountLoading = (state) => state.account.loading;
export const selectAccountError = (state) => state.account.error;
export const selectAccountSuccess = (state) => state.account.successMessage;

export default accountSlice.reducer;
