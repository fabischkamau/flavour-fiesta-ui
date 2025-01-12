import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import RecipeCard from "../components/ui/recipe-card";
import { useUser } from "../context/auth"; // Assuming you have a user context

const GET_FAVORITE_RECIPES = gql`
  query ($userId: String!, $limit: Int!) {
    userFavouriteRecipe(userId: $userId, limit: $limit) {
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

export default function FavoriteRecipes() {
  const { userData } = useUser(); // Get the current user from context
  const { loading, error, data } = useQuery(GET_FAVORITE_RECIPES, {
    variables: { userId: userData!.userId, limit: 10 },
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
        Error loading recipes: {error.message}
      </div>
    );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 ">My Favorite Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.userFavouriteRecipe.map((recipe: any) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </div>
  );
}
