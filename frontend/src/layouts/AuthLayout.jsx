import { Box } from "@mui/material";
import auth from "../assets/auth.jpg";

export default function AuthLayout({ children }) {//authentication layout like registraation and login page
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 6,
        }}
      >
        {children}
      </Box>

      {/* RIGHT SIDE IMAGE */}
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${auth})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
        }}
      />
    </Box>
  );
}