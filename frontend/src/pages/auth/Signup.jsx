import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function Signup() {
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
  const confirmPassword = watch("confirmPassword");
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

  const isValidPassword = (pwd) => {
    return (
      pwd.length >= 8 &&
      /[a-z]/.test(pwd) &&
      /[A-Z]/.test(pwd) &&
      /\d/.test(pwd)
    );
  };

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.register(
        data.name.trim(),
        data.email.trim(),
        data.password
      );
      const { token, user } = response.data.data;

      signup(user, token);
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/chef/dashboard");
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.message || "Signup failed. Please try again.",
      });
    }
  };

  return (
    <AuthLayout>
      <Box sx={{ width: { xs: "100%", sm: 420 } }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Get Started Now
        </Typography>

        {errors.root && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <Typography sx={{ mb: 1, fontWeight: 600 }}>Full Name</Typography>

        <TextField
          fullWidth
          placeholder="Enter your full name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={!!errors.name}
          helperText={
            errors.name ? (
              <span style={{ color: "#d32f2f", fontSize: 13 }}>
                 {errors.name.message}
              </span>
            ) : null
          }
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Typography sx={{ mb: 1, fontWeight: 600 }}>Email address</Typography>

        <TextField
          fullWidth
          type="email"
          placeholder="Enter your email"
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
            validate: (value) =>
              isValidPassword(value) ||
              "Password must be 8+ chars with uppercase, lowercase & number",
          })}
          error={!!errors.password}
          helperText={
            errors.password ? (
              <span style={{ color: "#d32f2f", fontSize: 13 }}>
                 {errors.password.message}
              </span>
            ) : (
              <span style={{ color: password && isValidPassword(password) ? "#2e7d32" : "#d32f2f", fontSize: 13 }}>
                {getPasswordStrength(password)}
              </span>
            )
          }
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Typography sx={{ mb: 1, fontWeight: 600 }}>
          Confirm Password
        </Typography>

        <TextField
          fullWidth
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword ? (
              <span style={{ color: "#d32f2f", fontSize: 13 }}>
                 {errors.confirmPassword.message}
              </span>
            ) : null
          }
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Controller
          name="agreed"
          control={control}
          rules={{ required: "Please agree to the terms & policy" }}
          render={({ field }) => (
            <Box>
              <FormControlLabel
                {...field}
                control={<Checkbox {...field} disabled={isSubmitting} />}
                label="I agree to the terms & policy"
                sx={{ color: errors.agreed ? "#d32f2f" : "inherit" }}
              />
              {errors.agreed && (
                <Typography sx={{ color: "#d32f2f", fontSize: "0.75rem", ml: 4 }}>
                  {errors.agreed.message}
                </Typography>
              )}
            </Box>
          )}
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
            "Signup"
          )}
        </Button>

        <Typography mt={3} textAlign="center">
          Have an account?{" "}
          <Link
            to="/auth/login"
            style={{
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}