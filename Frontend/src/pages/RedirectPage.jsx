import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function RedirectPage() {
  const { code } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (code) {
      console.log("RedirectPage: Redirecting code:", code);
      console.log("RedirectPage: Target URL:", `${API_BASE_URL}/${code}`);
      // Directly redirect to backend which will handle the redirect
      window.location.href = `${API_BASE_URL}/${code}`;
    } else {
      console.log("RedirectPage: No code found in URL");
    }
  }, [code, API_BASE_URL]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 3,
        px: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Redirecting...
      </Typography>
    </Box>
  );
}
