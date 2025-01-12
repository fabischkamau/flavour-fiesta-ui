// RecipePage.tsx
import { useParams } from "react-router-dom";
import ViewRecipe from "../components/ViewRecipe";
import { useUser } from "../context/auth";
import SimilarRecipeGrid from "../components/similar-recipe";

export default function RecipePage() {
  const { recipeId } = useParams();
  const { userData: user } = useUser();

  if (!recipeId || !user?.userId) return null;

  return (
    <>
      <ViewRecipe recipeId={recipeId} userId={user.userId} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Similar Recipes</h2>
      <SimilarRecipeGrid recipeId={recipeId} />
    </>
  );
}
