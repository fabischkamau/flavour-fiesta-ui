import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "./ui/toast";
import { ListChecks, Loader2, Printer, Trash2 } from "lucide-react";
import Loader from "./Loader";
import ErrorBoundary from "./ErrorBoundary";
import { useState } from "react";

const GET_MEAL_PLAN = gql`
  query ($mealPlanId: String!) {
    mealPlanById(mealPlanId: $mealPlanId) {
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

const GET_SHOPPING_LIST = gql`
  query ($mealPlanId: String!) {
    mealPlanShoppingList(mealPlanId: $mealPlanId) {
      id
      userId
      mealPlanId
      items {
        ingredient
        checked
      }
      dateCreated
    }
  }
`;

const CREATE_SHOPPING_LIST = gql`
  mutation ($mealPlanId: String!, $userId: String!) {
    createShoppingList(mealPlanId: $mealPlanId, userId: $userId)
  }
`;

const UPDATE_SHOPPING_LIST_ITEM = gql`
  mutation (
    $shoppingListId: String!
    $ingredient: String!
    $checked: Boolean!
  ) {
    updateShoppingListItem(
      shoppingListId: $shoppingListId
      ingredient: $ingredient
      checked: $checked
    )
  }
`;

const DELETE_MEAL_FROM_PLAN = gql`
  mutation ($mealPlanId: String!, $plannedMealId: String!, $userId: String!) {
    deleteMealFromPlan(
      mealPlanId: $mealPlanId
      plannedMealId: $plannedMealId
      userId: $userId
    )
  }
`;

export default function ViewMealPlan({ mealPlanId }: { mealPlanId: string }) {
  const { showToast } = useToast();
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [deletingMeal, setDeletingMeal] = useState<string | null>(null);

  const {
    loading,
    error,
    data,
    refetch: refetchMealPlan,
  } = useQuery(GET_MEAL_PLAN, {
    variables: { mealPlanId },
  });

  const {
    data: shoppingListData,
    loading: shoppingListLoading,
    refetch: refetchShoppingList,
  } = useQuery(GET_SHOPPING_LIST, {
    variables: { mealPlanId },
  });

  const [createShoppingList] = useMutation(CREATE_SHOPPING_LIST, {
    onCompleted: async (data) => {
      setCreatingList(false);
      if (data.createShoppingList) {
        await refetchShoppingList();
        showToast(
          "Shopping List Created",
          "Your shopping list has been generated based on the meal plan",
          "success"
        );
      } else {
        showToast(
          "Error",
          "Failed to create shopping list. Please try again.",
          "error"
        );
      }
    },
    onError: () => {
      setCreatingList(false);
      showToast(
        "Error",
        "Failed to create shopping list. Please try again.",
        "error"
      );
    },
  });

  const [updateShoppingListItem] = useMutation(UPDATE_SHOPPING_LIST_ITEM, {
    onCompleted: (data) => {
      setUpdatingItem(null);
      if (data.updateShoppingListItem) {
        refetchShoppingList();
      }
    },
    onError: () => {
      setUpdatingItem(null);
      showToast("Error", "Failed to update item. Please try again.", "error");
    },
  });

  const handleCreateShoppingList = async () => {
    setCreatingList(true);
    await createShoppingList({
      variables: {
        mealPlanId,
        userId: data?.mealPlanById?.userId,
      },
    });
  };

  const handleCheckboxChange = async (ingredient: string, checked: boolean) => {
    if (!shoppingListData?.mealPlanShoppingList?.id) return;

    setUpdatingItem(ingredient);
    await updateShoppingListItem({
      variables: {
        shoppingListId: shoppingListData.mealPlanShoppingList.id,
        ingredient,
        checked,
      },
    });
  };

  const handleOpenShoppingList = () => {
    setIsShoppingListOpen(true);
    refetchShoppingList();
  };
  const [deleteMealFromPlan] = useMutation(DELETE_MEAL_FROM_PLAN, {
    onCompleted: async (data) => {
      setDeletingMeal(null);
      if (data.deleteMealFromPlan) {
        await refetchMealPlan();
        await refetchShoppingList();
        showToast(
          "Meal Deleted",
          "The meal has been removed from your plan",
          "success"
        );
      } else {
        showToast("Error", "Failed to delete meal. Please try again.", "error");
      }
    },
    onError: () => {
      setDeletingMeal(null);
      showToast("Error", "Failed to delete meal. Please try again.", "error");
    },
  });

  const handleDeleteMeal = async (plannedMealId: string) => {
    if (!data?.mealPlanById?.userId) return;

    setDeletingMeal(plannedMealId);
    await deleteMealFromPlan({
      variables: {
        mealPlanId,
        plannedMealId,
        userId: data.mealPlanById.userId,
      },
    });
  };

  const handlePrintShoppingList = () => {
    if (!shoppingListData?.mealPlanShoppingList?.items) return;

    const printContent = `
      <html>
        <head>
          <title>Shopping List</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
            ul { list-style-type: none; padding: 0; }
            li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Shopping List</h1>
          <ul>
            ${shoppingListData.mealPlanShoppingList.items
              .map(
                (item: any) =>
                  `<li>${item.checked ? "✓" : "☐"} ${item.ingredient}</li>`
              )
              .join("")}
          </ul>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorBoundary message={error.message} />;

  const mealPlan = data?.mealPlanById;
  const shoppingList = shoppingListData?.mealPlanShoppingList;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-950 p-6 rounded-lg shadow-lg relative min-h-screen">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Meal Plan: {formatDate(mealPlan?.startDate)} -{" "}
          {formatDate(mealPlan?.endDate)}
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={handleOpenShoppingList}
            className="bg-cyan-600 hover:bg-cyan-700"
            disabled={loading}
          >
            <ListChecks className="mr-2 h-4 w-4" />
            Shopping List
          </Button>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            <Link to="/meal-planner">Back to All Plans</Link>
          </Button>
        </div>
      </div>

      {mealPlan?.meals?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No meals added to this plan yet.</p>
          <div className="flex gap-3 justify-center">
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              <Link to="/search">Browse Recipes</Link>
            </Button>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <Link to="/recipes">View All Recipes</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(
            mealPlan?.meals?.reduce((acc: any, meal: any) => {
              const date = formatDate(meal.date);
              if (!acc[date]) acc[date] = [];
              acc[date].push(meal);
              return acc;
            }, {})
          ).map(([date, meals]: [string, any]) => (
            <div
              key={date}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <h3 className="text-xl font-semibold text-white mb-4">{date}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {meals.map((meal: any) => (
                  <Card
                    key={`${meal.date}-${meal.mealType}`}
                    className="bg-gray-700/50 backdrop-blur-sm border-gray-600"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-sm">
                          {meal.mealType.charAt(0).toUpperCase() +
                            meal.mealType.slice(1)}
                        </span>
                        <span className="text-gray-400">
                          {meal.servings} serving{meal.servings > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1" variant="outline">
                          <Link to={`/recipe/${meal.recipeId}`}>
                            View Recipe
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteMeal(meal.recipeId)}
                          disabled={deletingMeal === meal.recipeId}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deletingMeal === meal.recipeId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mealPlan?.meals?.length > 0 && (
        <div className="mt-8 text-center">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/home">Browse More Recipes</Link>
          </Button>
        </div>
      )}

      <Dialog open={isShoppingListOpen} onOpenChange={setIsShoppingListOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shopping List</DialogTitle>
          </DialogHeader>

          {shoppingListLoading ? (
            <Loader />
          ) : !shoppingList ? (
            <div className="py-4">
              <p className="text-gray-400 mb-4">
                No shopping list found for this meal plan.
              </p>
              <Button
                onClick={handleCreateShoppingList}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={creatingList}
              >
                {creatingList ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating List...
                  </>
                ) : (
                  "Generate Shopping List"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {shoppingList.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800/50"
                >
                  <Checkbox
                    id={`item-${index}`}
                    checked={item.checked}
                    disabled={updatingItem === item.ingredient}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item.ingredient, checked as boolean)
                    }
                    className="border-gray-500 data-[state=checked]:border-purple-500"
                  />
                  <label
                    htmlFor={`item-${index}`}
                    className={`text-sm select-none cursor-pointer flex items-center gap-2 ${
                      item.checked
                        ? "line-through text-gray-500"
                        : "text-gray-200"
                    }`}
                  >
                    {item.ingredient}
                    {updatingItem === item.ingredient && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                  </label>
                </div>
              ))}
              <Button
                onClick={handlePrintShoppingList}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                disabled={!shoppingList || shoppingList.items.length === 0}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Shopping List
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
