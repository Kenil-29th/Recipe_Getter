const Recipe = require('../models/Recipe');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Get all recipes (with pagination & filters)
 * @route   GET /api/admin/recipes
 * @access  Admin
 */
const getAllRecipes = async (req, res, next) => {
  try {//pagination setup makes only 20 recipe to load on a page this makes the loading over 1000 less so its improve performance 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    const filter = {};
    if (search) {// this is the search where we type 1-2-3 alphabet we get suggestion based on it
      filter.$or = [//matches any condition type or chefName
        { title: { $regex: search, $options: 'i' } },
        { chefName: { $regex: search, $options: 'i' } },
      ];
    }
    if (req.query.chefId) filter.chefId = req.query.chefId;

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)//fetch recipe matching filter
        .populate('chefId', 'name email')//replace chef id with the actual chef data like name and email
        .sort({ createdAt: -1 })//sort by descending order latest first
        .skip(skip)
        .limit(limit),//limit number of result
      Recipe.countDocuments(filter),//count total matching recipes
    ]);

    res.status(200).json({//give the response in json format data is mentioned
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

/**
 * @desc    Delete any recipe
 * @route   DELETE /api/admin/recipes/:id
 * @access  Admin
 */
const deleteRecipe = async (req, res, next) => {//delete recipe from DB also the image from the server
  try {
    const recipe = await Recipe.findById(req.params.id);//find the recipe by id through URL

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    // Remove image file
    if (recipe.image && recipe.image.includes('/uploads/')) {//ensure only delete image store on the server
      const filename = recipe.image.split('/uploads/')[1];
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      fs.unlink(filePath, () => {});//delete file from the disk
    }

    await recipe.deleteOne();//delete the DB entry

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all chefs
 * @route   GET /api/admin/chefs
 * @access  Admin
 */
const getChefs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { role: 'chef' };
    if (req.query.search) {
      filter.$or = [//matches any condition name or email
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [chefs, total] = await Promise.all([
      User.find(filter)//find user matching filter
        .select('-password')//excludes password
        .sort({ createdAt: -1 })//sort newest first
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),//count total chef
    ]);

    // Attach recipe counts per chef
    const chefIds = chefs.map((c) => c._id);//extract all chef id into arrays
    const recipeCounts = await Recipe.aggregate([//group into one
      { $match: { chefId: { $in: chefIds } } },
      { $group: { _id: '$chefId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    recipeCounts.forEach((r) => { countMap[r._id.toString()] = r.count; });

    const chefsWithCounts = chefs.map((chef) => ({
      ...chef.toJSON(),
      recipeCount: countMap[chef._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        chefs: chefsWithCounts,
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

/**
 * @desc    Delete a chef and their recipes
 * @route   DELETE /api/admin/chefs/:id
 * @access  Admin
 */
const deleteChef = async (req, res, next) => {//delete the chef and rlated to chef data
  try {
    const chef = await User.findById(req.params.id);//find chef by ID 

    if (!chef) {
      return res.status(404).json({ success: false, message: 'Chef not found.' });
    }

    if (chef.role !== 'chef') {//check for the role of the user
      return res.status(400).json({ success: false, message: 'User is not a chef.' });
    }

    // Get all recipes by this chef
    const chefRecipes = await Recipe.find({ chefId: chef._id });

    // Delete recipe images
    chefRecipes.forEach((recipe) => {
      if (recipe.image && recipe.image.includes('/uploads/')) {
        const filename = recipe.image.split('/uploads/')[1];
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        fs.unlink(filePath, () => {});
      }
    });

    // Delete all recipes by this chef
    await Recipe.deleteMany({ chefId: chef._id });

    // Delete the chef user
    await chef.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Chef and their recipes deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle chef active/inactive status
 * @route   PATCH /api/admin/chefs/:id/toggle-status
 * @access  Admin
 */
const toggleChefStatus = async (req, res, next) => {//controller to activate and deactivate chef status
  try {
    const chef = await User.findById(req.params.id);//find chef through ID

    if (!chef) {
      return res.status(404).json({ success: false, message: 'Chef not found.' });
    }

    if (chef.role !== 'chef') {//check for the role of the user
      return res.status(400).json({ success: false, message: 'User is not a chef.' });
    }

    chef.isActive = !chef.isActive;//token boolean valye
    await chef.save();

    res.status(200).json({
      success: true,
      message: `Chef ${chef.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: { isActive: chef.isActive },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Admin
 */
const getDashboardStats = async (req, res, next) => {//controller for dashboard data
  try {
    const [
      totalRecipes,
      totalChefs,
      activeUsers,
      recentRecipes,
      topChefs,
      recipesByMonth,
    ] = await Promise.all([
      Recipe.countDocuments(),//count all recipes
      User.countDocuments({ role: 'chef' }),//count chef
      User.countDocuments({ isActive: true }),//count active user

      // Last 5 recipes
      Recipe.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('chefId', 'name email'),

      // Top 5 chefs by recipe count
      Recipe.aggregate([
        { $group: { _id: '$chefId', recipeCount: { $sum: 1 }, chefName: { $first: '$chefName' } } },
        { $sort: { recipeCount: -1 } },
        { $limit: 5 },
      ]),

      // Recipes per month (last 6 months)
      Recipe.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    // avgRating placeholder — replace with real aggregation if ratings are added
    const avgRating = 0;

    res.status(200).json({
      success: true,
      data: {
        totalRecipes,
        totalChefs,
        activeUsers,
        avgRating,
        recentRecipes,
        topChefs,
        recipesByMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllRecipes, deleteRecipe, getChefs, deleteChef, toggleChefStatus, getDashboardStats };