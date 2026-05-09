import React from "react";
import Logo from "../assets/chef.png"
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const footerLinks = [
  { label: "About", path: "/about" },
  { label: "Careers", path: "#" },
  { label: "Contact", path: "/contact" },
  { label: "Partners", path: "#" },
];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        py: 6,
        display: "flex",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          p: { xs: 3, md: 5 },
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Grid container spacing={4} alignItems="flex-start">
          
          {/* LEFT SIDE — BRAND */}
          <Grid size={{ xs: 12, md: 6 }}>

  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <img 
      src={Logo} 
      alt="Logo" 
      style={{ width: 28, height: 28 }}
    />

    <Typography variant="h6" fontWeight={600} sx={{ color: "#1a1a1a" }}>
      Virtual Chef
    </Typography>
  </Box>

  <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
    Transform ingredients into delicious meals. Discover, cook, and
    enjoy recipes made for every kitchen.
  </Typography>

  <Box>
    <IconButton sx={{ color: "#3a5f23" }}>
      <TwitterIcon fontSize="small" />
    </IconButton>
    <IconButton sx={{ color: "#3a5f23" }}>
      <InstagramIcon fontSize="small" />
    </IconButton>
    <IconButton sx={{ color: "#3a5f23" }}>
      <LinkedInIcon fontSize="small" />
    </IconButton>
    <IconButton sx={{ color: "#3a5f23" }}>
      <GitHubIcon fontSize="small" />
    </IconButton>
  </Box>

</Grid>

          {/* RIGHT SIDE — COMPANY (pushed to right) */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              justifyContent: { md: "flex-end" },
            }}
          >
            <Box>
              <Typography fontWeight={600} gutterBottom sx={{ color: "#1a1a1a" }}>
                Company
              </Typography>

              {footerLinks.map((link) => (
                <Typography
                  key={link.label}
                  variant="body2"
                  onClick={() => link.path !== "#" && navigate(link.path)}
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    color: "#555",
                    "&:hover": { color: "#3a5f23", fontWeight: 500 },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* BOTTOM ROW */}
        <Box
          sx={{
            borderTop: "1px solid #ddd",
            mt: 4,
            pt: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#555" }}>
            © 2026 Virtual Chef. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" underline="hover" sx={{ color: "#555", "&:hover": { color: "#3a5f23" } }}>
              Privacy Policy
            </Link>
            <Link href="#" underline="hover" sx={{ color: "#555", "&:hover": { color: "#3a5f23" } }}>
              Terms of Service
            </Link>
            <Link href="#" underline="hover" sx={{ color: "#555", "&:hover": { color: "#3a5f23" } }}>
              Cookies Settings
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}