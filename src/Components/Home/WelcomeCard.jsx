import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Box, Typography } from "@mui/material";
import { selectHome } from "../../Features/homeSlice";

export default function WelcomeCard() {
  const { profile } = useSelector(selectHome);
  const name = profile ? `${profile.first_name} ${profile.last_name}` : "-";

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Avatar src={profile?.profile_image || ""} sx={{ width: 64, height: 64 }} />
      <Box>
        <Typography sx={{ color: "#777" }}>Selamat datang,</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>{name}</Typography>
      </Box>
    </Box>
  );
}
