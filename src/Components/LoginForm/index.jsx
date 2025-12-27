import React, { useState } from "react";
import { Box, Card, Grid } from "@mui/material";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import gambar_regis from "../../assets/Images/gambar1.png"; 

export default function AuthPage() {
  const [mode, setMode] = useState("login"); 

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#fff",
        px: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "min(1100px, 100%)",
          borderRadius: 3,
          border: "1px solid #eee",
          overflow: "hidden",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: { xs: 3, md: 6 },
              display: "flex",
              alignItems: "center",
            }}
          >
            {mode === "login" ? (
              <LoginForm onGoRegister={() => setMode("register")} />
            ) : (
              <RegisterForm onGoLogin={() => setMode("login")} />
            )}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#FCECEC",
              p: 4,
            }}
          >
            <Box
              component="img"
              src={gambar_regis}
              alt="hero"
              sx={{ width: "100%", maxWidth: 520, objectFit: "contain" }}
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
