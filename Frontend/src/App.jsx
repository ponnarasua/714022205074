import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LinkIcon from "@mui/icons-material/Link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HomePage from "./pages/HomePage";
import RedirectPage from "./pages/RedirectPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DeleteAccount from "./components/DeleteAccount";
import { AuthProvider, useAuth } from "./context/AuthContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6",
      dark: "#db2777",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0 2px 4px rgba(0,0,0,0.05)",
    "0 4px 6px rgba(0,0,0,0.07)",
    "0 10px 15px rgba(0,0,0,0.1)",
    "0 20px 25px rgba(0,0,0,0.15)",
    ...Array(20).fill("0 25px 50px rgba(0,0,0,0.25)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          padding: "10px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 12px 24px rgba(99, 102, 241, 0.4)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-1px)",
            },
            "&.Mui-focused": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

function AppContent() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();

  const handleOpenLogin = () => {
    setLoginOpen(true);
    setSignupOpen(false);
  };

  const handleOpenSignup = () => {
    setSignupOpen(true);
    setLoginOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleOpenDeleteAccount = () => {
    setDeleteAccountOpen(true);
    handleMenuClose();
  };

  const handleDeleteSuccess = () => {
    setDeleteAccountOpen(false);
    logout();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth={false} sx={{ flex: 1, px: 0 }}>
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  minHeight: "100vh",
                }}
              >
                {/* Header with Auth */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                }}
              >
                <LinkIcon
                  sx={{
                    fontSize: { xs: 40, md: 56 },
                    color: "primary.main",
                    mr: 2,
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                      "50%": { transform: "translateY(-10px) rotate(5deg)" },
                    },
                    filter: "drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))",
                  }}
                />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: "primary.main",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontWeight: 700,
                  animation: "fadeInUp 0.6s ease-out",
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
                URL Shortener
              </Typography>
            </Box>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Box
                sx={{
                  animation: "fadeIn 0.5s ease-out",
                  "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
                }}
              >
                <IconButton 
                  onClick={handleMenuOpen} 
                  size="large"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 48,
                      height: 48,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(99, 102, 241, 0.5)",
                      },
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 200,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <MenuItem 
                    disabled
                    sx={{
                      opacity: "1 !important",
                      cursor: "default !important",
                      "&:hover": {
                        backgroundColor: "transparent !important",
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="bold" color="text.primary">
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.08)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                  <MenuItem 
                    onClick={handleOpenDeleteAccount}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.dark",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <DeleteForeverIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete Account
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: "flex", 
                  gap: 1.5,
                  animation: "slideInRight 0.6s ease-out",
                  "@keyframes slideInRight": {
                    from: {
                      opacity: 0,
                      transform: "translateX(20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  },
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={handleOpenLogin}
                  sx={{
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      backgroundColor: "rgba(99, 102, 241, 0.08)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AccountCircleIcon />}
                  onClick={handleOpenSignup}
                >
                  Sign Up
                </Button>
              </Box>
            )}
                </Box>

                <HomePage />
              </Box>
            </Container>
          }
        />
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
      
      {/* Auth Dialogs */}
      <Login
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={handleOpenSignup}
      />
      <Signup
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={handleOpenLogin}
      />
      <DeleteAccount
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
