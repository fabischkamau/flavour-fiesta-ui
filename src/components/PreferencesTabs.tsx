import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { motion } from "framer-motion";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "lucide-react";

interface PreferencesTabsProps {
  allergens: string[];
  cuisines: string[];
  selectedAllergens: string[];
  selectedCuisines: string[];
  skillLevel: string;
  onAllergensChange: (allergens: string[]) => void;
  onCuisinesChange: (cuisines: string[]) => void;
  onSkillLevelChange: (skillLevel: string) => void;
}

const skillLevels = [
  { name: "Easy", description: "New to cooking" },
  { name: "Medium", description: "Comfortable with basic recipes" },
  { name: "Hard", description: "Experienced home cook" },
];

export default function PreferencesTabs({
  allergens,
  cuisines,
  selectedAllergens,
  selectedCuisines,
  skillLevel,
  onAllergensChange,
  onCuisinesChange,
  onSkillLevelChange,
}: PreferencesTabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log(cuisines);
  return (
    <div className="w-full max-w-md mx-auto">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className="flex space-x-1 rounded-xl bg-purple-900/20 p-1">
          {["Allergens", "Cuisines", "Skill Level"].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white
                 ${
                   selected
                     ? "bg-purple-700 shadow"
                     : "text-purple-100 hover:bg-white/[0.12] hover:text-white"
                 }`
              }
            >
              {category}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel className="rounded-xl bg-purple-900/10 p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium leading-6 text-white mb-4">
                Select Your Allergens
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {allergens.map((allergen) => (
                  <label key={allergen} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAllergens.includes(allergen)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onAllergensChange([...selectedAllergens, allergen]);
                        } else {
                          onAllergensChange(
                            selectedAllergens.filter((a) => a !== allergen)
                          );
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span className="text-white">{allergen}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </TabPanel>
          <TabPanel className="rounded-xl bg-purple-900/10 p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium leading-6 text-white mb-4">
                Select Your Favorite Cuisines
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {cuisines.map((cuisine) => (
                  <label key={cuisine} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCuisines.includes(cuisine)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onCuisinesChange([...selectedCuisines, cuisine]);
                        } else {
                          onCuisinesChange(
                            selectedCuisines.filter((c) => c !== cuisine)
                          );
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span className="text-white">{cuisine}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </TabPanel>
          <TabPanel className="rounded-xl bg-purple-900/10 p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium leading-6 text-white mb-4">
                Select Your Skill Level
              </h3>
              <RadioGroup
                value={skillLevel}
                onChange={onSkillLevelChange}
                aria-label="Cooking skill level"
                className="space-y-2"
              >
                {skillLevels.map((level) => (
                  <Radio
                    key={level.name}
                    value={level.name.toLowerCase()}
                    className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm/6">
                        <p className="font-semibold text-white">{level.name}</p>
                        <div className="text-white/50">{level.description}</div>
                      </div>
                      <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
