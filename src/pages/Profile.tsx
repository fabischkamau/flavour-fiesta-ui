import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Label from "../components/ui/label";
import { LoaderCircle, UserCircle } from "lucide-react";
import { useUser } from "../context/auth";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Profile() {
  const { userData, setUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: userData?.full_name ?? "",
    email: userData?.email ?? "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: formData.email,
        data: { full_name: formData.full_name },
      });

      if (updateError) {
        setError(updateError.message);
      } else if (userData?.userId) {
        // Ensure userId exists
        setUserData({
          userId: userData.userId, // Include the required userId
          email: formData.email,
          full_name: formData.full_name,
        });
        setIsEditing(false);
      } else {
        setError("User ID is missing");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-extrabold">Profile</CardTitle>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="gradient">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <UserCircle className="h-32 w-32 text-gray-400" />
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <div className="w-full text-center">
                  <p className="text-rose-400">{error}</p>
                </div>
              )}

              <div className="rounded-md shadow-sm space-y-3">
                <div>
                  <Label
                    htmlFor="full_name"
                    className="block text-sm font-medium"
                  >
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      variant="premium"
                      required
                    />
                  ) : (
                    <p className="mt-1 p-2">{formData.full_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="premium"
                      required
                    />
                  ) : (
                    <p className="mt-1 p-2">{formData.email}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    variant="gradient"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <p className="flex space-x-2 items-center">
                        <span>please wait</span>
                        <LoaderCircle className="animate-spin size-5" />
                      </p>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: userData?.full_name ?? "",
                        email: userData?.email ?? "",
                      });
                      setError("");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
