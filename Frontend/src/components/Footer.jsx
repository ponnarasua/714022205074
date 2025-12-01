import React from "react";
import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 6,
        textAlign: "center",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          color: "text.secondary",
          fontWeight: 400,
        }}
      >
        © {new Date().getFullYear()} URL Shortener. All rights reserved.
      </Typography>
    </Box>
  );
}
