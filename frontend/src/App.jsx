import { Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";

const theme = createTheme({
  typography: {
    fontFamily: "'Jost', sans-serif",
  },
});

// Public pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import UserDashboard from "./pages/user/UserDashboard";
import RecipeSearch from "./pages/user/RecipeSearch";
import RecipeDetail from "./pages/user/RecipeDetail";
import ContactUs from "./pages/user/ContactUs";
import About from "./pages/user/About";

// Chef pages
import ChefDashboard from "./pages/chef/ChefDashboard";
import AddRecipePage from "./pages/chef/AddRecipePage";
import ChefProfile from "./pages/chef/ChefProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRecipes from "./pages/admin/AdminRecipes";
import AdminChefs from "./pages/admin/AdminChefs";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* PUBLIC ROUTES — shared Header via layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/recipe/:slug" element={<RecipeDetail />} />
          <Route path="/search" element={<RecipeSearch />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* CHEF ROUTES */}
        <Route
          path="/chef/dashboard"
          element={
            <ProtectedRoute requiredRole="chef">
              <ChefDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/recipes/new"
          element={
            <ProtectedRoute requiredRole="chef">
              <AddRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/recipes/:slug/edit"
          element={
            <ProtectedRoute requiredRole="chef">
              <AddRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="chef">
              <ChefProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recipes"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chefs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminChefs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* 404 FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;