import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
    mode: "onChange",
  });

  const password = watch("password");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 8) return "Too short (min 8)";
    if (!/[a-z]/.test(pwd)) return "Add lowercase";
    if (!/[A-Z]/.test(pwd)) return "Add uppercase";
    if (!/\d/.test(pwd)) return "Add number";
    return "✓ Strong";
  };

  const isValidPassword = (pwd) =>
    pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd);

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.register(
        data.name.trim(),
        data.email.trim(),
        data.password
      );
      const { token, user } = response.data.data;
      signup(user, token);
      toast.success("Account created successfully!");
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/chef/dashboard");
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Signup failed. Please try again.",
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
    "& .MuiInputBase-input": { py: 1.4 },
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          width: { xs: "100%", sm: 460 },
          maxHeight: "100vh",
          overflowY: "auto",
          py: { xs: 3, sm: 4 },
          px: { xs: 0, sm: 1 },
          "&::-webkit-scrollbar": { width: 0 },
        }}
      >
        {/* Back arrow */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{ mb: 1, color: "#333", p: 0.5 }}
          aria-label="Go back"
        >
          <ArrowBack />
        </IconButton>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 0.5, color: "#1a1a1a", fontSize: { xs: 26, sm: 32 } }}
        >
          Create an Account
        </Typography>

        {/* <Typography sx={{ color: "#666", mb: 3, fontSize: 14 }}>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            style={{ color: "#3a5f23", fontWeight: 600, textDecoration: "none" }}
          >
            Log in
          </Link>
        </Typography> */}

        {errors.root && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {errors.root.message}
          </Alert>
        )}

        {/* Name & Email — two column on desktop */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13, color: "#333" }}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
              size="small"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={fieldSx}
              disabled={isSubmitting}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13, color: "#333" }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="Email Address"
              type="email"
              size="small"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={fieldSx}
              disabled={isSubmitting}
            />
          </Box>
        </Box>

        {/* Password */}
        <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13, color: "#333" }}>
          Password
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          size="small"
          {...register("password", {
            required: "Password is required",
            validate: (v) =>
              isValidPassword(v) || "8+ chars with uppercase, lowercase & number",
          })}
          error={!!errors.password}
          helperText={
            errors.password?.message || (
              <span
                style={{
                  color: password && isValidPassword(password) ? "#2e7d32" : "#999",
                  fontSize: 12,
                }}
              >
                {getPasswordStrength(password)}
              </span>
            )
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ ...fieldSx, mb: 2 }}
          disabled={isSubmitting}
        />

        {/* Confirm Password */}
        <Typography sx={{ mb: 0.5, fontWeight: 600, fontSize: 13, color: "#333" }}>
          Confirm Password
        </Typography>
        <TextField
          fullWidth
          type="password"
          placeholder="Confirm your password"
          size="small"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ ...fieldSx, mb: 2 }}
          disabled={isSubmitting}
        />

        {/* Submit button */}
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
            py: 1.4,
            fontSize: 15,
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              background: "#3a5f23",
              boxShadow: "0 4px 16px rgba(58,95,35,0.3)",
            },
          }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
        </Button>

        {/* Terms checkbox — below button like the reference */}
        {/* <Controller
          name="agreed"
          control={control}
          rules={{ required: "Please agree to the terms & conditions" }}
          render={({ field }) => (
            <Box sx={{ mt: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    disabled={isSubmitting}
                    size="small"
                    sx={{ color: "#3a5f23", "&.Mui-checked": { color: "#3a5f23" } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, color: "#555" }}>
                    I agree to the{" "}
                    <span style={{ color: "#3a5f23", fontWeight: 600, textDecoration: "underline" }}>
                      Terms & Conditions
                    </span>
                  </Typography>
                }
              />
              {errors.agreed && (
                <Typography sx={{ color: "#d32f2f", fontSize: 12, ml: 4 }}>
                  {errors.agreed.message}
                </Typography>
              )}
            </Box>
          )}
        /> */}

        {/* Divider */}
        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
          <Typography sx={{ px: 2, color: "#999", fontSize: 13 }}>or</Typography>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
        </Box>

        <Typography sx={{ textAlign: "center", color: "#666", fontSize: 13, pb: 2 }}>
          Already a chef?{" "}
          <Link
            to="/auth/login"
            style={{ color: "#3a5f23", fontWeight: 600, textDecoration: "none" }}
          >
            Log in here
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
