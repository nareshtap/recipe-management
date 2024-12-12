import React, { useState, useEffect } from "react";

import backgroundImg from "../../assets/images/background-image.jpg";
import { SearchImage } from "../../assets/images/SearchImg";
import { Close } from "../../assets/images/Close";
import { Alert } from "../../assets/images/Alert";

import RecipeList from "./components/RecipeList";
import AddRecipeModal from "./components/AddRecipeModal";
import ConsolidatedListModal from "./components/ConsolidatedListModal";

export const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [consolidatedList, setConsolidatedList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestionOpen, setSearchSuggestionOpen] = useState(false);
  const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  // Fetch the full list of recipes
  useEffect(() => {
    fetch("http://localhost:8000/api/recipe")
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

  // Fetch search suggestions when the search term changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
      fetch(`http://localhost:8000/api/recipe/search?dishName=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.slice(0, 5));
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchSuggestionOpen(true);
    setSearchTerm(e.target.value);
  };

  const handleSearchOptionSelect = (dishName) => {
    setSearchTerm(dishName);
    setSearchSuggestionOpen(false);
  };

  const handleCheckboxChange = (recipe) => {
    if (selectedRecipes.includes(recipe)) {
      setSelectedRecipes(selectedRecipes.filter((r) => r !== recipe));
    } else {
      if (selectedRecipes.length < 4) {
        setSelectedRecipes([...selectedRecipes, recipe]);
      } else {
        setShowToast(true);
      }
    }
  };

  const handleViewList = () => {
    const recipeIds = selectedRecipes.map((r) => r._id);
    fetch("http://localhost:8000/api/recipe/grocery-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeIds }),
    })
      .then((response) => response.json())
      .then((data) => {
        setConsolidatedList(data);
        setModalOpen(true);
      });
  };

  const handleAddRecipe = (recipeName) => {
    setLoading(true);
    fetch("http://localhost:8000/api/recipe/add-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dishName: recipeName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipes([...recipes, data]);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error adding recipe:", error);
      });
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div className="bg-[#e9f3e2] min-h-[100vh]">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full z-50 bg-[#0000006e] flex items-center justify-center">
          <span className="animate-spin w-10 h-10 rounded-full border-2 border-transparent border-t-white border-r-white "></span>
        </div>
      )}
      <div className="flex flex-col relative h-[500px]">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={backgroundImg}
          alt="background-image"
        />
        <div className="flex items-center flex-col gap-5 justify-center h-full bg-[#00000073] relative z-20">
          <h2 className="text-5xl text-white font-bold ">
            Discover the best recipe
          </h2>
          <div className="relative">
            <span className="absolute top-1/2 -translate-y-1/2 left-3">
              <SearchImage />
            </span>
            <input
              type="text"
              className="rounded-3xl py-3 px-5 pl-11 border border-gray-300 text-[#858585] w-[400px] outline-none"
              placeholder="Search Recipes..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && searchResults.length > 0 && searchSuggestionOpen && (
              <ul className="absolute top-16 bg-white w-full rounded-lg overflow-hidden">
                {searchResults.map((recipe) => (
                  <li
                    key={recipe._id}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => {
                      handleSearchOptionSelect(recipe.dishName);
                    }}
                  >
                    {recipe.dishName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between py-5">
          <h3 className="text-2xl font-semibold capitalize">
            recipe list (Serves 8)
          </h3>
          <div className="flex items-center justify-between gap-1 py-5">
            <button
              className={`py-2 px-5 rounded-xl bg-[#f16451] shadow-md text-white text-base font-medium hover:bg-transparent border border-transparent hover:border-[#f16451] hover:text-[#f16451] transition-all duration-300 ${
                selectedRecipes?.length > 0 ? "block" : "hidden"
              }`}
              onClick={handleViewList}
            >
              View Consolidated List
            </button>
            <button
              className="py-2 px-5 rounded-xl bg-[#f16451] shadow-md text-white text-base font-medium hover:bg-transparent border border-transparent hover:border-[#f16451] hover:text-[#f16451] transition-all duration-300"
              onClick={() => setAddRecipeModalOpen(true)}
            >
              Add New Recipe
            </button>
          </div>
        </div>
        {currentRecipes?.length > 0 ? (
          <RecipeList
            recipes={currentRecipes}
            selectedRecipes={selectedRecipes}
            handleCheckboxChange={handleCheckboxChange}
          />
        ) : (
          <div className="text-xl font-semibold capitalize text-[#f16451] text-center">
            No recipe found
          </div>
        )}
        {showToast && (
          // <div className="absolute top-16 right-0 bg-yellow-100 flex items-center z-[9]">
          //   <span></span>
          //   <h6>You can select maximum 4 recipe at a time</h6>
          // </div>

          <div
            id="toast-default"
            class="absolute top-16 right-2 bg-white flex items-start w-full max-w-xs p-4 text-gray-500 rounded-xl shadow z-[999]"
            role="alert"
          >
            <div class="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-yellow-200 rounded-lg">
              <Alert />
            </div>
            <div class="ms-3 text-sm font-normal">
              You can select maximum 4 recipe at a time
            </div>
            <button
              type="button"
              class=" text-gray-400 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 outline-none"
              data-dismiss-target="#toast-default"
              aria-label="Close"
              onClick={() => {
                setShowToast(false);
              }}
            >
              <Close />
            </button>
          </div>
        )}
        {currentRecipes?.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              className="px-4 py-2 bg-white text-black rounded-md mr-2"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 ${
                  currentPage === index + 1
                    ? "bg-[#f16451] text-white"
                    : "bg-white text-black"
                } rounded-md mx-1`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 bg-white text-black rounded-md ml-2"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
        {addRecipeModalOpen && (
          <AddRecipeModal
            modalOpen={addRecipeModalOpen}
            setModalOpen={setAddRecipeModalOpen}
            handleAddRecipe={handleAddRecipe}
          />
        )}
        {modalOpen && (
          <ConsolidatedListModal
            consolidatedList={consolidatedList}
            setModalOpen={setModalOpen}
          />
        )}
      </div>
    </div>
  );
};
