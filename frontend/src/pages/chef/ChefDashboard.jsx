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
import { Trash2, Edit, Plus, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <Box sx={{ display: "flex", minHeight: "100vh", height: { xs: "auto", md: "100vh" }, backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChefHeader user={user} onMenuClick={() => setMobileOpen(true)} />

        <Container maxWidth="lg" sx={{ py: 4, flex: 1, overflowY: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              My Recipes
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/chef/recipes/new")}
              sx={{ background: "#3a5f23", "&:hover": { background: "#2d4620" } }}
            >
              Add New Recipe
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
              <AlertCircle size={48} color="#999" style={{ marginBottom: 16 }} />
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
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            <CheckCircle size={14} color="green" />
                            <Typography sx={{ color: "green", fontSize: 12 }}>
                              Published
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            <Clock size={14} color="orange" />
                            <Typography sx={{ color: "orange", fontSize: 12 }}>
                              Draft
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(recipe._id)}
                          sx={{ 
                            color: "#2563eb",
                            "&:hover": { backgroundColor: "#dbeafe" }
                          }}
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(recipe._id)}
                          sx={{ 
                            color: "#dc2626",
                            "&:hover": { backgroundColor: "#fee2e2" }
                          }}
                        >
                          <Trash2 size={18} />
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AlertCircle size={24} color="#dc2626" />
            <Typography fontWeight="bold">
              Delete Recipe?
            </Typography>
          </Box>
          <Typography color="text.secondary" mb={3}>
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button 
              startIcon={<X size={18} />}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Trash2 size={18} />}
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