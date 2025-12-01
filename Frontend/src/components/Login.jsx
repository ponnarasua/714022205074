import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../context/AuthContext";
import OTPVerification from "./OTPVerification";
import ForgotPassword from "./ForgotPassword";

export default function Login({ open, onClose, onSuccess, onSwitchToSignup }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || "Login failed. Please try again.");
      
      // If email not verified, show OTP dialog
      if (errorData?.needsVerification) {
        setUnverifiedEmail(formData.email);
        setOtpDialogOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setOtpDialogOpen(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LoginIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h6">Login</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Welcome back! Please login to your account.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              autoComplete="email"
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 1 }}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mb: 2 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{ 
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button
                  onClick={onSwitchToSignup}
                  sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                >
                  Sign up here
                </Button>
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <OTPVerification
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        email={unverifiedEmail}
        onVerified={handleOTPVerified}
      />

      <ForgotPassword
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onSwitchToLogin={() => {
          setForgotPasswordOpen(false);
          // Login dialog is already open
        }}
      />
    </>
  );
}
