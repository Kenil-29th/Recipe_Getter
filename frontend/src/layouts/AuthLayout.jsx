import { Box } from "@mui/material";
import auth from "../assets/auth.jpg";

export default function AuthLayout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 3, sm: 6 },
          overflowY: "auto",
          py: { xs: 4, sm: 0 },
        }}
      >
        {children}
      </Box>

      {/* RIGHT SIDE IMAGE — hidden on mobile */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${auth})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
        }}
      />
    </Box>
  );
}