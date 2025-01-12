import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/auth";
import PreferencesTabs from "../components/PreferencesTabs";
import { Button } from "../components/ui/button";
import { LoaderCircle } from "lucide-react";

const CREATE_USER = gql`
  mutation (
    $id: String!
    $email: String!
    $name: String!
    $allergens: [String!]!
    $favoriteCuisines: [String!]!
    $skillLevel: String!
  ) {
    createUser(
      id: $id
      email: $email
      name: $name
      allergens: $allergens
      favoriteCuisines: $favoriteCuisines
      skillLevel: $skillLevel
    )
  }
`;

const GET_ALLERGENS = gql`
  query {
    allergens
  }
`;

const GET_CUISINES = gql`
  query {
    cusines
  }
`;

export default function UserPreferences() {
  const { userData } = useUser();
  const navigate = useNavigate();
  const [allergens, setAllergens] = useState<string[]>([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<string>("beginner");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createUser] = useMutation(CREATE_USER);
  const { data: allergensData } = useQuery(GET_ALLERGENS);
  const { data: cuisinesData } = useQuery(GET_CUISINES);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createUser({
        variables: {
          id: userData!.userId,
          email: userData!.email,
          name: userData!.full_name,
          allergens,
          favoriteCuisines,
          skillLevel,
        },
      });
      setIsSubmitting(false);
      navigate("/home");
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating user preferences:", error);
    }
  };
  console.log(cuisinesData);
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Set Your Culinary Preferences
        </h1>
        <form onSubmit={handleSubmit}>
          <PreferencesTabs
            allergens={allergensData?.allergens || []}
            cuisines={cuisinesData?.cusines || []}
            selectedAllergens={allergens}
            selectedCuisines={favoriteCuisines}
            skillLevel={skillLevel}
            onAllergensChange={setAllergens}
            onCuisinesChange={setFavoriteCuisines}
            onSkillLevelChange={setSkillLevel}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition duration-300"
          >
            {isSubmitting ? (
              <p className="flex spaxe-x-2 items-center">
                <span>please wait</span>
                <LoaderCircle className="animate-spin size-5 mx-1" />
              </p>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
