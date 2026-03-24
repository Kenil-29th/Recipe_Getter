const express = require('express');
const router = express.Router();//seperate routes manager for a specific feature/module
const {
  getAllRecipes,
  deleteRecipe,
  getChefs,
  deleteChef,
  toggleChefStatus,
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
router.patch('/chefs/:id/toggle-status', toggleChefStatus);

module.exports = router;