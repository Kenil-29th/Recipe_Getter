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
import { Trash2, Search, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [deleteName, setDeleteName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {//runs when page changes,search changes
    fetchRecipes();
  }, [page, search]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRecipes(page, 10, search);//fetch API from backend
      setRecipes(response.data.data.recipes || []);
      setTotalPages(response.data.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, title) => {//deleteing the recipe
    setDeleteId(id);
    setDeleteName(title);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {//delete the recipe in backend
    try {
      await adminAPI.deleteRecipe(deleteId);
      setRecipes(recipes.filter((r) => r._id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
      toast.success("Recipe deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete. Please try again.");
    }
  };

  const handleSearchChange = (e) => {//reset page when search
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", height: { xs: "auto", md: "100vh" }, backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChefHeader user={user} onMenuClick={() => setMobileOpen(true)} />
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
                    <Search size={20} color="#666" />
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
                            onClick={() => handleDeleteClick(recipe._id, recipe.title)}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: "20px", p: 1, maxWidth: 420 },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ fontSize: 48, mb: 2 }}>
            <FontAwesomeIcon icon={faTrashCan} shake style={{ color: "#555" }} />
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", mb: 1.5 }}>
            Delete Recipe?
          </Typography>
          <Typography sx={{ color: "#666", fontSize: 15, lineHeight: 1.6, mb: 3 }}>
            Are you sure you want to delete "<span style={{ fontWeight: 700, color: "#1a1a1a" }}>{deleteName}</span>"?
            This action cannot be undone and will also remove the uploaded image.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                px: 3,
                py: 1,
                fontSize: 15,
                fontWeight: 600,
                color: "#333",
                border: "1px solid #ddd",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                px: 3,
                py: 1,
                fontSize: 15,
                fontWeight: 600,
                backgroundColor: "#b91c1c",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#991b1b", boxShadow: "none" },
              }}
            >
              Delete Recipe
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
