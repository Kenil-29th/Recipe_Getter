import React from "react";
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
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          p: { xs: 3, md: 5 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Grid container spacing={4} alignItems="flex-start">
          
          {/* LEFT SIDE — BRAND */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Virtual Chef
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Transform ingredients into delicious meals. Discover, cook, and
              enjoy recipes crafted for every kitchen.
            </Typography>

            <Box>
              <IconButton>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton>
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
              <Typography fontWeight={600} gutterBottom>
                Company
              </Typography>

              {["About", "Careers", "Contact", "Partners"].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { color: "#000" },
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
            borderTop: "1px solid #eee",
            mt: 4,
            pt: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 Virtual Chef. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" underline="hover" color="inherit">
              Privacy Policy
            </Link>
            <Link href="#" underline="hover" color="inherit">
              Terms of Service
            </Link>
            <Link href="#" underline="hover" color="inherit">
              Cookies Settings
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}