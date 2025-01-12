import { useLocation } from "react-router-dom";
import SearchRecipesComponent from "../components/search-recipe";

export default function SearchRecipes() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get("q") || "";

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Search Results</h1>
        <SearchRecipesComponent initialSearchTerm={initialSearchTerm} />
      </div>
    </div>
  );
}
