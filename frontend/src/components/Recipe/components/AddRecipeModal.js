import React, { useState } from "react";

import { Close } from "../../../assets/images/Close";

const AddRecipeModal = ({ modalOpen, setModalOpen, handleAddRecipe }) => {
  const [recipeName, setRecipeName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!recipeName) {
      setError("Recipe name is required!");
      return;
    }
    handleAddRecipe(recipeName);
    setModalOpen(false);
    setRecipeName("");
  };

  return (
    modalOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold ">Add New Recipe</h2>
            <button className="flex" onClick={() => setModalOpen(false)}>
              <Close />
            </button>
          </div>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter recipe name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mt-4 text-right">
            <button
              className="bg-[#f16451] text-white py-2 px-4 rounded-md hover:bg-[#f16451] focus:outline-none"
              onClick={handleSubmit}
            >
              Add Recipe
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddRecipeModal;
