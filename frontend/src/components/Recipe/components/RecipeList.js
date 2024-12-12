import React from "react";

import RecipeCard from "./RecipeCard";


function RecipeList({ recipes, selectedRecipes, handleCheckboxChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          isSelected={selectedRecipes.includes(recipe)}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
}

export default RecipeList;
