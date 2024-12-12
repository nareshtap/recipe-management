# Recipe Portal with Dynamic Grocery Checklist and Recipe Management

## Overview

This application allows users to search, manage, and add new recipes. It features a dynamic grocery checklist where users can select up to four recipes and view a consolidated list of ingredients. The app also supports user authentication through Google Login and provides the ability to manage recipes and ingredients.

---

## Features

- **Authentication**: Users can log in using Google for secure access to the app.
  
- **Recipe Search**:
  - Search for recipes by name.
  - Display up to 5 suggestions based on partial matching.
  - View detailed recipe card with grocery list information upon selecting a recipe.
  - Select up to 4 recipes to generate a consolidated grocery list with ingredients from multiple dishes.

- **Adding New Recipes**:
  - Add recipes not found in the database.
  - Dynamically generate the ingredient list for new recipes using the Gemini API (LLM).
  - New recipes are stored in the database, and each recipe serves 8 servings.

- **Data Management**:
  - If the database is empty, data is loaded from a CSV file.
  - Users can add new recipes which will be stored in the database.

---

## Technology Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Google Login
- **LLM API**: Gemini (for dynamic ingredient list generation)
  
---

## Backend Setup

### Prerequisites

Ensure you have the following installed:
- Node.js (v18.x or higher)
- MongoDB (either locally or use a cloud database service)

# Installation

## 1. Backend

#### Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

#### Start the Backend

```bash
node server.js
```

## 2. Frontend

#### Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

#### Start the Frontend

```bash
npm start
```

## 3. .env

#### set up ENV as per requirements, sample is given below

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AI_API_KEY=
MONGO_URI=mongodb://localhost:27017/recipe-portal
PORT=8000
```