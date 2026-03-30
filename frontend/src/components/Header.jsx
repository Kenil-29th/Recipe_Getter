import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/chef.png";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDashboard = () => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else if (user?.role === "chef") navigate("/chef/dashboard");
    setDrawerOpen(false);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "transparent", py: 0.5, px: 1 }}>
      <Box
        sx={{
          backgroundColor: "#000",
          borderRadius: "40px",
          px: 2,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Box component="img" src={logo} alt="Virtual Chef Logo" sx={{ height: 32, width: 32, objectFit: "contain" }} />
          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: { xs: 15, sm: 18 } }}>
            Virtual Chef
          </Typography>
        </Box>

        {/* CENTER NAV — desktop only */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            backgroundColor: "#1c1c1c",
            borderRadius: "30px",
            px: 1,
            py: 0.5,
            gap: 1,
          }}
        >
          <Button
            sx={{ color: "#000", backgroundColor: "#d9d6f5", borderRadius: "20px", textTransform: "none", px: 2, "&:hover": { backgroundColor: "#d9d6f5" } }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button sx={{ color: "#fff", borderRadius: "20px", textTransform: "none", px: 2, "&:hover": { backgroundColor: "#333" } }}>
            Contact Us
          </Button>
          <Button sx={{ color: "#fff", borderRadius: "20px", textTransform: "none", px: 2, "&:hover": { backgroundColor: "#333" } }}>
            About
          </Button>
        </Box>

        {/* RIGHT SIDE — desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Typography sx={{ color: "#fff", mr: 1 }}>{user?.name}</Typography>
              <Button
                sx={{ color: "#000", backgroundColor: "#e6f0ef", borderRadius: "20px", textTransform: "none", px: 2, fontWeight: 500 }}
                onClick={handleDashboard}
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{ color: "#fff", backgroundColor: "#1c1c1c", borderRadius: "20px", textTransform: "none", px: 2 }}
                onClick={() => navigate("/auth/login")}
              >
                Login
              </Button>
              <Button
                sx={{ color: "#000", backgroundColor: "#e6f0ef", borderRadius: "20px", textTransform: "none", px: 2, fontWeight: 500 }}
                onClick={() => navigate("/auth/signup")}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>

        {/* HAMBURGER — mobile only */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate("/"); setDrawerOpen(false); }}>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Contact Us" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {isAuthenticated ? (
              <>
                <ListItem>
                  <ListItemText primary={user?.name} secondary="Logged in" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleDashboard}>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { navigate("/auth/login"); setDrawerOpen(false); }}>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { navigate("/auth/signup"); setDrawerOpen(false); }}>
                    <ListItemText primary="Sign up" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
