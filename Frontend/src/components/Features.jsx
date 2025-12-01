import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import LockClockIcon from "@mui/icons-material/LockClock";
import EditIcon from "@mui/icons-material/Edit";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: "Lightning Fast",
    description: "Generate short URLs in milliseconds",
  },
  {
    icon: <LockClockIcon sx={{ fontSize: 40 }} />,
    title: "Expiration Control",
    description: "Set custom expiration times for your links",
  },
  {
    icon: <EditIcon sx={{ fontSize: 40 }} />,
    title: "Custom IDs",
    description: "Create personalized short links",
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    title: "Click Tracking",
    description: "Monitor your link performance",
  },
];

export default function Features() {
  return (
    <Box 
      sx={{ 
        mt: 6, 
        mb: 4,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "text.primary",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        Why Choose Our URL Shortener?
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
      >
        Powerful features designed to make your link management effortless
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                textAlign: "center",
                background: "#ffffff",
                borderRadius: 3,
                border: "2px solid #e5e7eb",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  borderColor: "primary.main",
                  "& .feature-icon": {
                    transform: "scale(1.1)",
                    backgroundColor: "primary.main",
                  },
                },
              }}
            >
              <Box
                className="feature-icon"
                sx={{
                  display: "inline-flex",
                  p: 2.5,
                  borderRadius: "50%",
                  backgroundColor: "primary.light",
                  color: "white",
                  mb: 2,
                  transition: "all 0.3s ease",
                }}
              >
                {feature.icon}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
