import React from "react";

import { Close } from "../../../assets/images/Close";

function IngredientListModal({ recipeName, list, setModalOpen }) {
  return (
    <div className="fixed top-0 inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold ">
            Ingredients List of {recipeName}
          </h2>
          <button className="flex" onClick={() => setModalOpen(false)}>
            <Close />
          </button>
        </div>
        <ul className="flex flex-wrap gap-3 p-3 max-h-[calc(100vh-600px)] overflow-auto">
          {list?.map((ingredient, index) => (
            <li key={index} className="flex bg-gray-200 py-1 px-3 rounded-full">
              <span className="text-gray-600 text-sm flex items-center gap-2">
                <b>{ingredient.name} </b>
                {ingredient.quantity} {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IngredientListModal;
