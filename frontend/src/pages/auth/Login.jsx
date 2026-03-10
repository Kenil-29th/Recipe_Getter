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
  const {
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
    mode: "onBlur",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.login(data.email.trim(), data.password);
      const { token, user } = response.data.data;

      login(user, token);

      // Redirect based on role
      if (user.role === "admin") {
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
      <Box sx={{ width: 420 }}>
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
          helperText={errors.email?.message}
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
          helperText={errors.password?.message}
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !email || !password}
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