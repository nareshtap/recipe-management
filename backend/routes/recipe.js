const express = require("express");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Recipe = require("../models/Recipe");

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to get recipes" });
  }
});

// Search for recipes by dish name
router.get("/search", async (req, res) => {
  const query = req.query.dishName || "";
  try {
    const recipes = await Recipe.find({
      dishName: { $regex: query, $options: "i" },
    }).limit(5);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

// Route to get detailed recipe info by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipe" });
  }
});

// Route to get the consolidated grocery list for selected recipes

router.post("/grocery-list", async (req, res) => {
  const selectedDishes = req.body.recipeIds;
  const recipes = await Recipe.find({ _id: { $in: selectedDishes } });
  const groceryList = consolidateIngredients(recipes);
  res.json(groceryList);
});

// Function to consolidate ingredients
function consolidateIngredients(recipes) {
  const consolidated = {};
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const { name, quantity, unit } = ingredient;

      if (consolidated[name]) {
        consolidated[name].quantity += quantity;
      } else {
        consolidated[name] = { quantity, unit };
      }
    });
  });

  return Object.keys(consolidated).map((name) => ({
    name,
    quantity: consolidated[name].quantity,
    unit: consolidated[name].unit,
  }));
}

// Function to call the Gemini API and fetch ingredients
const getIngredientsFromAI = async (recipeName) => {
  const aiApiKey = process.env.AI_API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(aiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide a list of ingredients for a recipe called "${recipeName}". don't send any other information (Not even title). send direct recipe in form of ingredients name, quantity and unit (if it comes in that form), ex. tomato 3, oil 2 tbsp`;

    const result = await model.generateContent(prompt);
    const ingredientsText = result.response.text();

    const ingredients = parseIngredients(ingredientsText);
    return ingredients;
  } catch (error) {
    console.error("Error fetching ingredients from AI:", error);
    throw new Error("Unable to fetch ingredients from AI");
  }
};

// Function to parse the ingredient text into a structured array
const parseIngredients = (ingredientsText) => {
  const ingredientLines = ingredientsText.split("\n");

  const ingredients = ingredientLines
    .map((line) => {
      const ingredientRegex = /(\D+)(\d+\.?\d*)(\s*\w+)?/;
      const match = line.trim().match(ingredientRegex);

      if (match) {
        const [, name, quantity, unit] = match;
        return {
          name: name.trim(),
          quantity: parseFloat(quantity),
          unit: unit ? unit.trim() : null,
        };
      }
      return null;
    })
    .filter((ingredient) => ingredient !== null);

  return ingredients;
};

// Adjust quantities for 8 servings
const adjustQuantitiesForServings = (ingredients, servings = 8) => {
  return ingredients.map((ingredient) => {
    if (ingredient.quantity !== 0) {
      ingredient.quantity *= servings;
    }
    return ingredient;
  });
};

// API endpoint to add a new recipe
router.post("/add-recipe", async (req, res) => {
  const { dishName } = req.body;

  if (!dishName) {
    return res.status(400).json({ error: "Recipe name is required" });
  }

  try {
    const ingredients = await getIngredientsFromAI(dishName);
    const adjustedIngredients = adjustQuantitiesForServings(ingredients);

    const newRecipe = new Recipe({
      dishName,
      ingredients: adjustedIngredients,
    });

    await newRecipe.save();

    res.status(201).send(newRecipe);
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw new Error("Failed to save recipe");
  }
});

module.exports = router;
