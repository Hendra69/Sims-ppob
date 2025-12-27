import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { selectHome } from "../../Features/homeSlice";

export default function BalanceCard() {
  const { balance } = useSelector(selectHome);
  const [show, setShow] = useState(false);

  const formatted = useMemo(() => new Intl.NumberFormat("id-ID").format(balance || 0), [balance]);

  return (
    <Box sx={{ p: 3, borderRadius: 3, color: "#fff", background: "linear-gradient(90deg, #E53935, #D84335)" }}>
      <Typography sx={{ opacity: 0.9, mb: 1 }}>Saldo anda</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Rp {show ? formatted : "••••••••"}
        </Typography>
        <IconButton onClick={() => setShow((v) => !v)} sx={{ color: "#fff" }}>
          {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        </IconButton>
      </Box>

      <Typography sx={{ mt: 1, opacity: 0.9, fontSize: 13 }}>Lihat Saldo</Typography>
    </Box>
  );
}
