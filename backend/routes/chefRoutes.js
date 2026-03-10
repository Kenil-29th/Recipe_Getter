const express = require('express');
const router = express.Router();
const { addRecipe, editRecipe, deleteRecipe, getMyRecipes } = require('../controllers/chefController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// All chef routes require authentication and chef role
router.use(protect, authorize('chef', 'admin'));

router.get('/my-recipes', getMyRecipes);
router.post('/recipes', upload.single('image'), addRecipe);
router.put('/recipes/:id', upload.single('image'), editRecipe);
router.delete('/recipes/:id', deleteRecipe);

module.exports = router;