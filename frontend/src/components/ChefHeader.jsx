import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ChefHeader({ user }) {//component and receive user as props
  const [anchorEl, setAnchorEl] = useState(null);//state for menu anchor element anchorE1 determine where menu opens
  const navigate = useNavigate();//function to change routes 
  const { logout } = useAuth();//get logout function from context

  const handleMenuOpen = (event) => {//function triggered on click
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);//removes anchor so menu closes
  };

  const handleLogout = () => {//clears user session
    logout();
    navigate("/auth/login");//redirect to login page
  };

  const handleProfileClick = () => {
    handleMenuClose();//close the menu first
    const profilePath = user?.role === "admin" ? "/admin/profile" : "/profile";//check if user if yes that redirect to admin panel or redirect to profile
    navigate(profilePath);//navigate to profile path
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        px: 4,
        py: 2,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {user?.name}
        </Typography>

        <IconButton onClick={handleMenuOpen} size="small">
          <AccountCircleIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
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