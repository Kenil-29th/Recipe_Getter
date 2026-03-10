import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import logo from "../assets/chef.png"
export default function Sidebar({ user }) {
  const navigate = useNavigate();
  // const { logout } = useAuth();

  const isAdmin = user?.role === "admin";

  // const handleLogout = () => {
  //   logout();
  //   navigate("/auth/login");
  // };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        background: "linear-gradient(180deg,#1e3b2f,#244a3a)",
        color: "#fff",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          cursor: "pointer",
          transition: "opacity 0.3s",
          "&:hover": {
            opacity: 0.8
          }
        }}
        onClick={() => handleNavigation("/")}
      >
        <Box
          component="img"
          src={logo}
          alt="Virtual Chef Logo"
          sx={{
            height: 32,
            width: 32,
            objectFit: "contain",
            paddingBottom: 2
          }}
        />
        <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 18, paddingBottom: 2 }}>
          Virtual Chef
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        {/* ADMIN PANEL */}
        {isAdmin && (
          <>
            <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
              OVERVIEW
            </Typography>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", mb: 2, textTransform: "none" }}
              onClick={() => handleNavigation("/admin/dashboard")}
            >
              📊 Dashboard
            </Button>

            <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>
              MANAGE
            </Typography>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", mb: 2, textTransform: "none" }}
              onClick={() => handleNavigation("/admin/recipes")}
            >
              📖 All Recipes
            </Button>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", textTransform: "none" }}
              onClick={() => handleNavigation("/admin/chefs")}
            >
              👨‍🍳 Chefs
            </Button>

            <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>
              SETTINGS
            </Typography>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", textTransform: "none" }}
              onClick={() => handleNavigation("/admin/profile")}
            >
              👤 My Profile
            </Button>
          </>
        )}

        {/* CHEF PANEL */}
        {!isAdmin && (
          <>
            <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
              RECIPES
            </Typography>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", mb: 2, textTransform: "none" }}
              onClick={() => handleNavigation("/chef/dashboard")}
            >
              📚 My Recipes
            </Button>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", mb: 3, textTransform: "none" }}
              onClick={() => handleNavigation("/chef/recipes/new")}
            >
              ➕ Add Recipe
            </Button>

            <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
              SETTINGS
            </Typography>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: "flex-start", textTransform: "none" }}
              onClick={() => handleNavigation("/profile")}
            >
              👤 My Profile
            </Button>
          </>
        )}
      </Box>

      {/* <Button
        fullWidth
        sx={{
          color: "#fff",
          justifyContent: "flex-start",
          textTransform: "none",
          
          backgroundColor: "rgba(255,255,255,0.1)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },    

        }}
        onClick={handleLogout}
      >
        🚪 Logout
      </Button> */}
    </Box>
  );
}