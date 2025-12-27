import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function AppHeader() {
    const navigate = useNavigate();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", color: "#000" }}
        >
            <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        flex: 1,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                >
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "#E53935",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 18,
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        S
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: 20,
                            letterSpacing: 0.5,
                            color: "#111",
                        }}
                    >
                        SIMS PPOB
                    </Typography>
                </Box>



                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button onClick={() => navigate("/topup")} sx={{ textTransform: "none" }}>
                        Top Up
                    </Button>
                    <Button onClick={() => navigate("/transaction")} sx={{ textTransform: "none" }}>
                        Transaction
                    </Button>
                    <Button onClick={() => navigate("/account")} sx={{ textTransform: "none" }}>
                        Akun
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
