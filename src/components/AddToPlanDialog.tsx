import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Calendar from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

const GET_USER_MEAL_PLANS = gql`
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

const ADD_MEAL_TO_PLAN = gql`
  mutation (
    $mealPlanId: String!
    $recipeId: String!
    $date: String!
    $mealType: String!
    $servings: Int!
  ) {
    addMealToPlan(
      mealPlanId: $mealPlanId
      recipeId: $recipeId
      date: $date
      mealType: $mealType
      servings: $servings
    )
  }
`;

export default function AddToPlanDialog({
  recipeId,
  userId,
}: {
  recipeId: string;
  userId: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [mealType, setMealType] = useState("");
  const [servings, setServings] = useState(2);
  const [isOpen, setIsOpen] = useState(false);

  const { data: plansData } = useQuery(GET_USER_MEAL_PLANS, {
    variables: { userId },
  });

  const [addMealToPlan] = useMutation(ADD_MEAL_TO_PLAN);

  const handleAddToPlan = async () => {
    if (!selectedDate || !selectedPlan || !mealType) return;

    await addMealToPlan({
      variables: {
        mealPlanId: selectedPlan,
        recipeId,
        date: selectedDate.toISOString(),
        mealType,
        servings,
      },
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Add to Meal Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-950 text-white max-h-[90vh] overflow-y-auto">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add to Meal Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Plan
            </label>
            <Select onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select a meal plan" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {plansData?.allMealPlans.map((plan: any) => (
                  <SelectItem
                    key={plan.id}
                    value={plan.id}
                    className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                  >
                    {new Date(plan.startDate).toLocaleDateString()} -{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Date
            </label>
            <div className="border border-gray-600 rounded-lg p-3 bg-gray-700">
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meal Type</label>
            <Select onValueChange={setMealType}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Servings</label>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value))}
              min={1}
              className="w-full bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Button
            onClick={handleAddToPlan}
            className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
          >
            Add to Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
