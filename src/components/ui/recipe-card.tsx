import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Clock, Users, Flame, Star } from "lucide-react";
import { Link } from "react-router-dom";

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
}

export default function RecipeCard(recipe: Recipe) {
  const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    } as const;
    return (
      colors[difficulty.toLowerCase() as Recipe["difficulty"]] || "bg-gray-500"
    );
  };

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-white mb-2">
                {recipe.name}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {recipe.cuisine} Cuisine
              </CardDescription>
            </div>
            <span
              className={cn(
                getDifficultyColor(recipe.difficulty),
                "px-3 py-1 rounded-full text-sm text-white"
              )}
            >
              {recipe.difficulty}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-purple-400" />
              <span>{recipe.cookingTime} mins</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              <span>Serves {recipe.servingSize}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Flame className="w-4 h-4 mr-2 text-orange-400" />
              <span>{recipe.calories} kcal</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>{recipe.rating}/5</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="flex flex-wrap gap-2">
              {recipe.occasions.slice(0, 2).map((occasion, index) => (
                <span
                  key={index}
                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs"
                >
                  {occasion}
                </span>
              ))}
              {recipe.seasons.slice(0, 2).map((season, index) => (
                <span
                  key={index}
                  className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                >
                  {season}
                </span>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
