import { useParams } from "react-router-dom";
import ViewMealPlan from "../components/ViewMealPlan";

export default function MealPlannerById() {
  const { mealPlanId } = useParams();

  if (!mealPlanId) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          No meal plan specified
        </h2>
        <p className="text-gray-400">
          Please select a meal plan from the meal planner page.
        </p>
      </div>
    );
  }

  return <ViewMealPlan mealPlanId={mealPlanId} />;
}
