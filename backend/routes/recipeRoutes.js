const express = require('express');
const router = express.Router();
const { suggestRecipes, getRecipeById } = require('../controllers/recipeController');

// Public routes — no authentication required
router.post('/suggest', suggestRecipes);
router.get('/:id', getRecipeById);

module.exports = router;