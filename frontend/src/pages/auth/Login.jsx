import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function Login() {
  const {//brain of the form
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { login } = useAuth();//saves user + tokken
  const navigate = useNavigate();//naviagate to the path

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.login(data.email.trim(), data.password);//send email and password to the backend
      const { token, user } = response.data.data;

      login(user, token);//saves information

      // Redirect based on role
      if (user.role === "admin") {//redirection based on the roles
        navigate("/admin/dashboard");
      } else if (user.role === "chef") {
        navigate("/chef/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };

  const email = watch("email");
  const password = watch("password");

  return (
    <AuthLayout>
      <Box sx={{ width: { xs: "100%", sm: 420 } }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Welcome back!
        </Typography>

        <Typography color="text.secondary" mb={4}>
          Enter your Credentials to access your account
        </Typography>

        {errors.root && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <Typography sx={{ mb: 1, fontWeight: 600 }}>Email address</Typography>

        <TextField
          fullWidth
          placeholder="Enter your email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={
            errors.email ? (
              <span style={{ color: "#d32f2f", fontSize: 13 }}>
                 {errors.email.message}
              </span>
            ) : null
          }
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Typography sx={{ mb: 1, fontWeight: 600 }}>Password</Typography>

        <TextField
          fullWidth
          type="password"
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors.password}
          helperText={
            errors.password ? (
              <span style={{ color: "#d32f2f", fontSize: 13 }}>
                 {errors.password.message}
              </span>
            ) : null
          }
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          sx={{
            mt: 2,
            background: "#3a5f23",
            textTransform: "none",
            borderRadius: 2,
            py: 1.5,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Login"
          )}
        </Button>

        <Typography mt={3} textAlign="center">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            style={{
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}