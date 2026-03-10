import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { chefAPI } from "../../services/api";

export default function ChefDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await chefAPI.getMyRecipes();
      setRecipes(response.data.data.recipes || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch recipes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await chefAPI.deleteRecipe(deleteId);
      setRecipes(recipes.filter((r) => r._id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete recipe");
    }
  };

  const handleEdit = (id) => {
    navigate(`/chef/recipes/${id}/edit`);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChefHeader user={user} />

        <Container maxWidth="lg" sx={{ py: 4, flex: 1, overflowY: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              My Recipes
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/chef/recipes/new")}
              sx={{ background: "#3a5f23" }}
            >
              + Add New Recipe
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : recipes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No recipes yet. Create your first recipe!
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell fontWeight="bold">Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Prep Time</TableCell>
                    <TableCell align="center">Cook Time</TableCell>
                    <TableCell align="center">Servings</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow key={recipe._id} hover>
                      <TableCell fontWeight="500">{recipe.title}</TableCell>
                      <TableCell>{recipe.category || "-"}</TableCell>
                      <TableCell align="center">{recipe.prepTime || "-"} min</TableCell>
                      <TableCell align="center">{recipe.cookTime || "-"} min</TableCell>
                      <TableCell align="center">{recipe.servings || "-"}</TableCell>
                      <TableCell align="center">
                        {recipe.isPublished ? (
                          <Typography sx={{ color: "green", fontSize: 12 }}>
                            Published
                          </Typography>
                        ) : (
                          <Typography sx={{ color: "orange", fontSize: 12 }}>
                            Draft
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(recipe._id)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(recipe._id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography fontWeight="bold" mb={2}>
            Delete Recipe?
          </Typography>
          <Typography color="text.secondary" mb={3}>
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}