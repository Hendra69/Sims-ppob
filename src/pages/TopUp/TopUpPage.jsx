import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  Grid,
  Paper,
} from "@mui/material";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import AppHeader from "../../components/layout/AppHeader";
import WelcomeCard from "../../components/home/WelcomeCard";
import BalanceCard from "../../components/home/BalanceCard";

import { fetchProfile, fetchBalance } from "../../Features/homeSlice";
import {
  topupBalance,
  clearTopupState,
  selectTopupLoading,
  selectTopupError,
  selectTopupSuccess,
} from "../../Features/topupSlice";

const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#BDBDBD" },
    "&.Mui-focused fieldset": { borderColor: "#E53935" },
  },
  "& .MuiOutlinedInput-input": { py: 1.4 },
};

export default function TopUpPage() {
  const dispatch = useDispatch();

  const loading = useSelector(selectTopupLoading);
  const error = useSelector(selectTopupError);
  const success = useSelector(selectTopupSuccess);

  const [amountText, setAmountText] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  const amountNumber = useMemo(() => {
    const cleaned = amountText.replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
  }, [amountText]);

  const isValid = amountNumber >= 10000 && amountNumber <= 1000000;

  const helper = useMemo(() => {
    if (!amountText) return "";
    if (amountNumber < 10000) return "Minimum top up Rp10.000";
    if (amountNumber > 1000000) return "Maksimum top up Rp1.000.000";
    return "";
  }, [amountText, amountNumber]);

  const handlePick = (n) => setAmountText(String(n));

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    try {
      await dispatch(topupBalance(amountNumber)).unwrap();
      setAmountText("");
    } catch (_) {}
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AppHeader />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <WelcomeCard />
          <BalanceCard />
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography sx={{ color: "#555", mb: 0.5 }}>
            Silahkan masukan
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
            Nominal Top Up
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper variant="outlined" sx={{ p: 0, border: "none" }}>
                <TextField
                  fullWidth
                  value={amountText}
                  onChange={(e) => setAmountText(e.target.value)}
                  placeholder="masukan nominal Top Up"
                  error={Boolean(helper)}
                  helperText={helper}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWalletOutlinedIcon
                          sx={{ color: "#9E9E9E" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...inputSx, mb: 2 }}
                />

                <Button
                  fullWidth
                  disabled={!isValid || loading}
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    py: 1.4,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: !isValid ? "#D0D0D0" : "#E53935",
                    "&:hover": {
                      bgcolor: !isValid ? "#D0D0D0" : "#D32F2F",
                    },
                  }}
                >
                  {loading ? "Memproses..." : "Top Up"}
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1.2,
                }}
              >
                {quickAmounts.map((n) => (
                  <Button
                    key={n}
                    variant="outlined"
                    onClick={() => handlePick(n)}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: "none",
                      borderColor: "#E0E0E0",
                      color: "#444",
                      py: 1.2,
                      "&:hover": {
                        borderColor: "#BDBDBD",
                        bgcolor: "#fafafa",
                      },
                    }}
                  >
                    Rp{new Intl.NumberFormat("id-ID").format(n)}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={Boolean(success)}
          autoHideDuration={2500}
          onClose={() => dispatch(clearTopupState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => dispatch(clearTopupState())}
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={2500}
          onClose={() => dispatch(clearTopupState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => dispatch(clearTopupState())}
            sx={{ width: "100%" }}
          >
            {String(error)}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
