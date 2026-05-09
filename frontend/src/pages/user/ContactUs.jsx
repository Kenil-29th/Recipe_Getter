import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import Footer from "../../components/Footer";

const contactInfo = [
  {
    icon: <Mail size={24} />,
    title: "Email Us",
    detail: "support@virtualchef.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: <Phone size={24} />,
    title: "Call Us",
    detail: "+91 9313605123",
    sub: "Mon–Fri, 9am–6pm EST",
  },
  {
    icon: <MapPin size={24} />,
    title: "Visit Us",
    detail: "Valsad, Gujarat",
    sub: "India – 396001",
  },
  {
    icon: <Clock size={24} />,
    title: "Working Hours",
    detail: "Mon – Fri: 9AM – 6PM",
    sub: "Sat – Sun: 10AM – 4PM",
  },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // EmailJS sends the email directly — no backend needed
      // Replace these IDs with your own from https://www.emailjs.com/
      await emailjs.send(
        "service_puv1dxf",      // e.g., "service_abc123"
        "template_kea6rjo",     // e.g., "template_xyz789"
        {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "yHkhDOlF3DoBiHp5q"       // e.g., "AbCdEfGhIjKlMn"
      );

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 6, md: 10 },
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
            sx={{
              color: "#fff",
              mb: 2,
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.8)",
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
            }}
          >
            Have a question, suggestion, or just want to say hello? We'd love to
            hear from you.
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          <Grid container spacing={4}>
            {/* Contact Info Cards */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={2}>
                {contactInfo.map((item, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 12 }} key={idx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.12)",
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(58,95,35,0.3)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: "#7ecb5a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          fontWeight={600}
                          sx={{ color: "#fff", mb: 0.5 }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.9)" }}
                        >
                          {item.detail}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {item.sub}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{ mb: 3, color: "#1a1a1a" }}
                >
                  Send us a message
                </Typography>

                <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name *"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Email Address *"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      type="email"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Subject *"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Your Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={5}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mt: 1,
                        py: 1.5,
                        backgroundColor: "#3a5f23",
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 16,
                        "&:hover": {
                          backgroundColor: "#2e4d1b",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Map Section */}
          <Box sx={{ mt: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59873.94564698098!2d72.89!3d20.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0e46e3b7e24e7%3A0x637f0a6a0d23b62!2sValsad%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                title="Our Location"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sx={{
                  width: "100%",
                  height: { xs: 250, md: 400 },
                  border: "none",
                  display: "block",
                }}
              />
            </Paper>
          </Box>
        </Container>

        <Footer />
    </Box>
  );
}
