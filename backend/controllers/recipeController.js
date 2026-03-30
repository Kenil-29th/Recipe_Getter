const Recipe = require('../models/Recipe');


const suggestRecipes = async (req, res, next) => {//controller to suggest recipe based on the ingredients
  try {
    const { ingredients } = req.body;//extract the ingredients array from the body

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {//validation
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of ingredients.',
      });
    }

    // Normalize user ingredients to lowercase & trimmed
    const userIngredients = ingredients.map((i) => i.toLowerCase().trim());//convert all ingredient to lowercase also trim the with spaces

    // Fetch all published recipes (capped to prevent memory issues at scale)
    const allRecipes = await Recipe.find({ isPublished: true }).limit(500);

    const scoredRecipes = allRecipes//start processing the recipe
      .map((recipe) => {//loop through each recipe
        const recipeIngredients = recipe.ingredients.map((i) => i.toLowerCase().trim());

        // Count how many user ingredients match this recipe
        const matchedCount = userIngredients.filter((ui) =>//filter user ingredient with that match recipe
          recipeIngredients.some(//check recipe include user ingredient or user includes recipe ingredients
            (ri) => ri.includes(ui) || ui.includes(ri)
          )
        ).length;//count matched ingredient

        // Count how many recipe ingredients are NOT in user's list (extra ingredients)
        const extraCount = recipeIngredients.filter(
          (ri) => !userIngredients.some((ui) => ri.includes(ui) || ui.includes(ri))
        ).length;

        return { recipe, matchedCount, extraCount };
      })
      .filter(({ matchedCount, extraCount, recipe }) => {
        const recipeIngredientCount = recipe.ingredients.length;

        // At least 1 ingredient must match
        const hasAnyMatch = matchedCount > 0;

        // Recipe can have at most 5 extra ingredients the user doesn't have
        const withinExtraLimit = extraCount <= 5;

        // At least 70% of the recipe's ingredients must be covered by the user
        const recipeCoverage = recipeIngredientCount > 0
          ? matchedCount / recipeIngredientCount
          : 0;
        const hasReasonableCoverage = recipeCoverage >= 0.7;

        return hasAnyMatch && withinExtraLimit && hasReasonableCoverage;
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


const getRecipeById = async (req, res, next) => {//controller to fetch single recipe
  try {
    const recipe = await Recipe.findById(req.params.id).populate(//find recipe by ID and populate chef details
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