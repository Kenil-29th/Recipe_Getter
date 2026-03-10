import React from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/chef.png"
export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleSignup = () => {
    navigate("/auth/signup");
  };

  const handleDashboard = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.role === "chef") {
      navigate("/chef/dashboard");
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        py: 0.5,
        px: 1,
      }}
    >
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
    component="img"
    src={logo}
    alt="Virtual Chef Logo"
    sx={{
      height: 32,
      width: 32,
      objectFit: "contain",
    }}
  />
        {/* LOGO AREA */}
        
          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>
            Virtual Chef
          </Typography>
        </Box>

        {/* CENTER NAVIGATION */}
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#1c1c1c",
            borderRadius: "30px",
            px: 1,
            py: 0.5,
            gap: 1,
          }}
        >
          <Button
            sx={{
              color: "#000",
              backgroundColor: "#d9d6f5",
              borderRadius: "20px",
              textTransform: "none",
              px: 2,
              "&:hover": {
                backgroundColor: "#d9d6f5",
              },
            }}
          >
            Home
          </Button>
          <Button
            sx={{
              color: "#fff",
              backgroundColor: "transparent",
              borderRadius: "20px",
              textTransform: "none",
              px: 2,
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            Contact Us
          </Button>
          <Button
            sx={{
              color: "#fff",
              backgroundColor: "transparent",
              borderRadius: "20px",
              textTransform: "none",
              px: 2,
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            About
          </Button>
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Typography sx={{ color: "#fff", mr: 2 }}>
                {user?.name}
              </Typography>
              <Button
                sx={{
                  color: "#000",
                  backgroundColor: "#e6f0ef",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  fontWeight: 500,
                }}
                onClick={handleDashboard}
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{
                  color: "#fff",
                  backgroundColor: "#1c1c1c",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                }}
                onClick={handleLogin}
              >
                Login
              </Button>

              <Button
                sx={{
                  color: "#000",
                  backgroundColor: "#e6f0ef",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  fontWeight: 500,
                }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Box>
    </AppBar>
  );
}