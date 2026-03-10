import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
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
  TextField,
  InputAdornment,
  Pagination,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

export default function AdminRecipes() {
  const { user } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes();
  }, [page, search]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRecipes(page, 10, search);
      setRecipes(response.data.data.recipes || []);
      setTotalPages(response.data.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recipes");
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
      await adminAPI.deleteRecipe(deleteId);
      setRecipes(recipes.filter((r) => r._id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete recipe");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChefHeader user={user} />

        <Container maxWidth="lg" sx={{ py: 4, flex: 1, overflowY: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              All Recipes
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* SEARCH BAR */}
          <Paper sx={{ mb: 3, p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search recipes by title or chef name..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : recipes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No recipes found.
              </Typography>
            </Paper>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableRow>
                      <TableCell fontWeight="bold">Title</TableCell>
                      <TableCell fontWeight="bold">Chef</TableCell>
                      <TableCell fontWeight="bold">Category</TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Prep Time
                      </TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Cook Time
                      </TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Servings
                      </TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Status
                      </TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipes.map((recipe) => (
                      <TableRow key={recipe._id} hover>
                        <TableCell fontWeight="500">{recipe.title}</TableCell>
                        <TableCell>{recipe.chefName || "-"}</TableCell>
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

              {/* PAGINATION */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
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
