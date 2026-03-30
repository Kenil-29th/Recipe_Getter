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
import { BookOpen, Users, Activity, Star, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ChefHeader from "../../components/ChefHeader";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();//get logged in user
  const [stats, setStats] = useState(null);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {//runs only once when the page reload
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {//fetxxh the dashboard data
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();//fetch data from backend
      console.log("Dashboard Stats Response:", response);
      setStats(response.data.data);//save stats
      
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
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Sidebar user={user} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minWidth: 0 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const statItems = [
    { title: "Total Recipes", value: stats?.totalRecipes || 0, icon: BookOpen, color: "#3a5f23" },
    { title: "Total Chefs", value: stats?.totalChefs || 0, icon: Users, color: "#2563eb" },
    { title: "Active Users", value: stats?.activeUsers || 0, icon: Activity, color: "#dc2626" },
    { title: "Avg Rating", value: (stats?.avgRating || 0).toFixed(2), icon: Star, color: "#f59e0b" },
  ];

  console.log("Stats Object:", stats);
  console.log("Stat Items to Display:", statItems);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", height: { xs: "auto", md: "100vh" }, backgroundColor: "#f5f5f5" }}>
      <Sidebar user={user} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChefHeader user={user} onMenuClick={() => setMobileOpen(true)} />
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
            {statItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Grid item xs={12} md={3} key={index}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      textAlign: "center",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          backgroundColor: `${item.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <IconComponent size={28} color={item.color} />
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: item.color }}>
                      {item.value}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, fontSize: 14 }}>
                      {item.title}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* RECENT RECIPES */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp size={20} color="#3a5f23" />
              <Typography variant="h6" fontWeight="bold">
                Recent Recipes
              </Typography>
            </Box>

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