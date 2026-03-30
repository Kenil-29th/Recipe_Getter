import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Save, X, Calendar } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function AdminProfile() {
  const { user, updateUser } = useAuth();//current loggeddin user,updates global auth state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [formData, setFormData] = useState({//initialize form with current user data use optional chaining(?.) for crash
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;//update only the changed field 
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {//
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      // Call API to update profile in database
      const response = await authAPI.updateProfile(
        formData.name,
        formData.email,
        formData.bio
      );

      // Update local state with new user data
      updateUser(response.data.data.user);

      setSuccess("Profile updated successfully");
      setIsEditing(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {//cancel editing reset to the original value
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
    setError("");
  };

  const getInitials = (name) => {//avatar initial generator
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "A";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", height: { xs: "auto", md: "100vh" }, backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChefHeader user={user} onMenuClick={() => setMobileOpen(true)} />

        <Box sx={{ flex: 1, overflowY: "auto", py: 4, px: 3 }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
              My Profile
            </Typography>

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

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              {/* LEFT SIDE - AVATAR AND BASIC INFO */}
              <Card sx={{ p: 4, borderRadius: 2, height: "fit-content" }}>
                {/* AVATAR SECTION */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      backgroundColor: "#3a5f23",
                      fontSize: 48,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    {getInitials(user?.name)}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                    {user?.role}
                  </Typography>
                </Box>

                {/* QUICK INFO */}
                <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 1, textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                    <Calendar size={14} color="#666" />
                    <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                      Member Since
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : "N/A"}
                  </Typography>
                </Box>
              </Card>

              {/* RIGHT SIDE - EDITABLE PROFILE FIELDS */}
              <Card sx={{ p: 4, borderRadius: 2 }}>
                {/* PROFILE INFO */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Bio
                  </Typography>
                  <TextField
                    fullWidth
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    multiline
                    rows={5}
                    variant="outlined"
                    size="small"
                    placeholder="Tell us about yourself as an administrator..."
                  />
                </Box>

                {/* ACTION BUTTONS */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      startIcon={<Edit size={18} />}
                      onClick={() => setIsEditing(true)}
                      sx={{ background: "#3a5f23", "&:hover": { background: "#2d4620" } }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        startIcon={loading ? null : <Save size={18} />}
                        onClick={handleSave}
                        disabled={loading}
                        sx={{ background: "#3a5f23", "&:hover": { background: "#2d4620" } }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<X size={18} />}
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
