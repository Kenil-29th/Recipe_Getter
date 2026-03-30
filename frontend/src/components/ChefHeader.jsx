import { Box, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ChefHeader({ user, onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(user?.role === "admin" ? "/admin/profile" : "/profile");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 2, sm: 4 },
        py: 2,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* Hamburger — mobile only */}
      {isMobile ? (
        <IconButton onClick={onMenuClick} size="small">
          <MenuIcon />
        </IconButton>
      ) : (
        <Box /> /* spacer on desktop */
      )}

      {/* Right side: name + avatar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {user?.name}
        </Typography>

        <IconButton onClick={handleMenuOpen} size="small">
          <AccountCircleIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleProfileClick}>
            <AccountCircleIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
