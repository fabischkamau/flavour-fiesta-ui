import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { Button } from "./ui/button";
import { Star, Heart, Clock, Users, Flame } from "lucide-react";
import { useToast } from "./ui/toast";
import Loader from "./Loader";
import ErrorBoundary from "./ErrorBoundary";
import AddToPlanDialog from "./AddToPlanDialog";

const GET_RECIPE = gql`
  query ($recipeId: String!, $userId: String!) {
    recipeById(recipeId: $recipeId, userId: $userId) {
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

const SAVE_FAVORITE = gql`
  mutation ($userId: String!, $recipeId: String!) {
    saveFavoriteRecipe(userId: $userId, recipeId: $recipeId)
  }
`;

const DELETE_FAVORITE = gql`
  mutation ($userId: String!, $recipeId: String!) {
    deleteFavoriteRecipe(userId: $userId, recipeId: $recipeId)
  }
`;

const RATE_RECIPE = gql`
  mutation ($userId: String!, $recipeId: String!, $rating: Int!) {
    addRateRecipe(userId: $userId, recipeId: $recipeId, rating: $rating)
  }
`;

export default function ViewRecipe({
  recipeId,
  userId,
}: {
  recipeId: string;
  userId: string;
}) {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const { showToast } = useToast();

  const { loading, error, data, refetch } = useQuery(GET_RECIPE, {
    variables: { recipeId, userId },
  });

  const [saveFavorite] = useMutation(SAVE_FAVORITE);
  const [deleteFavorite] = useMutation(DELETE_FAVORITE);
  const [rateRecipe] = useMutation(RATE_RECIPE);

  if (loading) return <Loader />;
  if (error) return <ErrorBoundary message={error.message} />;

  const recipe = data?.recipeById;

  const handleFavorite = async () => {
    try {
      if (recipe.favourite) {
        await deleteFavorite({
          variables: { userId, recipeId },
        });
        showToast(
          "Removed from favorites",
          `${recipe.name} has been removed from your favorites`,
          "info"
        );
      } else {
        await saveFavorite({
          variables: { userId, recipeId },
        });
        showToast(
          "Added to favorites",
          `${recipe.name} has been added to your favorites`,
          "success"
        );
      }
      refetch();
    } catch (error) {
      showToast(
        "Error",
        "Failed to update favorites. Please try again.",
        "error"
      );
    }
  };

  const formatSteps = (stepsString: string): string[] => {
    if (!stepsString) return [];
    return stepsString.split(";").filter((step) => step.trim().length > 0);
  };

  const handleRate = async (rating: number) => {
    try {
      await rateRecipe({
        variables: { userId, recipeId, rating },
      });
      setSelectedRating(rating);
      showToast(
        "Rating updated",
        `You've rated ${recipe.name} ${rating} stars`,
        "success"
      );
      refetch();
    } catch (error) {
      showToast("Error", "Failed to update rating. Please try again.", "error");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-white">{recipe.name}</h1>
        <div className="flex gap-2">
          <AddToPlanDialog recipeId={recipeId} userId={userId} />
          <Button
            onClick={handleFavorite}
            variant={recipe.favourite ? "destructive" : "default"}
          >
            <Heart className="w-5 h-5 mr-2" />
            {recipe.favourite ? "" : "Add to Favorites"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center text-gray-300">
          <Clock className="w-5 h-5 mr-2 text-purple-400" />
          <span>{recipe.cookingTime} mins</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Users className="w-5 h-5 mr-2 text-blue-400" />
          <span>Serves {recipe.servingSize}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Flame className="w-5 h-5 mr-2 text-orange-400" />
          <span>{recipe.calories} kcal</span>
        </div>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 cursor-pointer ${
                star <= (hoveredStar || selectedRating || recipe.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400"
              }`}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => handleRate(star)}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Ingredients</h2>
          <ul className="space-y-2 text-gray-300">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Instructions
          </h2>
          <ol className="space-y-4 text-gray-300">
            {formatSteps(recipe.preparationSteps).map(
              (step: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="font-bold mr-3 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1">{step.trim()}</span>
                </li>
              )
            )}
          </ol>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Additional Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 mb-2">Cuisine</h3>
            <p className="text-white">{recipe.cuisine}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 mb-2">Allergens</h3>
            <p className="text-white">{recipe.allergens.join(", ")}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 mb-2">Occasions</h3>
            <p className="text-white">{recipe.occasions.join(", ")}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 mb-2">Seasons</h3>
            <p className="text-white">{recipe.seasons.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
