const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  deleteRecipe,
  getChefs,
  deleteChef,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/recipes', getAllRecipes);
router.delete('/recipes/:id', deleteRecipe);
router.get('/chefs', getChefs);
router.delete('/chefs/:id', deleteChef);

module.exports = router;