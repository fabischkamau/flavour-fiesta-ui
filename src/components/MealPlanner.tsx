import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar, Trash2, Eye, Plus } from "lucide-react";
import Loader from "./Loader";
import ErrorBoundary from "./ErrorBoundary";

const CREATE_MEAL_PLAN = gql`
  mutation ($userId: String!, $startDate: String!, $endDate: String!) {
    createMealPlan(userId: $userId, startDate: $startDate, endDate: $endDate) {
      id
      userId
      startDate
      endDate
      meals {
        recipeId
        date
        mealType
        servings
      }
    }
  }
`;

const DELETE_MEAL_PLAN = gql`
  mutation ($mealPlanId: String!) {
    deleteMealPlan(mealPlanId: $mealPlanId)
  }
`;

const GET_MEAL_PLANS = gql`
  query ($userId: String!) {
    allMealPlans(userId: $userId) {
      id
      userId
      startDate
      endDate
      meals {
        recipeId
        date
        mealType
        servings
      }
    }
  }
`;

export function MealPlanner({
  userId,

  selectedDate,
}: MealPlannerProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate);
  const [endDate, setEndDate] = useState<Date | undefined>(
    selectedDate
      ? new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      : undefined
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [createMealPlan, { loading: createLoading, error: createError }] =
    useMutation(CREATE_MEAL_PLAN);
  const [deleteMealPlan] = useMutation(DELETE_MEAL_PLAN);

  const {
    loading: plansLoading,
    error: plansError,
    data: plansData,
    refetch,
  } = useQuery(GET_MEAL_PLANS, {
    variables: {
      userId,
    },
  });

  const handleCreateMealPlan = async () => {
    if (!startDate || !endDate) return;

    try {
      await createMealPlan({
        variables: {
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      await refetch();
    } catch (err) {
      console.error("Error creating meal plan:", err);
    }
  };

  const handleDeleteMealPlan = async (mealPlanId: string) => {
    setDeletingId(mealPlanId);
    try {
      await deleteMealPlan({
        variables: { mealPlanId },
      });
      await refetch();
    } catch (err) {
      console.error("Error deleting meal plan:", err);
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Meal Plans</h2>

      {/* Date Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="date"
                value={startDate?.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="bg-gray-800 text-white border-gray-700 w-full"
                disabled={createLoading}
              />
            </div>
            <div className="flex-1">
              <Input
                type="date"
                value={endDate?.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="bg-gray-800 text-white border-gray-700 w-full"
                disabled={createLoading}
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleCreateMealPlan}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={createLoading || !startDate || !endDate}
        >
          {createLoading ? (
            "Creating..."
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Meal Plan
            </>
          )}
        </Button>
      </div>

      {createError && (
        <div className="text-red-500 mb-4 p-3 bg-red-900/20 rounded-md">
          Error creating meal plan: {createError.message}
        </div>
      )}

      {/* Meal Plans List */}
      {plansLoading ? (
        <Loader />
      ) : plansError ? (
        <ErrorBoundary
          message={`Error loading meal plans: ${plansError.message}`}
        />
      ) : plansData?.allMealPlans.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No Meal Plans Created
          </h3>
          <p className="text-gray-400 mb-4">
            Create your first meal plan to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plansData?.allMealPlans.map((mealPlan: any) => (
            <div
              key={mealPlan.id}
              className="bg-gray-800 p-4 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <h3 className="text-white font-medium">
                      {new Date(mealPlan.startDate).toLocaleDateString()} -{" "}
                      {new Date(mealPlan.endDate).toLocaleDateString()}
                    </h3>
                  </div>
                  <p className="text-gray-400 mt-1">
                    {mealPlan.meals.length} meals planned
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    asChild
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                  >
                    <Link to={`/meal-planner/${mealPlan.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Plan
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleDeleteMealPlan(mealPlan.id)}
                    className="flex-1 md:flex-none bg-red-600 hover:bg-red-700"
                    disabled={deletingId === mealPlan.id}
                  >
                    {deletingId === mealPlan.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {mealPlan.meals.length === 0 && (
                <div className="mt-4 p-3 bg-gray-700/30 rounded-md">
                  <p className="text-gray-400 text-sm mb-2">
                    No meals added to this plan yet
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                  >
                    <Link to="/home">Browse Recipes</Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MealPlannerProps {
  userId: string;

  selectedDate?: Date;
}
