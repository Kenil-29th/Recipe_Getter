import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TimerIcon from '@mui/icons-material/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function RecipeCard({ recipe, variant = 'grid', minimal = false }) {
  const navigate = useNavigate();

  // Handle both old and new recipe data structures
  const recipeData = recipe || {};//fallback if recipe is not defined
  const title = recipeData.title || 'Untitled Recipe';
  const image = recipeData.image;
  const chefName = recipeData.chefName || 'Anonymous Chef';
  const category = recipeData.category;
  const prepTime = recipeData.prepTime;
  const cookTime = recipeData.cookTime;
  const servings = recipeData.servings;
  const matchScore = recipeData.matchScore;
  const isPublished = recipeData.isPublished;
  const icon = recipeData.icon;
  const gradient = recipeData.gradient;

  const handleClick = () => {
    if (recipeData.slug) {//ensure valid recipe
      navigate(`/recipe/${recipeData.slug}`);//navigate to recipe detail page
    }
  };

  // Minimal variant - table view
  if (minimal) {
    return (
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          gap: 2,
          p: 1.5,
          backgroundColor: '#fff',
          cursor: recipeData.slug ? 'pointer' : 'default',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: recipeData.slug ? '#f9f9f9' : 'transparent',
          },
        }}
      >
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {chefName}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Compact variant - with actions
  if (variant === 'compact') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 1,
          cursor: recipeData.slug ? 'pointer' : 'default',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: recipeData.slug ? '#f9f9f9' : 'transparent',
            boxShadow: recipeData.slug ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
          },
        }}
      >
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: 100,
              height: 80,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            By {chefName}
          </Typography>
          {category && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#3a5f23' }}>
              {category}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Grid variant - main display (new API data)
  if (recipeData.slug) {
    return (
      <Card
        onClick={handleClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#fff',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        {image ? (
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt={title}
            sx={{
              objectFit: 'cover',
              backgroundColor: '#f0f0f0',
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">No Image</Typography>
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8em',
            }}
          >
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            By <strong>{chefName}</strong>
          </Typography>

          {category && (
            <Chip
              label={category}
              size="small"
              sx={{
                backgroundColor: '#e8f5e9',
                color: '#3a5f23',
                fontWeight: 500,
                mb: 1,
              }}
            />
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
            {prepTime && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  backgroundColor: '#f5f5f5',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <TimerIcon sx={{ fontSize: '0.9rem' }} />
                <Typography variant="caption">{prepTime}m</Typography>
              </Box>
            )}

            {cookTime && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  backgroundColor: '#f5f5f5',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />
                <Typography variant="caption">{cookTime}m</Typography>
              </Box>
            )}

            {servings && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  backgroundColor: '#f5f5f5',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <RestaurantIcon sx={{ fontSize: '0.9rem' }} />
                <Typography variant="caption">{servings}</Typography>
              </Box>
            )}
          </Box>

          {matchScore && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`${matchScore} ingredients`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          )}
        </CardContent>

        {isPublished === false && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Chip
              label="Draft"
              size="small"
              sx={{
                backgroundColor: '#fff3e0',
                color: '#f57c00',
              }}
            />
          </Box>
        )}
      </Card>
    );
  }

  // Old variant support (with gradient and icon)
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        sx={{
          height: 120,
          background: gradient || '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 40,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography fontWeight={600}>{title}</Typography>
        <Typography fontSize={13} color="text.secondary">
          ⏱ {prepTime || 'N/A'} • 👥 {servings || 'N/A'} servings
        </Typography>
      </Box>
    </Card>
  );
}
