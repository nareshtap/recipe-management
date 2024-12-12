import React, { useState } from "react";

import IngredientListModal from "./IngredientListModal";

function RecipeCard({ recipe, isSelected, handleCheckboxChange }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="border rounded-2xl shadow-md bg-white flex flex-col">
      <div className="flex items-center justify-start gap-3 p-4">
        <input
          type="checkbox"
          className="h-5 w-5 border-gray-600 cursor-pointer accent-[#f16451]"
          checked={isSelected}
          onChange={() => handleCheckboxChange(recipe)}
        />
        <h2 className="text-lg font-semibold">{recipe.dishName}</h2>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap gap-3 p-3">
          {recipe.ingredients.map(
            (ingredient, index) =>
              index <= 5 && (
                <div className="flex flex-col bg-gray-200 py-1 px-3 rounded-full">
                  <span
                    key={index}
                    className="text-gray-600 text-sm flex items-center gap-2"
                  >
                    <b> {ingredient.name}</b>
                    {ingredient.quantity && (
                      <span>{`(${ingredient.quantity}${ingredient.unit})`}</span>
                    )}
                  </span>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex items-center justify-center p-5">
        <button
          onClick={() => {
            setModalOpen(true);
          }}
          className="py-2 px-5 rounded-xl bg-[#f16451] shadow-md w-full text-white text-base font-medium hover:bg-transparent border-2 border-transparent hover:border-[#f16451] hover:text-[#f16451] transition-all duration-300"
        >
          View All List
        </button>
      </div>

      {modalOpen && (
        <IngredientListModal
          recipeName={recipe.dishName}
          list={recipe.ingredients}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
}

export default RecipeCard;
