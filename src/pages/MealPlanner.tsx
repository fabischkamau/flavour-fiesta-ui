import { useState } from "react";
import Calendar from "../components/ui/calendar";
import { MealPlanner as MealPlannerComponent } from "../components/MealPlanner";

import { useUser } from "../context/auth";
import { motion } from "framer-motion";

export default function MealPlannerPage() {
  const { userData } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 text-transparent bg-clip-text">
            Meal Planner
          </h1>
          <p className="mt-2 text-cyan-400/70">
            Plan your meals, generate shopping lists, and stay organized
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Calendar Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4"
          >
            <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                Select Date
              </h2>
              <Calendar
                onSelectDate={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
          </motion.div>

          {/* Meal Planner Column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:col-span-8  space-y-6"
          >
            {/* Meal Planner Component */}
            <MealPlannerComponent
              userId={userData!.userId}
              selectedDate={selectedDate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
