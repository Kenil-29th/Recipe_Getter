import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import { recipeAPI } from '../../services/api';

const RecipeSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Categories from backend
  const categories = ['Quick & Easy', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Salads', 'Appetizers'];

  useEffect(() => {
    fetchRecipes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, category, sortBy, page]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');

      // Use ingredient suggestion as base search
      let receivedRecipes = [];
      
      if (searchQuery.trim()) {
        // Search by ingredients
        const ingredients = searchQuery.trim().split(' ').filter(i => i.length > 0);
        const response = await recipeAPI.suggestRecipes(ingredients.slice(0, 4));
        receivedRecipes = response.data.data.recipes || [];
      } else {
        // Get all recipes with common ingredients as default
        const response = await recipeAPI.suggestRecipes(['salt', 'water', 'oil', 'flour']);
        receivedRecipes = response.data.data.recipes || [];
      }

      // Filter by category
      if (category) {
        receivedRecipes = receivedRecipes.filter(r => r.category === category);
      }

      // Sort
      switch (sortBy) {
        case 'newest':
          receivedRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          receivedRecipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'quickest':
          receivedRecipes.sort((a, b) => {
            const timeA = (a.prepTime || 0) + (a.cookTime || 0);
            const timeB = (b.prepTime || 0) + (b.cookTime || 0);
            return timeA - timeB;
          });
          break;
        case 'slowest':
          receivedRecipes.sort((a, b) => {
            const timeA = (a.prepTime || 0) + (a.cookTime || 0);
            const timeB = (b.prepTime || 0) + (b.cookTime || 0);
            return timeB - timeA;
          });
          break;
        case 'title-az':
          receivedRecipes.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }

      // Pagination
      const itemsPerPage = 12;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedRecipes = receivedRecipes.slice(startIndex, startIndex + itemsPerPage);
      
      setRecipes(paginatedRecipes);
      setTotalPages(Math.ceil(receivedRecipes.length / itemsPerPage));
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
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
      onClick={() => navigate(`/recipe/${recipe.slug}`)}
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
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#3a5f23', fontWeight: 'bold' }}>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* SEARCH HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#3a5f23' }}>
            Search Recipes
          </Typography>

          {/* SEARCH BAR */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* FILTERS */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }} label="Category">
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }} label="Sort By">
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="quickest">Quickest to Cook</MenuItem>
                <MenuItem value="slowest">Longest to Cook</MenuItem>
                <MenuItem value="title-az">Title (A-Z)</MenuItem>
              </Select>
            </FormControl>

            {(searchQuery || category) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setCategory('');
                  setSortBy('newest');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* RESULTS */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : recipes.length === 0 ? (
          <Alert severity="info">
            {searchQuery || category ? 'No recipes found. Try different search terms or filters.' : 'No recipes available.'}
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </Typography>

            {/* RECIPE GRID */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))}
            </Grid>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => {
                    setPage(value);
                    window.scrollTo(0, 0);
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default RecipeSearch;
