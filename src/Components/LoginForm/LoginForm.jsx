import React, { useMemo, useState } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { loginUser, selectLoading, selectError } from "../../Features/userSlice";


import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Link,
} from "@mui/material";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";

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

export default function LoginForm({ onGoRegister }) {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const errors = useMemo(() => {
    const e = {};
    if (!form.email) e.email = "Email wajib diisi";
    if (!form.password) e.password = "Password wajib diisi";
    return e;
  }, [form]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });
    if (Object.keys(errors).length) return;

    dispatch(
      loginUser({
        email: form.email,
        password: form.password,
      })
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
      {/* Header */}
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
        Masuk atau buat akun <br /> untuk memulai
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* EMAIL: icon @ di kiri */}
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
          placeholder="masukan password anda"
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
          sx={{ ...inputSx, mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          sx={{
            py: 1.3,
            borderRadius: 1.5,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#E53935",
            "&:hover": { bgcolor: "#D32F2F" },
          }}
          variant="contained"
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
        {error && (
          <Typography color="error" fontSize={12} mt={1}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </Typography>
        )}
        <Typography sx={{ mt: 2, fontSize: 13, textAlign: "center" }}>
          belum punya akun?{" "}
          <Link
            component="button"
            type="button"
            underline="none"
            onClick={onGoRegister}
            sx={{ color: "#E53935", fontWeight: 700 }}
          >
            registrasi di sini
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
