import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { useUser } from "../context/auth";
import PreferencesTabs from "./PreferencesTabs";

const GET_USER_PREFERENCES = gql`
  query ($userId: String!) {
    userPreferences(userId: $userId) {
      dietaryRestrictions
      allergens
      favoriteCuisines
      skillLevel
    }
  }
`;

const UPDATE_USER_PREFERENCES = gql`
  mutation (
    $userId: String!
    $allergens: [String!]
    $favoriteCuisines: [String!]
    $skillLevel: String
    $dietaryRestrictions: [String!]
  ) {
    updateUserPreferences(
      userId: $userId
      allergens: $allergens
      favoriteCuisines: $favoriteCuisines
      skillLevel: $skillLevel
      dietaryRestrictions: $dietaryRestrictions
    )
  }
`;

// Available options for each preference category
const AVAILABLE_ALLERGENS = [
  "Dairy",
  "Egg",
  "Eggs",
  "Fish",
  "Gluten",
  "Nuts",
  "Peanuts",
  "Sesame",
  "Shellfish",
  "Soy",
];

const AVAILABLE_CUISINES = [
  "American",
  "Brazilian",
  "Chinese",
  "Dessert",
  "French",
  "Fusion",
  "German",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Lebanese",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Moroccan",
  "Spanish",
  "Swedish",
  "Thai",
  "Tropical",
  "Vietnamese",
];

export default function UpdatePreferences() {
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const { data, loading } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId: userData?.userId },
    skip: !userData?.userId,
  });

  const [updatePreferences, { loading: isSubmitting }] = useMutation(
    UPDATE_USER_PREFERENCES
  );

  const [preferences, setPreferences] = useState({
    allergens: data?.userPreferences?.allergens || [],
    favoriteCuisines: data?.userPreferences?.favoriteCuisines || [],
    skillLevel: data?.userPreferences?.skillLevel || "medium",
    dietaryRestrictions: data?.userPreferences?.dietaryRestrictions || [],
  });

  const handleSave = async () => {
    setError("");
    try {
      await updatePreferences({
        variables: {
          userId: userData?.userId,
          ...preferences,
        },
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update data?.userPreferences?. Please try again.");
      console.error("Error updating preferences:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoaderCircle className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Dietary Preferences
          </CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="gradient">
              Edit Preferences
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-6">
            <PreferencesTabs
              allergens={AVAILABLE_ALLERGENS}
              cuisines={AVAILABLE_CUISINES}
              selectedAllergens={data?.userPreferences?.allergens}
              selectedCuisines={data?.userPreferences?.favoriteCuisines}
              skillLevel={data?.userPreferences?.skillLevel}
              onAllergensChange={(allergens) =>
                setPreferences((prev) => ({ ...prev, allergens }))
              }
              onCuisinesChange={(cuisines) =>
                setPreferences((prev) => ({
                  ...prev,
                  favoriteCuisines: cuisines,
                }))
              }
              onSkillLevelChange={(level) =>
                setPreferences((prev) => ({ ...prev, skillLevel: level }))
              }
            />

            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleSave}
                variant="gradient"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <span>Saving</span>
                    <LoaderCircle className="animate-spin h-4 w-4" />
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setPreferences({
                    allergens: data?.userPreferences?.allergens || [],
                    favoriteCuisines:
                      data?.userPreferences?.favoriteCuisines || [],
                    skillLevel: data?.userPreferences?.skillLevel || "medium",
                    dietaryRestrictions:
                      data?.userPreferences?.dietaryRestrictions || [],
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Allergens</h3>
              <p>
                {data?.userPreferences?.allergens.length > 0
                  ? data?.userPreferences?.allergens.join(", ")
                  : "No allergens specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Favorite Cuisines</h3>
              <p>
                {data?.userPreferences?.favoriteCuisines.length > 0
                  ? data?.userPreferences?.favoriteCuisines.join(", ")
                  : "No favorite cuisines specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Cooking Skill Level</h3>
              <p className="capitalize">{data?.userPreferences?.skillLevel}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Dietary Restrictions</h3>
              <p>
                {data?.userPreferences?.dietaryRestrictions.length > 0
                  ? data?.userPreferences?.dietaryRestrictions.join(", ")
                  : "No dietary restrictions specified"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
