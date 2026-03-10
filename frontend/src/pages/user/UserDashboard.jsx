import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import ThreeDBackground from '../../components/ThreeDBackground';
import { recipeAPI } from '../../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch initial recipes with common ingredients
    fetchInitialRecipes();
  }, []);

  const fetchInitialRecipes = async () => {
    try {
      // setLoading(true);
      // Suggest recipes with common ingredients to show diverse recipes
      const commonIngredients = ['chicken', 'rice', 'tomato', 'pasta'];
      const response = await recipeAPI.suggestRecipes(commonIngredients);
      setSuggestedRecipes(response.data.data.recipes || []);
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      // setLoading(false);
    }
  };

  const RecipeCard = ({ recipe }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
        },
      }}
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {recipe.image && (
        <CardMedia
          component="img"
          height="200"
          image={recipe.image}
          alt={recipe.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          By {recipe.chefName}
        </Typography>
        {recipe.category && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#3a5f23' }}>
            {recipe.category}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {recipe.prepTime && (
            <Typography variant="caption" sx={{ backgroundColor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1 }}>
              Prep: {recipe.prepTime}m
            </Typography>
          )}
          {recipe.cookTime && (
            <Typography variant="caption" sx={{ backgroundColor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1 }}>
              Cook: {recipe.cookTime}m
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: '#ffffff' }}>
      {/* 3D Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '75vh', zIndex: 0, opacity: 0.75 }}>
        <ThreeDBackground />
      </Box>

      {/* Content Overlay */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />
      
      <SearchBar />

      <Container maxWidth="lg" sx={{ py: 5, flex: 1, backgroundColor: "transparent" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* FEATURED RECIPES SECTION */}
        {/* <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#3a5f23' }}>
            🔥 Popular Recipes
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : suggestedRecipes.length === 0 ? (
            <Alert severity="info">No recipes available yet. Try searching by ingredients!</Alert>
          ) : (
            <Grid container spacing={3}>
              {suggestedRecipes.slice(0, 6).map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box> */}

        {/* ALL RECIPES SECTION */}
        {suggestedRecipes.length > 6 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#3a5f23' }}>
              📖 More Recipes
            </Typography>
            <Grid container spacing={3}>
              {suggestedRecipes.slice(6).map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <Footer />
      </Box>
    </Box>
  );
};

export default UserDashboard;