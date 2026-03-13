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
import { Trash2, Search, AlertCircle, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

export default function AdminChefs() {
  const { user } = useAuth();
  
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getChefs(page, 10, search);
        setChefs(response.data.data.chefs || []);
        setTotalPages(response.data.data.pagination.pages || 1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch chefs");
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, [page, search]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminAPI.deleteChef(deleteId);
      setChefs(chefs.filter((c) => c._id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete chef");
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
              Chefs
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
              placeholder="Search chefs by name or email..."
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
          ) : chefs.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No chefs found.
              </Typography>
            </Paper>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableRow>
                      <TableCell fontWeight="bold">Name</TableCell>
                      <TableCell fontWeight="bold">Email</TableCell>
                      <TableCell fontWeight="bold">Bio</TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Recipes
                      </TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Join Date
                      </TableCell>
                      <TableCell align="center" fontWeight="bold">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chefs.map((chef) => (
                      <TableRow key={chef._id} hover>
                        <TableCell fontWeight="500">{chef.name}</TableCell>
                        <TableCell>{chef.email}</TableCell>
                        <TableCell>{chef.bio || "-"}</TableCell>
                        <TableCell align="center">{chef.recipeCount || 0}</TableCell>
                        <TableCell align="center">
                          {new Date(chef.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(chef._id)}
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AlertCircle size={24} color="#dc2626" />
            <Typography fontWeight="bold">
              Delete Chef?
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
