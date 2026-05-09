import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
} from "@mui/material";
import { ChefHat, Leaf, Users, Sparkles } from "lucide-react";
import Footer from "../../components/Footer";

const values = [
  {
    icon: <ChefHat size={28} />,
    title: "Culinary Excellence",
    description:
      "We believe everyone deserves access to great recipes. Our platform connects home cooks with talented chefs from around the world.",
  },
  {
    icon: <Leaf size={28} />,
    title: "Fresh & Sustainable",
    description:
      "Our ingredient-based approach helps reduce food waste by suggesting recipes based on what you already have in your kitchen.",
  },
  {
    icon: <Users size={28} />,
    title: "Community Driven",
    description:
      "Built by food lovers, for food lovers. Our growing community of chefs shares authentic recipes and cooking tips daily.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Smart Matching",
    description:
      "Our intelligent algorithm matches your available ingredients to the best possible recipes, making meal planning effortless.",
  },
];

const team = [
  {
    name: "Sarah Mitchell",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "James Chen",
    role: "Head Chef & Content",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Priya Sharma",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    name: "Marcus Johnson",
    role: "UX Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
];

const stats = [
  { value: "10K+", label: "Recipes" },
  { value: "500+", label: "Chefs" },
  { value: "50K+", label: "Happy Users" },
  { value: "95%", label: "Satisfaction" },
];

export default function About() {
  return (
    <Box>

        {/* Hero Section */}
        <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 }, px: 2 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color: "#fff",
              mb: 2,
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            About Virtual Chef
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.8)",
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            We're on a mission to make cooking accessible, fun, and waste-free.
            Enter what's in your fridge and discover what you can create.
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          {/* Story Section */}
          <Grid container spacing={4} alignItems="center" sx={{ mb: 10 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80"
                  alt="Chef cooking in kitchen"
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 380 },
                    objectFit: "cover",
                  }}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#fff", mb: 2 }}
              >
                Our Story
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.8,
                  mb: 2,
                }}
              >
                Virtual Chef was born from a simple frustration — staring at a
                fridge full of ingredients with no idea what to cook. We
                realized that millions of people face this daily, often
                resorting to takeout or letting fresh food go to waste.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}
              >
                So we built a platform that flips the script. Instead of
                browsing endless recipes and shopping for ingredients, you tell
                us what you have — and we show you what's possible. It's
                cooking made smarter, simpler, and more sustainable.
              </Typography>
            </Grid>
          </Grid>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 10 }}>
            {stats.map((stat, idx) => (
              <Grid size={{ xs: 6, md: 3 }} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{ color: "#7ecb5a", mb: 0.5 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Values Section */}
          <Box sx={{ mb: 10 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: "#fff", textAlign: "center", mb: 5 }}
            >
              What We Stand For
            </Typography>
            <Grid container spacing={3}>
              {values.map((item, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.12)",
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 32px rgba(58,95,35,0.3)",
                      },
                    }}
                  >
                    <Box sx={{ color: "#7ecb5a", mb: 2 }}>{item.icon}</Box>
                    <Typography
                      fontWeight={600}
                      sx={{ color: "#fff", mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}
                    >
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          {/* <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: "#fff", textAlign: "center", mb: 2 }}
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.7)",
                textAlign: "center",
                mb: 5,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              A passionate group of food enthusiasts, developers, and designers
              building the future of home cooking.
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {team.map((member, idx) => (
                <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.12)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2,
                        border: "3px solid rgba(126,203,90,0.5)",
                      }}
                    />
                    <Typography
                      fontWeight={600}
                      sx={{ color: "#fff", fontSize: 14 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {member.role}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box> */}

          {/* Mission Image */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80"
              alt="Fresh ingredients on table"
              sx={{
                width: "100%",
                height: { xs: 200, md: 350 },
                objectFit: "cover",
              }}
            />
          </Paper>
        </Container>

        <Footer />
    </Box>
  );
}
