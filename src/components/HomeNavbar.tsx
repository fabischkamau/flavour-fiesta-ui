import { Link } from "react-router-dom";
import RecipeIcon from "./icons/recipe";
import { useUser } from "../context/auth";
import { UserNav } from "./UserNav";
import { Button } from "./ui/button";

export default function HomeNavbar() {
  const { userData, setUserData } = useUser();

  return (
    <nav className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
      <div className="flex space-x-2 items-center">
        <RecipeIcon />
        <Link
          to="/"
          className="text-2xl font-semibold text-transparent bg-gradient-to-r from-[#fab871] to-[#e97d19] bg-clip-text text-center"
        >
          Flavour Fiesta
        </Link>
        {userData?.userId && (
          <div className="ml-10">
            <Button variant="outline">
              <Link to="/home">Browse Recipes</Link>{" "}
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {userData ? (
          <UserNav userData={userData} setUserData={setUserData} />
        ) : (
          <Link
            to="/login"
            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
