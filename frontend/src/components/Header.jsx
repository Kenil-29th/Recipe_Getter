import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/chef.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Contact Us", path: "/contact" },
  { label: "About", path: "/about" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Refs for sliding pill
  const navContainerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);

  const updatePill = useCallback(() => {
    const idx = activeIndex >= 0 ? activeIndex : 0;
    const btn = buttonRefs.current[idx];
    const container = navContainerRef.current;
    if (btn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setPillStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

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

        {/* CENTER NAV — desktop only with sliding pill */}
        <Box
          ref={navContainerRef}
          sx={{
            display: { xs: "none", md: "flex" },
            backgroundColor: "#1c1c1c",
            borderRadius: "30px",
            px: 1,
            py: 0.5,
            gap: 0.5,
            position: "relative",
            alignItems: "center",
          }}
        >
          {/* Sliding pill background */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: pillStyle.left,
              width: pillStyle.width,
              height: "calc(100% - 8px)",
              backgroundColor: "#d9d6f5",
              borderRadius: "20px",
              transition: "left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
              zIndex: 0,
              boxShadow: "0 4px 12px rgba(217, 214, 245, 0.4)",
            }}
          />

          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                ref={(el) => (buttonRefs.current[idx] = el)}
                onClick={() => navigate(item.path)}
                sx={{
                  color: isActive ? "#000" : "#fff",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  fontWeight: isActive ? 600 : 400,
                  position: "relative",
                  zIndex: 1,
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: isActive ? "#000" : "#ccc",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
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
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem disablePadding key={item.path}>
                  <ListItemButton
                    onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                    sx={{
                      backgroundColor: isActive ? "#e8f5e9" : "transparent",
                      borderLeft: isActive ? "3px solid #3a5f23" : "3px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#3a5f23" : "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
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
