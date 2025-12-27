import  { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

export default function PaymentForm({ service, onPay, loading }) {
  const [amountText, setAmountText] = useState("");

  useEffect(() => {
    if (!service) return;
    setAmountText(String(service.service_tariff ?? ""));
  }, [service]);

  const amountNumber = useMemo(() => {
    const cleaned = String(amountText).replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
  }, [amountText]);

  const maxAmount = service?.service_tariff ?? 0;

  const errorText = useMemo(() => {
    if (!amountText) return "";
    if (amountNumber <= 0) return "Nominal tidak valid";
    if (amountNumber > maxAmount)
      return `Maksimum pembayaran Rp${new Intl.NumberFormat("id-ID").format(
        maxAmount
      )}`;
    return "";
  }, [amountText, amountNumber, maxAmount]);

  const isValid =
    amountNumber > 0 &&
    amountNumber <= maxAmount &&
    !loading;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ color: "#666", mb: 0.5 }}>
        Pembayaran
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
        <img
          src={service?.service_icon}
          alt={service?.service_name}
          style={{ width: 20, height: 20, objectFit: "contain" }}
        />
        <Typography sx={{ fontWeight: 800 }}>
          {service?.service_name}
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="masukan nominal pembayaran"
        value={amountText}
        onChange={(e) => setAmountText(e.target.value)}
        error={Boolean(errorText)}
        helperText={errorText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PaymentsOutlinedIcon sx={{ color: "#9E9E9E" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#fff",
          },
        }}
      />

      <Button
        fullWidth
        disabled={!isValid}
        onClick={() => onPay(amountNumber)}
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
        {loading ? "Memproses..." : "Bayar"}
      </Button>
    </Box>
  );
}
