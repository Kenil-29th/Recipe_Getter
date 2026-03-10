import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      console.log("Dashboard Stats Response:", response);
      setStats(response.data.data);
      
      // Fetch recent recipes too
      const recipesRes = await adminAPI.getAllRecipes(1, 5);
      console.log("Recipes Response:", recipesRes);
      setRecentRecipes(recipesRes.data.data.recipes || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
        <Sidebar user={user} />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const statItems = [
    { title: "Total Recipes", value: stats?.totalRecipes || 0 },
    { title: "Total Chefs", value: stats?.totalChefs || 0 },
    { title: "Active Users", value: stats?.activeUsers || 0 },
    { title: "Avg Rating", value: (stats?.avgRating || 0).toFixed(2) },
  ];

  console.log("Stats Object:", stats);
  console.log("Stat Items to Display:", statItems);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChefHeader user={user} />

        <Container maxWidth="lg" sx={{ py: 4, flex: 1, overflowY: "auto" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* STATS */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {statItems.map((item, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: "#3a5f23" }}>
                    {item.value}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {item.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* RECENT RECIPES */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Recent Recipes
            </Typography>

            {recentRecipes.length === 0 ? (
              <Typography color="text.secondary">No recipes yet</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Chef</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRecipes.map((recipe) => (
                      <TableRow key={recipe._id} hover>
                        <TableCell>{recipe.title}</TableCell>
                        <TableCell>{recipe.chefName}</TableCell>
                        <TableCell>{recipe.category || "-"}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}