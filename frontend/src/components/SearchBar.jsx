import React, { useState , useEffect} from "react";
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
  useEffect(() => {//load ingredient from session
  const savedIngredients = sessionStorage.getItem("ingredients");

  if (savedIngredients) {//restore from session
    setIngredients(JSON.parse(savedIngredients));
    }
  }, []);

  useEffect(() => {//load recipes
    sessionStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);
  useEffect(() => {
  const savedRecipes = sessionStorage.getItem("recipes");

  if (savedRecipes) {
    setRecipes(JSON.parse(savedRecipes));
    }
  }, []);
  useEffect(() => {//save the recipe
  sessionStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);
  useEffect(() => {//clear on refresh
  const handleBeforeUnload = () => {
    sessionStorage.clear();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const remaining = MIN_REQUIRED - ingredients.length;

  const addIngredient = () => {
    const value = input.trim().toLowerCase();

    if (!value) return;

    // prevent duplicates
    if (ingredients.includes(value)) {//doesnt allow duplicate key
      setInput("");
      return;
    }

    setIngredients([...ingredients, value]);//add new ingredient
    setInput("");
  };

  const deleteIngredient = (itemToDelete) => {//delete ingredient
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
        backgroundColor: "transparent",
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
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "40px",
          p: 1,
          width: "90%",
          maxWidth: "700px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Eg.: chicken, rice, tomato..."
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}

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
            backgroundColor: "#2d4a1c",
            borderRadius: "30px",
            textTransform: "none",
            px: 4,
            py: 1,
            "&:hover": {
              backgroundColor: "#000",
            },
          }}
        >
          Add
        </Button>
      </Box>

      {/* VALIDATION MESSAGE
      {ingredients.length < MIN_REQUIRED && ingredients.length > 0 && (
  <Typography
    sx={{
      mt: 1.5,
      color: "#ffffff",
      backgroundColor: "rgba(58, 95, 35, 0.8)",
      backdropFilter: "blur(10px)",
      fontSize: 14,
      fontWeight: 600,
      width: "90%",
      maxWidth: "700px",
      textAlign: "center",
      px: 3,
      py: 1.5,
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    }}
  >
    Add at least {remaining} more ingredient{remaining > 1 && "s"} to continue
  </Typography>
)} */}
            {/* VALIDATION MESSAGE */}
        {ingredients.length < MIN_REQUIRED && ingredients.length > 0 && (
          <Typography
            sx={{
              mt: 1.5,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
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
        <Alert 
          severity="error" 
          sx={{ 
            mt: 3, 
            width: "90%", 
            maxWidth: "700px",
            backgroundColor: "rgba(211, 47, 47, 0.95)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "& .MuiAlert-icon": { color: "#fff" }
          }}
        >
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
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Box>
            <Box sx={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>
              Ready for a recipe?
            </Box>

            <Box sx={{ color: "#666", fontSize: 14, mt: 0.5 }}>
              Generate delicious recipes from your ingredients.
            </Box>
          </Box>

          <Button
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor:"#2d4a1c",
              textTransform: "none",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 4px 12px rgba(58, 95, 35, 0.4)",
              "&:hover": {
                backgroundColor: "#000",
                // transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(58, 95, 35, 0.5)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={handleGetRecipe}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Get Recipes"}
          </Button>
        </Box>
      )}

      {/* NO RECIPES FOUND MESSAGE
      {!loading && recipes.length === 0 && ingredients.length >= MIN_REQUIRED && !error && (
        <Box
          sx={{
            mt: 4,
            width: "90%",
            maxWidth: "700px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            p: 4,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 2,
            }}
          >
            No Recipes Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mb: 2,
            }}
          >
            We couldn't find any recipes matching your ingredients.
          </Typography>
        </Box>
      )} */}

      {/* RECIPES DISPLAY */}
      {recipes.length > 0 && (
        <Box sx={{ width: "90%", maxWidth: "900px" }}>
          <Typography
            variant="h5"
            sx={{
              mt: 4,
              mb: 3,
              color: "#ffffff",
              fontWeight: 700,
              textAlign: "center",
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Found {recipes.length} Perfect {recipes.length === 1 ? 'Recipe' : 'Recipes'} for You!
          </Typography>
          <Box
            sx={{
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
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    boxShadow: "0 12px 24px rgba(58, 95, 35, 0.4)",
                    transform: "translateY(-8px) scale(1.02)",
                    backgroundColor: "rgba(255, 255, 255, 1)",
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
                      height: 180,
                      objectFit: "cover",
                      borderRadius: "12px",
                      mb: 1.5,
                    }}
                  />
                )}
                <Typography fontWeight="700" sx={{ mb: 0.5, fontSize: 16, color: "#1a1a1a" }}>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "#666", fontStyle: "italic" }}>
                  {recipe.chefName}
                </Typography>
                <Box
                  sx={{
                    display: "inline-block",
                    backgroundColor: "#e8f5e9",
                    color: "#2e7d32",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Match: {recipe.matchScore}
                </Box>
              </Box>
            ))}
          </Box>

          {recipes.length > 6 && (
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  color: "#3a5f23",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#3a5f23",
                    color: "#fff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(58, 95, 35, 0.4)",
                  },
                  transition: "all 0.3s ease",
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