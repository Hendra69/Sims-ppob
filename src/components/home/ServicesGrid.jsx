import { Box, Typography } from "@mui/material";

export default function ServiceGrid({ services = [], onSelect }) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {services.map((s) => (
        <Box
          key={s.service_code}
          onClick={() => onSelect(s)}
          sx={{
            width: 90,
            textAlign: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              mx: "auto",
              border: "1px solid #eee",
              display: "grid",
              placeItems: "center",
              "&:hover": { borderColor: "#E53935" },
            }}
          >
            <img
              src={s.service_icon}
              alt={s.service_name}
              style={{ width: 28, height: 28, objectFit: "contain" }}
            />
          </Box>

          <Typography sx={{ mt: 1, fontSize: 12, color: "#555" }}>
            {s.service_name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}


