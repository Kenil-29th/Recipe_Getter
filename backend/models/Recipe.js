const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one ingredient is required',
      },
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    image: {
      type: String,
      default: null,
    },
    chefName: {
      type: String,
      required: true,
    },
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    prepTime: {
      type: Number, // in minutes
    },
    cookTime: {
      type: Number, // in minutes
    },
    servings: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster ingredient matching queries
recipeSchema.index({ ingredients: 1 });
recipeSchema.index({ chefId: 1 });
recipeSchema.index({ title: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);