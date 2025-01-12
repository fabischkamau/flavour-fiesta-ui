import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Search, XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDebounce } from "../../hooks/use-debounce";
import { useInView } from "react-intersection-observer";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeCard from "../ui/recipe-card";

const SEARCH_RECIPES = gql`
  query SearchRecipes($searchTerm: String!, $limit: Int!) {
    searchRecipes(searchTerm: $searchTerm, limit: $limit) {
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
    }
  }
`;

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

const ITEMS_PER_PAGE = 12;

export default function SearchRecipes({
  initialSearchTerm,
}: {
  initialSearchTerm: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [loadedItems, setLoadedItems] = useState(ITEMS_PER_PAGE);
  const { ref: loadMoreRef, inView } = useInView();
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [debouncedSearch, navigate, location.pathname]);

  const { loading, error, data, fetchMore } = useQuery<{
    searchRecipes: Recipe[];
  }>(SEARCH_RECIPES, {
    variables: {
      searchTerm: debouncedSearch,
      limit: loadedItems,
    },
    notifyOnNetworkStatusChange: true,
  });

  // Reset pagination when search term changes
  useEffect(() => {
    setLoadedItems(ITEMS_PER_PAGE);
    setHasMore(true);
    setIsFirstLoad(false);
  }, [debouncedSearch]);

  useEffect(() => {
    if (
      inView &&
      !loading &&
      hasMore &&
      data?.searchRecipes.length === loadedItems
    ) {
      fetchMore({
        variables: {
          searchTerm: debouncedSearch,
          limit: loadedItems + ITEMS_PER_PAGE,
        },
      }).then(({ data: newData }) => {
        if (newData.searchRecipes.length < loadedItems + ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setLoadedItems((prev) => prev + ITEMS_PER_PAGE);
        }
      });
    }
  }, [
    inView,
    loading,
    data?.searchRecipes.length,
    loadedItems,
    fetchMore,
    debouncedSearch,
    hasMore,
  ]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The URL will be updated automatically through the useEffect
  };

  const renderContent = () => {
    if (loading && isFirstLoad) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center mb-4 flex flex-col items-center gap-4 min-h-[400px] justify-center">
          <XCircle className="w-12 h-12" />
          <p>Error loading recipes: {error.message}</p>
        </div>
      );
    }

    if (!loading && data?.searchRecipes.length === 0) {
      return (
        <div className="text-gray-400 text-center mb-4 flex flex-col items-center gap-4 min-h-[400px] justify-center">
          <Search className="w-12 h-12" />
          <p className="text-lg">No recipes found for "{debouncedSearch}"</p>
          <p>Try adjusting your search terms or browse our popular recipes</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.searchRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

        {loading && !isFirstLoad && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {hasMore && <div ref={loadMoreRef} className="h-10" />}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={handleSearch}
        className="mb-8 flex items-center justify-center"
      >
        <Input
          type="search"
          placeholder="Search for recipes with ingredients, cusines"
          className="w-full max-w-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" className="ml-2">
          <Search className="w-5 h-5" />
        </Button>
      </form>

      {renderContent()}
    </div>
  );
}
