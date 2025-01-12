import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { Checkbox } from "./ui/checkbox";

const GENERATE_SHOPPING_LIST = gql`
  query ($mealPlanId: String!, $userId: String!) {
    generateShoppingList(mealPlanId: $mealPlanId, userId: $userId) {
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

export function ShoppingList({
  userId,
  mealPlanId,
}: {
  userId: string;
  mealPlanId: string;
}) {
  const { loading, error, data } = useQuery(GENERATE_SHOPPING_LIST, {
    variables: { mealPlanId, userId },
  });

  const [updateShoppingListItem] = useMutation(UPDATE_SHOPPING_LIST_ITEM);

  const handleCheckItem = async (ingredient: string, checked: boolean) => {
    try {
      await updateShoppingListItem({
        variables: {
          shoppingListId: data.generateShoppingList.id,
          ingredient,
          checked,
        },
      });
    } catch (err) {
      console.error("Error updating shopping list item:", err);
    }
  };

  if (loading) return <p>Loading shopping list...</p>;
  if (error) return <p>Error loading shopping list: {error.message}</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Shopping List</h2>
      <ul className="space-y-2">
        {data.generateShoppingList.items.map(
          (item: { ingredient: string; checked: boolean }) => (
            <li key={item.ingredient} className="flex items-center space-x-2">
              <Checkbox
                id={item.ingredient}
                checked={item.checked}
                onCheckedChange={(checked: boolean) =>
                  handleCheckItem(item.ingredient, checked as boolean)
                }
              />
              <label
                htmlFor={item.ingredient}
                className={`text-white ${
                  item.checked ? "line-through text-gray-500" : ""
                }`}
              >
                {item.ingredient}
              </label>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
