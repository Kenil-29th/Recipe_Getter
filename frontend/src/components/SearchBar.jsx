import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import { useNavigate } from "react-router-dom";
import { recipeAPI } from "../services/api";

function SearchBar() {
  const MIN_REQUIRED = 4;
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const remaining = MIN_REQUIRED - ingredients.length;

  const addIngredient = () => {
    const value = input.trim().toLowerCase();

    if (!value) return;

    // prevent duplicates
    if (ingredients.includes(value)) {
      setInput("");
      return;
    }

    setIngredients([...ingredients, value]);
    setInput("");
  };

  const deleteIngredient = (itemToDelete) => {
    setIngredients(ingredients.filter((item) => item !== itemToDelete));
  };

  const handleGetRecipe = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await recipeAPI.suggestRecipes(ingredients);
      setRecipes(response.data.data.recipes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "30vh",
        backgroundColor: "rgba(248, 249, 250, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 6,
        pb: 4,
      }}
    >
      {/* SEARCH BAR */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "40px",
          p: 1,
          width: "90%",
          maxWidth: "700px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Eg.: chicken, rice, tomato..."
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addIngredient()}
          InputProps={{ disableUnderline: true }}
          sx={{
            ml: 2,
            "& input": {
              py: 1.5,
              fontSize: 16,
            },
          }}
          disabled={loading}
        />

        <Button
          onClick={addIngredient}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#000",
            borderRadius: "30px",
            textTransform: "none",
            px: 4,
            py: 1,
            "&:hover": {
              backgroundColor: "#3e7664",
            },
          }}
        >
          Add
        </Button>
      </Box>

      {/* VALIDATION MESSAGE */}
      {ingredients.length < MIN_REQUIRED && (
  <Typography
    sx={{
      mt: 1.5,
      color: "#3700ff",
      fontSize: 14,
      fontWeight: 600,
      width: "90%",
      maxWidth: "700px",
      textAlign: "left",
    }}
  >
    Add at least {remaining} more ingredient{remaining > 1 && "s"} to continue
  </Typography>
)}

      {/* CHIP LIST */}
      <Stack
        direction="column"
        spacing={1}
        sx={{
          mt: 3,
          width: "90%",
          maxWidth: "700px",
        }}
      >
        {ingredients.map((item, index) => (
          <Chip
            key={index}
            variant="soft"
            color="neutral"
            endDecorator={
              <ChipDelete onDelete={() => deleteIngredient(item)} />
            }
          >
            {item}
          </Chip>
        ))}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 3, width: "90%", maxWidth: "700px" }}>
          {error}
        </Alert>
      )}

      {/* GET RECIPE BUTTON */}
      {ingredients.length >= MIN_REQUIRED && (
        <Box
          sx={{
            mt: 4,
            width: "90%",
            maxWidth: "700px",
            backgroundColor: "#f3f3f3",
            borderRadius: "12px",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: 18 }}>
              Ready for a recipe?
            </Box>

            <Box sx={{ color: "#6b7280", fontSize: 14, mt: 0.5 }}>
              Generate recipes from your ingredients.
            </Box>
          </Box>

          <Button
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "rgb(0, 0, 0)",
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#3e7664",
              },
            }}
            onClick={handleGetRecipe}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Get Recipes"}
          </Button>
        </Box>
      )}

      {/* RECIPES DISPLAY */}
      {recipes.length > 0 && (
        <Box sx={{ width: "90%", maxWidth: "900px" }}>
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 3,
              mb: 3,
            }}
          >
            {recipes.map((recipe) => (
              <Box
                key={recipe._id}
                onClick={() => navigate(`/recipe/${recipe._id}`)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {recipe.image && (
                  <Box
                    component="img"
                    src={recipe.image}
                    alt={recipe.title}
                    sx={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: "8px",
                      mb: 1,
                    }}
                  />
                )}
                <Typography fontWeight="600" sx={{ mb: 0.5 }}>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  By {recipe.chefName}
                </Typography>
                <Typography variant="caption" sx={{ color: "green", fontWeight: "500" }}>
                  Match: {recipe.matchScore} ingredients
                </Typography>
              </Box>
            ))}
          </Box>

          {recipes.length > 6 && (
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#000",
                  color: "#000",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 4,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onClick={() => navigate("/search")}
              >
                View All Results with Filters
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default SearchBar;