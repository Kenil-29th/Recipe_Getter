import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import WordCloud3D from '../../components/WordCloud3D';
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
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(58, 95, 35, 0.4)',
          backgroundColor: 'rgba(255, 255, 255, 1)',
        },
      }}
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {recipe.image && (
        <CardMedia
          component="img"
          height="220"
          image={recipe.image}
          alt={recipe.title}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.2em'
          }}
        >
          {recipe.title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            mb: 1.5,
            fontStyle: 'italic'
          }}
        >
          {recipe.chefName}
        </Typography>
        {recipe.category && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'inline-block',
              backgroundColor: '#3a5f23',
              color: '#fff',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 500,
              mb: 1.5
            }}
          >
            {recipe.category}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
          {recipe.prepTime && (
            <Typography 
              variant="caption" 
              sx={{ 
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {recipe.prepTime}m
            </Typography>
          )}
          {recipe.cookTime && (
            <Typography 
              variant="caption" 
              sx={{ 
                backgroundColor: '#fff3e0',
                color: '#e65100',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {recipe.cookTime}m
            </Typography>
          )}
          {recipe.servings && (
            <Typography 
              variant="caption" 
              sx={{ 
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {recipe.servings}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Word Cloud Background */}
      <WordCloud3D />
      
      {/* Gradient overlay for better readability */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, rgba(10, 10, 21, 0.85) 0%, rgba(58, 95, 35, 0.75) 50%, rgba(10, 10, 21, 0.85) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      
      {/* Content with higher z-index */}
      <Box sx={{ position: 'relative', zIndex: 3 }}>
        <Header />
        
        <SearchBar />

        <Container maxWidth="lg" sx={{ py: 5, flex: 1 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.9)',
                color: '#fff',
                '& .MuiAlert-icon': { color: '#fff' }
              }}
            >
              {error}
            </Alert>
          )}

          {/* FEATURED RECIPES SECTION */}
          {/* {suggestedRecipes.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  mb: 4, 
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                  letterSpacing: '0.5px'
                }}
              >
                Discover Amazing Recipes
              </Typography>
              <Grid container spacing={3}>
                {suggestedRecipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )} */}

          {/* Empty state */}
          {suggestedRecipes.length === 0 && !error && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#ffffff', 
                  mb: 2,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                }}
              >
                Welcome to Virtual Chef! 
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                }}
              >
                Start by adding ingredients above to discover delicious recipes
              </Typography>
            </Box>
          )}
        </Container>

        <Footer />
      </Box>
    </Box>
  );
};

export default UserDashboard;