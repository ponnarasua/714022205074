import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function OTPVerification({ open, onClose, email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { authenticateWithToken } = useAuth();

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/verify-otp", { email, otp });
      setSuccess(response.data.message);
      
  // Authenticate via AuthContext so app state updates immediately
  authenticateWithToken(response.data.token, response.data.user);
      
      setTimeout(() => {
        onVerified(response.data);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
      if (err.response?.data?.attemptsLeft !== undefined) {
        setError(
          `${err.response.data.error} (${err.response.data.attemptsLeft} attempts left)`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/resend-otp", { email });
      setSuccess(response.data.message);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
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
            <MarkEmailReadIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h6">Verify Your Email</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We've sent a 6-digit verification code to <strong>{email}</strong>.
          Please enter it below to verify your email address.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          label="Enter OTP"
          fullWidth
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(value);
            setError("");
          }}
          placeholder="000000"
          inputProps={{
            maxLength: 6,
            style: {
              fontSize: "24px",
              textAlign: "center",
              letterSpacing: "8px",
              fontWeight: "bold",
            },
          }}
          helperText="Enter the 6-digit code"
          sx={{ mb: 2 }}
        />

        <Box sx={{ textAlign: "center" }}>
          {resendTimer > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Resend OTP in {resendTimer} seconds
            </Typography>
          ) : (
            <Button
              variant="text"
              onClick={handleResend}
              disabled={resendLoading}
              startIcon={resendLoading && <CircularProgress size={16} />}
            >
              Resend OTP
            </Button>
          )}
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
          onClick={handleVerify}
          variant="contained"
          disabled={loading || otp.length !== 6}
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
