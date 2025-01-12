import React from "react";
import { useQuery, gql } from "@apollo/client";
import { cn } from "../../lib/utils";
import RecipeCard from "../ui/recipe-card";

interface Recipe {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  cookingTime: number;
  servingSize: number;
  calories: number;
  cuisine: string;
  rating: number;
  occasions: string[];
  seasons: string[];
  cost: number;
  popularityScore: number;
  seasonalAvailability: string[];
  ingredients: string[];
  allergens: string[];
  preparationSteps: string[];
  favourite: boolean;
}

interface SimilarRecipeGridProps {
  recipeId: string;
  limit?: number;
  className?: string;
}

const GET_SIMILAR_RECIPES = gql`
  query ($recipeId: String!, $limit: Int!) {
    findSimilarRecipes(recipeId: $recipeId, limit: $limit) {
      id
      name
      difficulty
      cookingTime
      servingSize
      calories
      cost
      popularityScore
      seasonalAvailability
      ingredients
      cuisine
      allergens
      occasions
      seasons
      preparationSteps
      rating
      favourite
    }
  }
`;

const SimilarRecipeGrid: React.FC<SimilarRecipeGridProps> = ({
  recipeId,
  limit = 6,
  className,
}) => {
  const { loading, error, data } = useQuery<{ findSimilarRecipes: Recipe[] }>(
    GET_SIMILAR_RECIPES,
    {
      variables: { recipeId, limit },
    }
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading similar recipes: {error.message}
      </div>
    );

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6",
        className
      )}
    >
      {data?.findSimilarRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
};

export default SimilarRecipeGrid;
