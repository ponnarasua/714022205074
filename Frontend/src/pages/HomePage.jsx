import React from "react";
import { Box, Typography, Container } from "@mui/material";
import ShortenerPage from "./ShortenerPage";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      {/* Subtitle */}
      <Box sx={{ textAlign: "center", mb: 6, maxWidth: 800, mx: "auto" }}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            animation: "fadeInUp 0.6s ease-out 0.2s both",
            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          Create short, memorable URLs with custom IDs, expiration times, and powerful analytics
        </Typography>
      </Box>

      <ShortenerPage />
      
      <Footer />
    </>
  );
}
