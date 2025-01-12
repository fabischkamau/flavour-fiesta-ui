import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import HomeNavbar from "../components/HomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useUser } from "../context/auth";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [superbaseError, setSuperbaseError] = useState("");
  const { setUserData } = useUser();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Error signing up:", error.message);
        setSuperbaseError(error.message);
      } else {
        const userData = {
          userId: data.user?.id as string,
          email: data.user?.email as string,
          full_name: data.user?.user_metadata?.full_name as string,
        };

        setUserData(userData);
        navigate("/preferences");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSuperbaseError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen container mx-auto">
      <HomeNavbar />
      <div className=" flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold ">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="w-full text-center">
              {superbaseError && (
                <p className="text-rose-400">{superbaseError}</p>
              )}
            </div>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Full Name
                </label>
                <Input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="full-name"
                  required
                  variant="premium"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  variant="premium"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  variant="premium"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <p className="flex spaxe-x-2 items-center">
                    <span>please wait</span>
                    <LoaderCircle className="animate-spin size-5" />
                  </p>
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
          </form>
          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-300 hover:text-indigo-400"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
