import { Layout, BarChart, Layers, User, BookOpen, Plus } from "lucide-react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/chef.png";

// Shared nav content used in both desktop sidebar and mobile drawer
function NavContent({ isAdmin, isCollapsed, handleNavigation }) {
  return (
    <Box sx={{ flex: 1 }}>
      {isAdmin ? (
        <>
          {!isCollapsed && (
            <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>OVERVIEW</Typography>
          )}
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/admin/dashboard")}>
            <BarChart size={18} />
            {!isCollapsed && "Dashboard"}
          </Button>

          {!isCollapsed && (
            <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>MANAGE</Typography>
          )}
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/admin/recipes")}>
            <Layers size={18} />
            {!isCollapsed && "All Recipes"}
          </Button>
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/admin/chefs")}>
            <Layout size={18} />
            {!isCollapsed && "Chefs"}
          </Button>

          {!isCollapsed && (
            <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>SETTINGS</Typography>
          )}
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/admin/profile")}>
            <User size={18} />
            {!isCollapsed && "My Profile"}
          </Button>
        </>
      ) : (
        <>
          {!isCollapsed && (
            <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>RECIPES</Typography>
          )}
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/chef/dashboard")}>
            <BookOpen size={18} />
            {!isCollapsed && "My Recipes"}
          </Button>
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/chef/recipes/new")}>
            <Plus size={18} />
            {!isCollapsed && "Add Recipe"}
          </Button>

          {!isCollapsed && (
            <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>SETTINGS</Typography>
          )}
          <Button fullWidth sx={navBtn(isCollapsed)} onClick={() => handleNavigation("/profile")}>
            <User size={18} />
            {!isCollapsed && "My Profile"}
          </Button>
        </>
      )}
    </Box>
  );
}

const navBtn = (isCollapsed) => ({
  color: "#fff",
  justifyContent: isCollapsed ? "center" : "flex-start",
  mb: 1,
  textTransform: "none",
  gap: 1,
  minWidth: 0,
  p: isCollapsed ? 1 : 1.5,
  borderRadius: 2,
  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
});

export default function Sidebar({ user, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  const toggle = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebarCollapsed", next);
  };

  const isAdmin = user?.role === "admin";

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onMobileClose) onMobileClose();
  };

  // ── MOBILE: full drawer overlay ──────────────────────────────────────────
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={!!mobileOpen}
        onClose={onMobileClose}
        PaperProps={{
          sx: {
            width: 240,
            background: "linear-gradient(180deg,#1e3b2f,#244a3a)",
            color: "#fff",
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4, cursor: "pointer" }}
          onClick={() => handleNavigation("/")}
        >
          <Box component="img" src={logo} alt="Virtual Chef Logo" sx={{ width: 32, height: 32 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18 }}>Virtual Chef</Typography>
        </Box>

        <NavContent isAdmin={isAdmin} isCollapsed={false} handleNavigation={handleNavigation} />
      </Drawer>
    );
  }

  // ── DESKTOP: collapsible sidebar ─────────────────────────────────────────
  return (
    <Box
      sx={{
        width: isCollapsed ? 56 : 250,
        height: "100vh",
        background: "linear-gradient(180deg,#1e3b2f,#244a3a)",
        color: "#fff",
        p: isCollapsed ? 0.5 : 2,
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        alignItems: isCollapsed ? "center" : "stretch",
        flexShrink: 0,
      }}
    >
      {/* Collapse toggle button */}
      <IconButton
        onClick={toggle}
        sx={{
          position: "absolute",
          right: -12,
          top: 40,
          background: "#fff",
          width: 24,
          height: 24,
          padding: 0,
          zIndex: 10,
          "&:hover": { background: "#eee" },
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </IconButton>

      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: 1,
          mb: 4,
          cursor: "pointer",
        }}
        onClick={() => handleNavigation("/")}
      >
        <Box component="img" src={logo} alt="Virtual Chef Logo" sx={{ width: 32, height: 32 }} />
        {!isCollapsed && (
          <Typography sx={{ fontWeight: 600, fontSize: 18 }}>Virtual Chef</Typography>
        )}
      </Box>

      <NavContent isAdmin={isAdmin} isCollapsed={isCollapsed} handleNavigation={handleNavigation} />
    </Box>
  );
}
