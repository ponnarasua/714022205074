import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import API from "../api";

export default function ShortenerPage() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [customId, setCustomId] = useState("");
  const [short, setShort] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await API.post("/shorturls/", {
        originalUrl: url,
        validity: Number(validity),
        customId: customId,
      });
      setShort(res.data.shortUrl);
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Enter a URL to shorten:</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          label="Original URL"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextField
          label="Validity (seconds)"
          type="number"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
        />
        <TextField
          label="Custom ID"
          fullWidth
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>Shorten</Button>
      </Box>
      {short && (
        <Typography sx={{ mt: 2 }}>
          Short URL: <a href={short}>{short}</a>
        </Typography>
      )}
    </Box>
  );
}
