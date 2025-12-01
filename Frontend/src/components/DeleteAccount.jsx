import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import API from "../api";

const steps = ["Confirm Action", "Verify OTP", "Account Deleted"];

export default function DeleteAccount({ open, onClose, onSuccess }) {
  const [activeStep, setActiveStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/delete-account/request-otp");
      setSuccess(response.data.message);
      setOtpSent(true);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndDelete = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/delete-account/verify", { otp });
      setSuccess(response.data.message);
      setActiveStep(2);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (activeStep !== 2 && !loading) {
      setActiveStep(0);
      setOtp("");
      setError("");
      setSuccess("");
      setOtpSent(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "error.main",
          fontWeight: 700,
          fontSize: "1.5rem",
        }}
      >
        <DeleteForeverIcon sx={{ fontSize: 32 }} />
        Delete Account
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box>
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{ mb: 3 }}
            >
              <Typography variant="body2" fontWeight={600}>
                This action cannot be undone!
              </Typography>
            </Alert>

            <Typography variant="body1" gutterBottom>
              Deleting your account will permanently:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Remove all your personal information
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Delete all shortened URLs you created
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Remove all click analytics and history
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
              To confirm, we'll send an OTP to your registered email address.
            </Typography>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Enter the 6-digit OTP sent to your email:
            </Typography>
            <TextField
              fullWidth
              label="OTP Code"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
                setError("");
              }}
              placeholder="000000"
              inputProps={{
                maxLength: 6,
                style: { textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" },
              }}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <DeleteForeverIcon
              sx={{
                fontSize: 80,
                color: "success.main",
                mb: 2,
              }}
            />
            <Typography variant="h6" color="success.main" gutterBottom>
              Account Deleted Successfully
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your account and all associated data have been permanently removed.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {activeStep === 0 && (
          <>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
              sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestOTP}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
              sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyAndDelete}
              color="error"
              variant="contained"
              disabled={loading || otp.length !== 6}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </>
        )}

        {activeStep === 2 && (
          <Button
            onClick={handleClose}
            variant="contained"
            color="success"
            fullWidth
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
