import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

import AppHeader from "../../components/layout/AppHeader";
import {
  fetchAccountProfile,
  updateAccountProfile,
  updateProfileImage,
  clearAccountState,
  selectAccountProfile,
  selectAccountLoading,
  selectAccountError,
  selectAccountSuccess,
} from "../../Features/accountSlice";

import { logout } from "../../Features/userSlice";



const inputSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#BDBDBD" },
    "&.Mui-focused fieldset": { borderColor: "#E53935" },
  },
  "& .MuiOutlinedInput-input": { py: 1.4 },
};

const MAX_IMAGE_BYTES = 100 * 1024; 
export default function AccountPage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const profile = useSelector(selectAccountProfile);
  const loading = useSelector(selectAccountLoading);
  const error = useSelector(selectAccountError);
  const success = useSelector(selectAccountSuccess);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchAccountProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
    });
  }, [profile]);

  const fullName = useMemo(() => {
    const a = profile?.first_name || "";
    const b = profile?.last_name || "";
    return `${a} ${b}`.trim() || "-";
  }, [profile]);

  const handleChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleClickAvatar = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setLocalError("Ukuran gambar maksimal 100 KB");
      e.target.value = "";
      return;
    }

    try {
      await dispatch(updateProfileImage(file)).unwrap();
    } catch (_) {
    } finally {
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (loading) return;
    try {
      await dispatch(
        updateAccountProfile({
          first_name: form.first_name,
          last_name: form.last_name,
        })
      ).unwrap();
      setEditMode(false);
    } catch (_) {}
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AppHeader />

      <Container maxWidth="md" sx={{ py: 4 }}>

        <Box sx={{ maxWidth: 720, mx: "auto" }}>

          <Box sx={{ display: "grid", placeItems: "center", mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={profile?.profile_image || ""}
                sx={{
                  width: 92,
                  height: 92,
                  bgcolor: "#f2f2f2",
                  border: "1px solid #eee",
                }}
              />

              <IconButton
                onClick={handleClickAvatar}
                sx={{
                  position: "absolute",
                  right: 2,
                  bottom: 2,
                  width: 30,
                  height: 30,
                  bgcolor: "#fff",
                  border: "1px solid #eee",
                  "&:hover": { bgcolor: "#fafafa" },
                }}
              >
                <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Box>

            <Typography sx={{ mt: 2, fontWeight: 900, fontSize: 22 }}>
              {fullName}
            </Typography>
          </Box>


          <Box>
            <Typography sx={{ fontSize: 13, color: "#666", mb: 0.7 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              value={profile?.email || ""}
              placeholder="email"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailRoundedIcon sx={{ color: "#9E9E9E" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <Typography sx={{ fontSize: 13, color: "#666", mb: 0.7 }}>
              Nama Depan
            </Typography>
            <TextField
              fullWidth
              value={form.first_name}
              onChange={handleChange("first_name")}
              disabled={!editMode || loading}
              placeholder="nama depan"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon sx={{ color: "#9E9E9E" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <Typography sx={{ fontSize: 13, color: "#666", mb: 0.7 }}>
              Nama Belakang
            </Typography>
            <TextField
              fullWidth
              value={form.last_name}
              onChange={handleChange("last_name")}
              disabled={!editMode || loading}
              placeholder="nama belakang"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon sx={{ color: "#9E9E9E" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, mb: 3 }}
            />



            {!editMode ? (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setEditMode(true)}
                sx={{
                  py: 1.4,
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: "#E53935",
                  color: "#E53935",
                  "&:hover": { borderColor: "#D32F2F", bgcolor: "#fff5f5" },
                  mb: 2,
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: "grid", gap: 1.2, mb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 900,
                    bgcolor: "#E53935",
                    "&:hover": { bgcolor: "#D32F2F" },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
                      <CircularProgress size={18} color="inherit" />
                      Menyimpan...
                    </Box>
                  ) : (
                    "Simpan"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: "#BDBDBD",
                    color: "#444",
                  }}
                >
                  Batal
                </Button>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogout}
              sx={{
                py: 1.4,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 900,
                bgcolor: "#E53935",
                "&:hover": { bgcolor: "#D32F2F" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={Boolean(success)}
          autoHideDuration={2500}
          onClose={() => dispatch(clearAccountState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => dispatch(clearAccountState())}
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={3000}
          onClose={() => dispatch(clearAccountState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => dispatch(clearAccountState())}
            sx={{ width: "100%" }}
          >
            {String(error)}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(localError)}
          autoHideDuration={2500}
          onClose={() => setLocalError("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setLocalError("")}
            sx={{ width: "100%" }}
          >
            {localError}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
