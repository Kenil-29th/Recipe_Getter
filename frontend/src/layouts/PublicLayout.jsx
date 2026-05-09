import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import WordCloud3D from "../components/WordCloud3D";

export default function PublicLayout() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 3D Word Cloud Background — shared across all public pages */}
      <WordCloud3D />

      {/* Dark gradient overlay */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(10, 10, 21, 0.85) 0%, rgba(58, 95, 35, 0.75) 50%, rgba(10, 10, 21, 0.85) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>

      {/* Page content */}
      <Box sx={{ position: "relative", zIndex: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
