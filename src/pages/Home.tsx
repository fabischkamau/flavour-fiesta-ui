import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RandomRecipeGrid from "../components/random-recipes";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";
import PersonalizedRecipeGrid from "../components/recommendation";
import { useUser } from "../context/auth";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Welcome to RecipeHub</h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover delicious recipes for every occasion
          </p>
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search for recipes with ingredients, cusines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="neon"
              className="flex-grow"
            />
            <Button type="submit" className="ml-2" variant="neon">
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Featured Recipes</h2>
          <RandomRecipeGrid />
        </div>
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Recipes For You</h2>
          <PersonalizedRecipeGrid userId={userData?.userId as string} />
        </div>
      </div>
    </div>
  );
}
