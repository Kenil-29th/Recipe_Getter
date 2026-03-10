const Recipe = require('../models/Recipe');

/**
 * @desc    Suggest recipes based on available ingredients
 * @route   POST /api/recipes/suggest
 * @access  Public
 *
 * Matching rules:
 *  - Recipe must match MOST of the provided ingredients
 *  - Recipe can have at most 2 extra ingredients beyond what user has
 *  - Results sorted by number of matching ingredients (desc)
 */
const suggestRecipes = async (req, res, next) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of ingredients.',
      });
    }

    // Normalize user ingredients to lowercase & trimmed
    const userIngredients = ingredients.map((i) => i.toLowerCase().trim());

    // Fetch all published recipes
    const allRecipes = await Recipe.find({ isPublished: true });

    const scoredRecipes = allRecipes
      .map((recipe) => {
        const recipeIngredients = recipe.ingredients.map((i) => i.toLowerCase().trim());

        // Count how many user ingredients match this recipe
        const matchedCount = userIngredients.filter((ui) =>
          recipeIngredients.some(
            (ri) => ri.includes(ui) || ui.includes(ri)
          )
        ).length;

        // Count how many recipe ingredients are NOT in user's list (extra ingredients)
        const extraCount = recipeIngredients.filter(
          (ri) => !userIngredients.some((ui) => ri.includes(ui) || ui.includes(ri))
        ).length;

        return { recipe, matchedCount, extraCount };
      })
      .filter(({ matchedCount, extraCount, recipe }) => {
        const totalUserIngredients = userIngredients.length;
        const recipeIngredientCount = recipe.ingredients.length;

        // Recipe must match most of the user's ingredients (more than half)
        const matchesMost = matchedCount >= Math.ceil(totalUserIngredients * 0.5);

        // Recipe can have at most 2 extra ingredients beyond what user has
        const withinExtraLimit = extraCount <= 2;

        // At least 1 ingredient must match
        const hasAnyMatch = matchedCount > 0;

        // Avoid suggesting recipes where user barely covers any of the recipe's needs
        // (i.e., the match rate relative to the recipe's own ingredients is reasonable)
        const recipeCoverage = recipeIngredientCount > 0
          ? matchedCount / recipeIngredientCount
          : 0;
        const hasReasonableCoverage = recipeCoverage >= 0.5;

        return hasAnyMatch && matchesMost && withinExtraLimit && hasReasonableCoverage;
      })
      .sort((a, b) => {
        // Primary: most matched ingredients first
        if (b.matchedCount !== a.matchedCount) return b.matchedCount - a.matchedCount;
        // Secondary: fewest extra ingredients (least missing)
        return a.extraCount - b.extraCount;
      });

    const results = scoredRecipes.map(({ recipe, matchedCount, extraCount }) => ({
      ...recipe.toJSON(),
      matchedIngredients: matchedCount,
      extraIngredients: extraCount,
      matchScore: `${matchedCount}/${recipe.ingredients.length}`,
    }));

    res.status(200).json({
      success: true,
      count: results.length,
      data: { recipes: results },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      'chefId',
      'name email bio avatar'
    );

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    res.status(200).json({
      success: true,
      data: { recipe },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { suggestRecipes, getRecipeById };