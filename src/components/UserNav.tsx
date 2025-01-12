import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { User, Settings, LogOut, Heart,Calendar } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserData {
  userId: string;
  email: string;
  full_name: string;
}

interface UserNavProps {
  userData: UserData;
  setUserData: (data: UserData | null) => void;
}

export function UserNav({ userData, setUserData }: UserNavProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-12 w-12 rounded-full  transition-all duration-300"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full ">
            <span className="text-lg font-semibold text-white">
              {userData.full_name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 bg-zinc-950 border border-zinc-800 shadow-xl shadow-orange-500/10"
        align="end"
      >
        <DropdownMenuLabel className="py-4">
          <div className="flex flex-col space-y-2">
            <p className="text-base font-medium bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
              {userData.full_name}
            </p>
            <p className="text-sm text-zinc-400">{userData.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <div className="p-2">
          <Link to="/profile">
            <DropdownMenuItem className="flex items-center p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 mr-3">
                <User className="h-4 w-4" />
              </div>
              <span className="text-zinc-200 font-medium">Profile</span>
            </DropdownMenuItem>
          </Link>

          <Link to="/favorites">
            <DropdownMenuItem className="flex items-center p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/10 text-pink-400 mr-3">
                <Heart className="h-4 w-4" />
              </div>
              <span className="text-zinc-200 font-medium">Favorites</span>
            </DropdownMenuItem>
          </Link>

          <Link to="/meal-planner">
            <DropdownMenuItem className="flex items-center p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-400 mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-zinc-200 font-medium">Meal Planner</span>
            </DropdownMenuItem>
          </Link>

          <Link to="/settings">
            <DropdownMenuItem className="flex items-center p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 mr-3">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-zinc-200 font-medium">Settings</span>
            </DropdownMenuItem>
          </Link>
        </div>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400 mr-3">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-zinc-200 font-medium">Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
