const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const csvParser = require("csv-parser");
const fs = require("fs");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipe");

const Recipe = require("./models/Recipe");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipe", recipeRoutes);

// Function to import CSV data

const importCSV = async (csvFilePath) => {
  try {
    const recipeCount = await Recipe.countDocuments();
    if (recipeCount > 0) {
      console.log("Recipes already imported");
      return "";
    }

    const recipesMap = {};

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data) => {
        const { dishName, ingredients, quantity, unit } = data;

        if (!recipesMap[dishName]) {
          recipesMap[dishName] = {
            dishName,
            ingredients: [],
          };
        }

        recipesMap[dishName].ingredients.push({
          name: ingredients,
          quantity: quantity && parseFloat(quantity),
          unit: unit || "",
        });
      })
      .on("end", async () => {
        try {
          const recipes = Object.values(recipesMap);
          await Recipe.insertMany(recipes);
          console.log("CSV Data Imported!");
        } catch (err) {
          console.error("Error importing CSV: ", err);
        }
      });
  } catch (err) {
    console.error("Error importing CSV: ", err);
  }
};

// Run the import function with the path to your CSV file
importCSV("./recipe_list.csv");

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
