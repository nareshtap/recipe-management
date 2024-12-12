const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
});

const recipeSchema = new mongoose.Schema({
  dishName: { type: String, required: true, unique: true },
  ingredients: [ingredientSchema], // An array of ingredients
});

module.exports = mongoose.model("Recipe", recipeSchema);
