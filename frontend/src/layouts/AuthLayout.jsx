import { Box, Typography } from "@mui/material";
import auth from "../assets/auth.jpg";
import logo from "../assets/chef.png";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #f0f4ec 0%, #e8efe3 50%, #dce6d5 100%)",
      }}
    >
      {/* LEFT SIDE — Image panel */}
      <Box
        sx={{
          width: { md: "45%", lg: "42%" },
          display: { xs: "none", md: "flex" },
          position: "relative",
          m: 2,
          borderRadius: "24px",
          overflow: "hidden",
          backgroundImage: `url(${auth})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        {/* <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(10,20,10,0.5) 0%, rgba(10,20,10,0.3) 50%, rgba(10,20,10,0.6) 100%)",
          }}
        /> */}

        {/* Logo */}
        <Box sx={{ position: "absolute", top: 32, left: 32, zIndex: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="img" src={logo} alt="Virtual Chef Logo" sx={{ width: 36, height: 36 }} />
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Virtual Chef
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE — Form */}
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
    </Box>
  );
}
