import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";

import { registerUser, selectLoading, selectError, clearError } from "../../Features/userSlice";

const inputSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#BDBDBD" },
    "&.Mui-focused fieldset": { borderColor: "#E53935" },
  },
  "& .MuiOutlinedInput-input": {
    py: 1.4,
  },
};

export default function RegisterForm({ onGoLogin }) {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const apiError = useSelector(selectError);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // snackbar sukses
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // snackbar error (optional)
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const e = {};
    if (!form.email) e.email = "Email wajib diisi";
    if (!form.firstName) e.firstName = "Nama depan wajib diisi";
    if (!form.lastName) e.lastName = "Nama belakang wajib diisi";
    if (!form.password) e.password = "Password wajib diisi";
    if (form.password && form.password.length < 6) e.password = "Min. 6 karakter";
    if (!form.confirmPassword) e.confirmPassword = "Konfirmasi password wajib diisi";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      e.confirmPassword = "Konfirmasi password tidak sama";
    }
    return e;
  }, [form]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // reset error slice (biar tidak nyangkut)
    dispatch(clearError());

    setTouched({
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(errors).length) return;

    try {
      const res = await dispatch(
        registerUser({
          email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
          password: form.password,
        })
      ).unwrap();

      // ✅ ambil message dari API (paling umum: res.message)
      const msg = res?.message || "Registrasi berhasil!";
      setSuccessMsg(msg);
      setOpenSuccess(true);

      // optional: reset form
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      });
      setTouched({});
    } catch (err) {
      // err di sini biasanya string dari rejectWithValue
      const msg = (typeof err === "string" ? err : null) || apiError || "Registrasi gagal";
      setErrorMsg(msg);
      setOpenError(true);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: "#E53935",
            display: "grid",
            placeItems: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          S
        </Box>
        <Typography sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          SIMS PPOB
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 3 }}>
        Lengkapi data untuk <br /> membuat akun
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          placeholder="masukan email anda"
          value={form.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email ? errors.email : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailRoundedIcon sx={{ color: "#9E9E9E" }} />
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />

        <TextField
          fullWidth
          placeholder="nama depan"
          value={form.firstName}
          onChange={handleChange("firstName")}
          onBlur={handleBlur("firstName")}
          error={Boolean(touched.firstName && errors.firstName)}
          helperText={touched.firstName ? errors.firstName : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineRoundedIcon sx={{ color: "#9E9E9E" }} />
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />

        <TextField
          fullWidth
          placeholder="nama belakang"
          value={form.lastName}
          onChange={handleChange("lastName")}
          onBlur={handleBlur("lastName")}
          error={Boolean(touched.lastName && errors.lastName)}
          helperText={touched.lastName ? errors.lastName : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineRoundedIcon sx={{ color: "#9E9E9E" }} />
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />

        <TextField
          fullWidth
          placeholder="buat password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password ? errors.password : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: "#9E9E9E" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />

        <TextField
          fullWidth
          placeholder="konfirmasi password"
          type={showConfirm ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          error={Boolean(touched.confirmPassword && errors.confirmPassword)}
          helperText={touched.confirmPassword ? errors.confirmPassword : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: "#9E9E9E" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                  <Icon icon={showConfirm ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ ...inputSx, mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.3,
            borderRadius: 1.5,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#E53935",
            "&:hover": { bgcolor: "#D32F2F" },
          }}
        >
          {loading ? "Memproses..." : "Registrasi"}
        </Button>

        {/* ✅ SUCCESS ALERT (message dari API) */}
        <Snackbar
          open={openSuccess}
          autoHideDuration={2500}
          onClose={() => setOpenSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        </Snackbar>

        {/* OPTIONAL: ERROR ALERT */}
        <Snackbar
          open={openError}
          autoHideDuration={3000}
          onClose={() => setOpenError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenError(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errorMsg || apiError}
          </Alert>
        </Snackbar>

        <Typography sx={{ mt: 2, fontSize: 13, textAlign: "center" }}>
          sudah punya akun?{" "}
          <Link
            component="button"
            type="button"
            underline="none"
            onClick={onGoLogin}
            sx={{ color: "#E53935", fontWeight: 700 }}
          >
            login di sini
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
