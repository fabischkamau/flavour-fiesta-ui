import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "./api/apollo-client.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/auth.tsx";
import { AuthLayout } from "./layout/AuthLayout.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/SignUp.tsx";
import Landing from "./pages/Landing.tsx";
import Home from "./pages/Home.tsx";
import SearchRecipes from "./pages/SearchRecipes.tsx";
import UserPreferences from "./pages/UserPreferences.tsx";
import MealPlannerPage from "./pages/MealPlanner.tsx";
import FavoriteRecipes from "./pages/FavouriteRecipes.tsx";
import MealPlannerById from "./pages/MealPlannerById.tsx";
import RecipePage from "./pages/RecipePage.tsx";
import Settings from "./pages/Settings.tsx";
import Profile from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/preferences",
    element: <UserPreferences />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchRecipes />,
      },
      
      {
        path: "/meal-planner",
        element: <MealPlannerPage />,
      },
      {
        path: "/meal-planner/:mealPlanId",
        element: <MealPlannerById />,
      },
      {
        path: "/favorites",
        element: <FavoriteRecipes />,
      },
      {
        path: "/recipe/:recipeId",
        element: <RecipePage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ApolloProvider>
  </StrictMode>
);
