/**
 * One-time migration script to generate slugs for existing recipes.
 * Run with: node scripts/generate-slugs.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Recipe = require('../models/Recipe');

const generateSlugs = async () => {
  await connectDB();

  const recipes = await Recipe.find({ $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }] });
  console.log(`Found ${recipes.length} recipes without slugs.`);

  for (const recipe of recipes) {
    let baseSlug = recipe.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await Recipe.findOne({ slug, _id: { $ne: recipe._id } })) {
      slug = `${baseSlug}-${count++}`;
    }
    recipe.slug = slug;
    await recipe.save({ validateBeforeSave: false });
    console.log(`  ${recipe.title} → ${slug}`);
  }

  console.log('Done.');
  process.exit(0);
};

generateSlugs().catch((err) => {
  console.error(err);
  process.exit(1);
});
