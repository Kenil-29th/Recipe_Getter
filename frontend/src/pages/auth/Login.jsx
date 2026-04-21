import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.login(data.email.trim(), data.password);
      const { token, user } = response.data.data;
      login(user, token);
      toast.success("Login successful!");
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "chef") navigate("/chef/dashboard");
      else navigate("/");
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3a5f23" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3a5f23" },
    },
  };

  return (
    <AuthLayout>
      <Box sx={{ width: { xs: "100%", sm: 420 } }}>
        {/* Back arrow */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{ mb: 2, color: "#333" }}
          aria-label="Go back"
        >
          <ArrowBack />
        </IconButton>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 0.5, color: "#1a1a1a", fontSize: { xs: 28, sm: 34 } }}
        >
          Welcome Back Chef!!
        </Typography>

        {/* <Typography sx={{ color: "#666", mb: 4, fontSize: 15 }}>
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            style={{ color: "#3a5f23", fontWeight: 600, textDecoration: "none" }}
          >
            Sign up
          </Link>
        </Typography> */}

        {errors.root && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {errors.root.message}
          </Alert>
        )}

        {/* Email */}
        <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 14, color: "#333" }}>
          Email Address
        </Typography>
        <TextField
          fullWidth
          placeholder="Email Address"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ ...fieldSx, mb: 2.5 }}
          disabled={isSubmitting}
        />

        {/* Password */}
        <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 14, color: "#333" }}>
          Password
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ ...fieldSx, mb: 3 }}
          disabled={isSubmitting}
        />

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          sx={{
            background: "#1a1a1a",
            color: "#fff",
            textTransform: "none",
            borderRadius: "40px",
            py: 1.6,
            fontSize: 16,
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { background: "#3a5f23", boxShadow: "0 4px 16px rgba(58,95,35,0.3)" },
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Log In"}
        </Button>

        {/* Divider */}
        <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
          <Typography sx={{ px: 2, color: "#999", fontSize: 13 }}>or</Typography>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
        </Box>

        <Typography sx={{ textAlign: "center", color: "#666", fontSize: 14 }}>
          New to Virtual Chef?{" "}
          <Link
            to="/auth/signup"
            style={{ color: "#3a5f23", fontWeight: 600, textDecoration: "none" }}
          >
            Create an account
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
