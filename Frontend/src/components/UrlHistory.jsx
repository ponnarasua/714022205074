import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkIcon from "@mui/icons-material/Link";
import API from "../api";

export default function UrlHistory() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, code: null });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await API.get("/shorturls/history");
      setUrls(response.data.urls);
      setError("");
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (shortUrl, id) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async () => {
    const { code } = deleteDialog;
    try {
      await API.delete(`/shorturls/${code}`);
      setUrls(urls.filter((url) => url.code !== code));
      setDeleteDialog({ open: false, code: null });
    } catch (err) {
      setError("Failed to delete URL");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
        }}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading your URLs...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 4,
          borderRadius: 2,
        }}
      >
        {error}
      </Alert>
    );
  }

  if (urls.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ 
          textAlign: "center", 
          py: 6,
          px: 3,
          mt: 4,
          background: "#ffffff",
          borderRadius: 3,
          border: "2px dashed #cbd5e1",
        }}
      >
        <LinkIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom>
          No URLs yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first shortened URL above to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold"
          color="text.primary"
        >
          Your URL History
        </Typography>
        <Chip
          label={`${urls.length} URL${urls.length !== 1 ? 's' : ''}`}
          color="primary"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {urls.map((url, index) => (
        <Paper
          key={url.id}
          elevation={1}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3,
            opacity: isExpired(url.expiresAt) ? 0.7 : 1,
            border: "1px solid #e5e7eb",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 2,
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Original URL */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  mb: 1.5, 
                  display: "block",
                  wordBreak: "break-all",
                  fontWeight: 500,
                }}
              >
                Original: {url.originalUrl}
              </Typography>

              {/* Short URL */}
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1.5, 
                  mb: 2,
                  p: 2,
                  backgroundColor: "rgba(99, 102, 241, 0.05)",
                  borderRadius: 2,
                  border: "1px solid rgba(99, 102, 241, 0.1)",
                }}
              >
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ 
                    fontFamily: "monospace", 
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    flex: 1,
                    wordBreak: "break-all",
                  }}
                >
                  {url.shortUrl}
                </Typography>
                <Tooltip title={copiedId === url.id ? "Copied!" : "Copy URL"}>
                  <IconButton
                    size="medium"
                    onClick={() => handleCopy(url.shortUrl, url.id)}
                    color={copiedId === url.id ? "success" : "primary"}
                    sx={{
                      transition: "all 0.2s ease",
                    }}
                  >
                    {copiedId === url.id ? (
                      <CheckCircleIcon />
                    ) : (
                      <ContentCopyIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Chips */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  icon={<BarChartIcon />}
                  label={`${url.clicks} click${url.clicks !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                {url.isPermanent ? (
                  <Chip
                    label="✓ Permanent"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <Chip
                    icon={<TimerIcon />}
                    label={
                      isExpired(url.expiresAt)
                        ? "Expired"
                        : `Expires ${formatDate(url.expiresAt)}`
                    }
                    size="small"
                    color={isExpired(url.expiresAt) ? "error" : "warning"}
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Chip
                  label={`Created ${formatDate(url.createdAt)}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Actions */}
            <Tooltip title="Delete URL">
              <IconButton
                size="medium"
                color="error"
                onClick={() => setDeleteDialog({ open: true, code: url.code })}
                sx={{
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, code: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
          🗑️ Delete URL?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this shortened URL? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, code: null })}
            variant="outlined"
            sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
