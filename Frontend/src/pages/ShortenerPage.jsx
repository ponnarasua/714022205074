import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkIcon from "@mui/icons-material/Link";
import TimerIcon from "@mui/icons-material/Timer";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import API from "../api";
import Features from "../components/Features";
import { useAuth } from "../context/AuthContext";
import UrlHistory from "../components/UrlHistory";

export default function ShortenerPage() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("3600");
  const [customId, setCustomId] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);
  const [short, setShort] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { isAuthenticated } = useAuth();

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    if (validity && (isNaN(validity) || Number(validity) <= 0)) {
      setError("Validity must be a positive number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/shorturls/", {
        originalUrl: url,
        validity: Number(validity) || 3600,
        customId: customId.trim(),
        isPermanent: isPermanent,
      });
      setShort(res.data.shortUrl);
      setExpiresAt(res.data.expiresAt);
      setSnackbar({
        open: true,
        message: isPermanent ? "Permanent URL created successfully!" : "Short URL created successfully!",
        severity: "success",
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create short URL";
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      setSnackbar({
        open: true,
        message: "Copied to clipboard!",
        severity: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to copy",
        severity: "error",
      });
    }
  };

  const handleReset = () => {
    setUrl("");
    setValidity("3600");
    setCustomId("");
    setIsPermanent(false);
    setShort("");
    setExpiresAt("");
    setError("");
    setCopied(false);
  };

  const formatExpiryTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    if (diffHours > 0) return `Expires in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    if (diffMins > 0) return `Expires in ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    return "Expires soon";
  };

  return (
    <Box>
      {/* Input Section */}
      <Paper
        elevation={1}
        sx={{
          mb: 3,
          p: 3,
          background: "#ffffff",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <TextField
          label="Enter your long URL"
          placeholder="https://example.com/very-long-url-here"
          fullWidth
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          error={!!error && !url.trim()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: 2,
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label="Expiration Time (seconds)"
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            disabled={isPermanent}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TimerIcon color={isPermanent ? "disabled" : "primary"} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1, 
              minWidth: "200px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: 2,
              },
            }}
            helperText={isPermanent ? "Permanent URLs don't expire" : "Default: 3600s (1 hour) if you need permanent url, please login"}
          />
          <TextField
            label="Custom ID (optional)"
            placeholder="my-custom-link"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EditIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1, 
              minWidth: "200px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: 2,
              },
            }}
            helperText="Leave empty for random ID"
          />
        </Box>

        {isAuthenticated && (
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              backgroundColor: "white",
              borderRadius: 2,
              border: isPermanent ? "2px solid #10b981" : "1px solid #e2e8f0",
              transition: "all 0.3s ease",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isPermanent}
                  onChange={(e) => setIsPermanent(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SaveIcon fontSize="small" color={isPermanent ? "success" : "action"} />
                  <Typography variant="body2" fontWeight={isPermanent ? 600 : 400}>
                    Save Permanently (No Expiration)
                  </Typography>
                </Box>
              }
            />
            {isPermanent && (
              <Typography variant="caption" color="success.main" sx={{ ml: 5, display: "block", mt: 0.5 }}>
                ✓ This URL will never expire
              </Typography>
            )}
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              animation: "shake 0.5s",
              "@keyframes shake": {
                "0%, 100%": { transform: "translateX(0)" },
                "25%": { transform: "translateX(-10px)" },
                "75%": { transform: "translateX(10px)" },
              },
            }} 
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
          {short && (
            <Button 
              variant="outlined" 
              onClick={handleReset} 
              sx={{ 
                minWidth: "120px",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              New URL
            </Button>
          )}
        </Box>
      </Paper>

      {/* Result Section */}
      {short && (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            background: "#f0fdf4",
            borderRadius: 3,
            border: "2px solid #10b981",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CheckCircleIcon 
              sx={{ 
                color: "success.main", 
                fontSize: 32,
                mr: 1.5,
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{
                color: "success.main",
                fontWeight: 700,
              }}
            >
              Your shortened URL is ready!
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              mb: 3,
              border: "2px solid #e5e7eb",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Typography
              sx={{
                flex: 1,
                wordBreak: "break-all",
                fontFamily: "monospace",
                fontSize: { xs: "1rem", sm: "1.2rem" },
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              {short}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton
                onClick={handleCopy}
                color={copied ? "success" : "primary"}
                sx={{
                  bgcolor: copied ? "success.light" : "primary.light",
                  width: 48,
                  height: 48,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: copied ? "success.main" : "primary.main",
                    color: "white",
                    transform: "scale(1.1) rotate(5deg)",
                  },
                }}
              >
                {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          {expiresAt && (
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
              <Chip
                icon={<TimerIcon />}
                label={formatExpiryTime(expiresAt)}
                color="warning"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  py: 2.5,
                }}
              />
              <Chip
                label={`Expires: ${new Date(expiresAt).toLocaleString()}`}
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  py: 2.5,
                }}
              />
            </Box>
          )}
        </Paper>
      )}

      {/* Features Section */}
      {!short && <Features />}

      {/* URL History for authenticated users */}
      {isAuthenticated && <UrlHistory />}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

