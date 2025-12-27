import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { selectHome } from "../../Features/homeSlice";

export default function BannerCarousel() {
  const { banners } = useSelector(selectHome);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 2 }}>Temukan promo menarik</Typography>

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
        {(banners || []).map((b) => (
          <Box key={b.banner_name} sx={{ minWidth: 280, height: 120, borderRadius: 2, overflow: "hidden", border: "1px solid #eee", flex: "0 0 auto" }}>
            <img src={b.banner_image} alt={b.banner_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
