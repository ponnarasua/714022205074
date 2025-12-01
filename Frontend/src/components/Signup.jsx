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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import API from "../api";
import OTPVerification from "./OTPVerification";

export default function Signup({ open, onClose, onSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setRegisteredEmail(formData.email);
      setOtpDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
      
      if (err.response?.data?.needsVerification) {
        setRegisteredEmail(formData.email);
        setOtpDialogOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (data) => {
    setOtpDialogOpen(false);
    onClose();
    onSuccess(data);
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
              <PersonAddIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h6">Create Account</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Join URL Shortener and start managing your links efficiently!
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
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
              helperText="Minimum 6 characters"
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Button
                  onClick={onSwitchToLogin}
                  sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                >
                  Login here
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <OTPVerification
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        email={registeredEmail}
        onVerified={handleOTPVerified}
      />
    </>
  );
}
