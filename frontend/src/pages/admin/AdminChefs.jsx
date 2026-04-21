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
import { Trash2, Search, AlertCircle, X, ToggleLeft, ToggleRight } from "lucide-react";//icon used in Ui
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

export default function AdminChefs() {
  const { user } = useAuth();//gets the current logged-in user
  
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {//runs when page or search chnages
    const fetchChefs = async () => {//function to get the chef from backend
      try {
        setLoading(true);//show loading spinner
        const response = await adminAPI.getChefs(page, 10, search);//API calling
        setChefs(response.data.data.chefs || []);//save chef list
        setTotalPages(response.data.data.pagination.pages || 1);//save total pages
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch chefs");
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, [page, search]);

  const handleToggleStatus = async (id, currentStatus) => {//toggle chef status
    try {
      await adminAPI.toggleChefStatus(id);//api call
      setChefs(chefs.map((c) =>//update ui instantly
        c._id === id ? { ...c, isActive: !currentStatus } : c
      ));
      toast.success(`Chef ${currentStatus ? "deactivated" : "activated"} successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update chef status.");
    }
  };

  const handleDeleteClick = (id, name) => {//open delete dialog
    setDeleteId(id);
    setDeleteName(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {//when user confirm delete
    try {
      await adminAPI.deleteChef(deleteId);//delete in backend
      setChefs(chefs.filter((c) => c._id !== deleteId));//remove from ui
      setDeleteDialogOpen(false);
      setDeleteId(null);
      toast.success("Chef deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete. Please try again.");
    }
  };

  const handleSearchChange = (e) => {//update the search
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {//handle pagination
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
                        Status
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
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStatus(chef._id, chef.isActive)}
                              sx={{
                                color: chef.isActive ? "#16a34a" : "#9ca3af",
                                "&:hover": { backgroundColor: chef.isActive ? "#dcfce7" : "#f3f4f6" }
                              }}
                              title={chef.isActive ? "Deactivate" : "Activate"}
                            >
                              {chef.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                            </IconButton>
                            <Typography sx={{ fontSize: 12, color: chef.isActive ? "#16a34a" : "#9ca3af" }}>
                              {chef.isActive ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(chef._id, chef.name)}
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
            Delete Chef?
          </Typography>
          <Typography sx={{ color: "#666", fontSize: 15, lineHeight: 1.6, mb: 3 }}>
            Are you sure you want to delete "<span style={{ fontWeight: 700, color: "#1a1a1a" }}>{deleteName}</span>"?
            This action cannot be undone and will also remove all their recipes and uploaded images.
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
              Delete Chef
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
