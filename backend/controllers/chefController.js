const Recipe = require('../models/Recipe');
const path = require('path');
const fs = require('fs');


const addRecipe = async (req, res, next) => {//controller for addrecipe
  try {
    const { title, ingredients, instructions, category, prepTime, cookTime, servings, isPublished } = req.body;
    //extract field from request body
    // Parse ingredients if sent as JSON string
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch {
        parsedIngredients = ingredients.split(',').map((i) => i.trim()).filter(Boolean);
      }
    }

    const imageUrl = req.file
      ? `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/uploads/${req.file.filename}`
      : null;

    const recipe = await Recipe.create({//create a recipe in DB
      title,
      ingredients: parsedIngredients,
      instructions,
      image: imageUrl,//save image URL
      chefName: req.user.name,
      chefId: req.user._id,
      category,
      prepTime,
      cookTime,
      servings,
      isPublished: isPublished !== 'false' && isPublished !== false,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully.',
      data: { recipe },
    });
  } catch (error) {
    // Remove uploaded file if recipe creation fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  }
};

const editRecipe = async (req, res, next) => {//controller of edit recipe
  try {
    const recipe = await Recipe.findById(req.params.id);//find recipe by ID

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    // Ownership check
    if (recipe.chefId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own recipes.',
      });
    }

    const { title, ingredients, instructions, category, prepTime, cookTime, servings, isPublished } = req.body;

    let parsedIngredients = ingredients;
    if (ingredients && typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch {
        parsedIngredients = ingredients.split(',').map((i) => i.trim()).filter(Boolean);
      }
    }

    // Handle new image upload
    let imageUrl = recipe.image;
    if (req.file) {
      // Delete old image file if it was locally stored
      if (recipe.image && recipe.image.includes('/uploads/')) {
        const oldFilename = recipe.image.split('/uploads/')[1];
        const oldPath = path.join(__dirname, '..', 'uploads', oldFilename);
        fs.unlink(oldPath, () => {}); // non-blocking
      }
      imageUrl = `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/uploads/${req.file.filename}`;
    }

    const updates = {//build update object
      ...(title && { title }),//include only if exist
      ...(parsedIngredients && { ingredients: parsedIngredients }),
      ...(instructions && { instructions }),
      ...(category !== undefined && { category }),
      ...(prepTime !== undefined && { prepTime }),
      ...(cookTime !== undefined && { cookTime }),
      ...(servings !== undefined && { servings }),
      ...(isPublished !== undefined && { isPublished: isPublished !== 'false' && isPublished !== false }),
      image: imageUrl,
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, updates, {
      new: true,//return updated doc
      runValidators: true,//Apply schema validation
    });

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully.',
      data: { recipe: updatedRecipe },
    });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
};


const deleteRecipe = async (req, res, next) => {//controller to delete the recipe
  try {
    const recipe = await Recipe.findById(req.params.id);//find the recipe from the body

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    if (recipe.chefId.toString() !== req.user._id.toString()) {//check for the ownership
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own recipes.',
      });
    }

    // Remove image file
    if (recipe.image && recipe.image.includes('/uploads/')) {
      const filename = recipe.image.split('/uploads/')[1];
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      fs.unlink(filePath, () => {});
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};


const getMyRecipes = async (req, res, next) => {//controller to get the recipe owned by the chef
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      Recipe.find({ chefId: req.user._id })//find the recipe from the URL
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments({ chefId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        recipes,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRecipe, editRecipe, deleteRecipe, getMyRecipes };