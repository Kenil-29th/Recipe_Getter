import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TimerIcon from "@mui/icons-material/Timer";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { recipeAPI } from "../../services/api";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipe = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getRecipeById(id);
      setRecipe(response.data.data.recipe);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flex: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Alert severity="error">{error || "Recipe not found"}</Alert>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
      <Header />

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", p: 3 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            backgroundColor: "#fff",
            borderRadius: "20px",
            p: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 42,
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {recipe.title}
          </Typography>

          <Typography sx={{ color: "#666", fontSize: 14, mb: 2 }}>
            By <strong>{recipe.chefName}</strong>
            {recipe.category && ` • ${recipe.category}`}
          </Typography>

          {/* META */}
          <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            {recipe.prepTime && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TimerIcon fontSize="small" sx={{ color: "#3a5f23" }} />
                <Typography variant="body2">Prep: {recipe.prepTime} min</Typography>
              </Box>
            )}

            {recipe.cookTime && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon fontSize="small" sx={{ color: "#3a5f23" }} />
                <Typography variant="body2">Cook: {recipe.cookTime} min</Typography>
              </Box>
            )}

            {recipe.servings && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantIcon fontSize="small" sx={{ color: "#3a5f23" }} />
                <Typography variant="body2">{recipe.servings} servings</Typography>
              </Box>
            )}
          </Box>

          {/* IMAGE */}
          {recipe.image && (
            <Box
              component="img"
              src={recipe.image}
              alt={recipe.title}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: "18px",
                mb: 4,
              }}
            />
          )}

          {/* CONTENT */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
              gap: 4,
            }}
          >
            {/* INGREDIENTS */}
            <Card
              sx={{
                backgroundColor: "#f9f9f9",
                p: 3,
                borderRadius: 2,
                height: "fit-content",
              }}
            >
              <Typography fontWeight="bold" mb={2} sx={{ fontSize: 16 }}>
                INGREDIENTS
              </Typography>

              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((item, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Chip
                      label={item}
                      variant="outlined"
                      size="small"
                      sx={{ width: "100%" }}
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No ingredients listed
                </Typography>
              )}
            </Card>

            {/* DIRECTIONS */}
            <Card
              sx={{
                backgroundColor: "#f9f9f9",
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography fontWeight="bold" mb={2} sx={{ fontSize: 16 }}>
                DIRECTIONS
              </Typography>

              {recipe.instructions ? (
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
                >
                  {recipe.instructions}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No directions available
                </Typography>
              )}
            </Card>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

