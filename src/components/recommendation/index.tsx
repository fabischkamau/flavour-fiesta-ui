"use client";

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
  cost: number;
  popularityScore: number;
  seasonalAvailability: string[];
  ingredients: string[];
  cuisine: string;
  allergens: string[];
  occasions: string[];
  seasons: string[];
  preparationSteps: string[];
  rating: number;
  favourite: boolean;
}

interface Recommendation {
  recipe: Recipe;
  score: number;
}

interface PersonalizedRecipeGridProps {
  userId: string;
  limit?: number;
  className?: string;
}

const GET_PERSONALIZED_RECOMMENDATIONS = gql`
  query ($userId: String!, $limit: Int!) {
    personalizedRecommendations(userId: $userId, limit: $limit) {
      recipe {
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
      score
    }
  }
`;

const PersonalizedRecipeGrid: React.FC<PersonalizedRecipeGridProps> = ({
  userId,
  limit = 12,
  className,
}) => {
  const { loading, error, data } = useQuery<{
    personalizedRecommendations: Recommendation[];
  }>(GET_PERSONALIZED_RECOMMENDATIONS, {
    variables: { userId, limit },
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading personalized recommendations: {error.message}
      </div>
    );

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6",
        className
      )}
    >
      {data?.personalizedRecommendations.map(({ recipe }) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
};

export default PersonalizedRecipeGrid;
