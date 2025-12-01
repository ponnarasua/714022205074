import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import API from "../api";

export default function ForgotPassword({ open, onClose, onSwitchToLogin }) {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const steps = ["Enter Email", "Verify OTP", "Reset Password"];

  const handleClose = () => {
    setActiveStep(0);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    onClose();
  };

  const handleRequestOTP = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/forgot-password/request-otp", { email });
      setSuccess(response.data.message);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/forgot-password/reset", {
        email,
        otp,
        newPassword,
      });
      setSuccess(response.data.message);
      setActiveStep(2);
      
      // Auto close and redirect to login after 2 seconds
      setTimeout(() => {
        handleClose();
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Reset Password
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Step 0: Enter Email */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your email address and we'll send you an OTP to reset your password.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              onKeyPress={(e) => e.key === "Enter" && handleRequestOTP()}
            />
          </Box>
        )}

        {/* Step 1: Verify OTP and Enter New Password */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 6-digit OTP sent to <strong>{email}</strong> and your new password.
            </Typography>
            <TextField
              fullWidth
              label="OTP Code"
              value={otp}
              onChange={handleOtpChange}
              disabled={loading}
              inputProps={{
                maxLength: 6,
                style: { 
                  textAlign: "center", 
                  fontSize: "1.5rem", 
                  letterSpacing: "0.5rem",
                  fontWeight: 600,
                }
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: <VpnKeyIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: <VpnKeyIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
            />
          </Box>
        )}

        {/* Step 2: Success */}
        {activeStep === 2 && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Password Reset Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to login...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep === 0 && (
          <>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestOTP}
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
            </Button>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Button
              onClick={() => setActiveStep(0)}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Back
            </Button>
            <Button
              onClick={handleResetPassword}
              variant="contained"
              disabled={loading || otp.length !== 6}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
