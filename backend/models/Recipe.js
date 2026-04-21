const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
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

// Generate slug from title before saving
recipeSchema.pre('save', async function () {
  if (!this.isModified('title')) return;
  let baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  let slug = baseSlug;
  let count = 1;
  while (await mongoose.model('Recipe').findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }
  this.slug = slug;
});

// Also generate slug for findOneAndUpdate operations
recipeSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.title) {
    const docId = this.getQuery()._id;
    let baseSlug = update.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await mongoose.model('Recipe').findOne({ slug, _id: { $ne: docId } })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.setUpdate({ ...update, slug });
  }
});

// Index for faster ingredient matching queries
recipeSchema.index({ ingredients: 1 });
recipeSchema.index({ chefId: 1 });
recipeSchema.index({ title: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);