import React from "react";
import { Container, Typography } from "@mui/material";
import ShortenerPage from "./pages/ShortenerPage";

export default function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        MERN URL Shortener 🔗
      </Typography>
      <ShortenerPage />
    </Container>
  );
}
