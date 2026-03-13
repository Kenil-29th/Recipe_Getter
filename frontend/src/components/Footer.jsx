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

import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Footer() {
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
          <Grid item xs={12} md={6}>

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
    enjoy recipes crafted for every kitchen.
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
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: { md: "flex-end" },
            }}
          >
            <Box>
              <Typography fontWeight={600} gutterBottom sx={{ color: "#1a1a1a" }}>
                Company
              </Typography>

              {["About", "Careers", "Contact", "Partners"].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    color: "#555",
                    "&:hover": { color: "#3a5f23", fontWeight: 500 },
                  }}
                >
                  {link}
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