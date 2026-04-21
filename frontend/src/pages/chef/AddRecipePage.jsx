import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Upload, Plus, X, CheckCircle, Image as ImageIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { chefAPI, recipeAPI } from "../../services/api";

export default function AddRecipePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditing = !!slug;
  
  const [recipeId, setRecipeId] = useState(null); // actual _id for API calls
  const [title, setTitle] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [category, setCategory] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Load existing recipe if editing
  useEffect(() => {
    if (isEditing) {
      loadRecipe();
    }
  }, [slug]);

  const loadRecipe = async () => {
    try {
      setInitialLoading(true);
      const response = await recipeAPI.getRecipeById(slug);
      const recipe = response.data.data.recipe;
      
      setRecipeId(recipe._id); // store the real _id for edit/update calls
      setTitle(recipe.title || "");
      setIngredients(recipe.ingredients || []);
      setInstructions(recipe.instructions || "");
      setCategory(recipe.category || "");
      setPrepTime(recipe.prepTime || "");
      setCookTime(recipe.cookTime || "");
      setServings(recipe.servings || "");
      setIsPublished(recipe.isPublished !== false);
      
      // Set image preview if it exists
      if (recipe.image) {
        setImagePreview(recipe.image);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load recipe");
    } finally {
      setInitialLoading(false);
    }
  };

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    if (ingredients.includes(ingredientInput.trim())) return;
    setIngredients([...ingredients, ingredientInput.trim()]);
    setIngredientInput("");
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(''); // Clear any previous errors
    }
  };

  const handlePublish = async () => {
    setError("");
    
    if (!title.trim()) {
      setError("Recipe title is required");
      return;
    }
    
    if (ingredients.length < 1) {
      setError("At least one ingredient is required");
      return;
    }
    
    if (!instructions.trim()) {
      setError("Instructions are required");
      return;
    }

    // For new recipes, image is required; for editing, it's optional
    if (!isEditing && !imageFile) {
      setError("Image is required for new recipes");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("instructions", instructions);
      formData.append("category", category);
      formData.append("prepTime", prepTime || 0);
      formData.append("cookTime", cookTime || 0);
      formData.append("servings", servings || 1);
      formData.append("isPublished", isPublished);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing) {
        await chefAPI.editRecipe(recipeId, formData);
        toast.success("Recipe updated successfully!");
      } else {
        await chefAPI.addRecipe(formData);
        toast.success("Recipe published successfully!");
      }
      
      navigate("/chef/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish recipe. Please try again.");
      setError(err.response?.data?.message || "Failed to publish recipe");
    } finally {
      setLoading(false);
    }
  };

  const readyToPublish = isEditing
    ? title && ingredients.length >= 1 && instructions
    : title && ingredients.length >= 1 && instructions && imageFile;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", height: { xs: "auto", md: "100vh" }, backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChefHeader user={user} onMenuClick={() => setMobileOpen(true)} />

        <Box sx={{ flex: 1, overflow: "auto", p: 4 }}>
          {initialLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4">{isEditing ? "Edit Recipe" : "Add New Recipe"}</Typography>
              <Typography color="text.secondary">
                {isEditing ? "Update your recipe" : "Share your culinary creation"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button 
                startIcon={<X size={18} />}
                onClick={() => navigate("/chef/dashboard")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? null : <CheckCircle size={18} />}
                color="success"
                onClick={handlePublish}
                disabled={loading || !readyToPublish}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? "Update Recipe" : "Publish Recipe")}
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* ROW 1 - COLUMN 1: RECIPE DETAILS */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight={600} mb={2}>
                  RECIPE DETAILS
                </Typography>

                <TextField
                  fullWidth
                  label="Recipe Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 3 }}
                  disabled={loading}
                />

                <Typography mb={1}>
                  Ingredients (minimum 4)
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {ingredients.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => removeIngredient(item)}
                      disabled={loading}
                    />
                  ))}
                </Stack>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Type an ingredient..."
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}

                    disabled={loading}
                  />

                  <Button
                    variant="contained"
                    onClick={addIngredient}
                    disabled={loading}
                  >
                    Add
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={loading}
                />
              </Paper>
            </Grid>

            {/* ROW 1 - COLUMN 2: RECIPE IMAGE */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight={600} mb={2}>
                  RECIPE IMAGE
                </Typography>

                <Box
                  sx={{
                    height: 200,
                    background: imagePreview ? "transparent" : "#1e3b2f",
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    overflow: "hidden",
                    border: imagePreview ? "2px solid #e0e0e0" : "2px dashed #4a4a4a",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Box sx={{ textAlign: "center" }}>
                      <ImageIcon size={48} color="#fff" style={{ marginBottom: 8 }} />
                      <Typography color="#fff" variant="body2">No image selected</Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  disabled={loading}
                  startIcon={<Upload size={18} />}
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input 
                    type="file" 
                    hidden 
                    onChange={handleImageUpload} 
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    key={imagePreview} // Force re-render when image changes
                  />
                </Button>

                {/* READY CHECKLIST */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    background: "#e8f5e9",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600} mb={1}>
                    {isEditing ? "Ready to Update" : "Ready to Publish"}
                  </Typography>

                  <Typography variant="body2">
                    {title ? "✓ Title filled" : "• Title missing"}
                  </Typography>

                  <Typography variant="body2">
                    {ingredients.length >= 1
                      ? "✓ Ingredients added"
                      : "• Add ingredients"}
                  </Typography>

                  <Typography variant="body2">
                    {instructions ? "✓ Instructions filled" : "• Instructions missing"}
                  </Typography>

                  {!isEditing && (
                    <Typography variant="body2">
                      {imageFile ? "✓ Image uploaded" : "• Upload image"}
                    </Typography>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={loading ? null : <CheckCircle size={18} />}
                  sx={{ mt: 3 }}
                  onClick={handlePublish}
                  disabled={!readyToPublish || loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? "Update Recipe" : "Publish Recipe")}
                </Button>
              </Paper>
            </Grid>

            {/* ROW 2 - COLUMN 1: ADDITIONAL DETAILS */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight={600} mb={2}>
                  ADDITIONAL DETAILS (OPTIONAL)
                </Typography>

                <TextField
                  label="Category"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={loading}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Prep Time (min)"
                      fullWidth
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Cook Time (min)"
                      fullWidth
                      type="number"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Servings"
                  fullWidth
                  type="number"
                  sx={{ mt: 2 }}
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  disabled={loading}
                />
              </Paper>
            </Grid>
          </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}