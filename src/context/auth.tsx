// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserData {
  userId: string;
  email: string;
  full_name: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  logout: () => Promise<void>;
}

// Create context with a default value
const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  logout: async () => {},
});

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const savedData = localStorage.getItem("userData");
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  });

  useEffect(() => {
    if (userData) {
      try {
        localStorage.setItem("userData", JSON.stringify(userData));
        document.cookie = `userData=${JSON.stringify(userData)};max-age=${
          7 * 24 * 60 * 60
        };path=/;secure;samesite=strict`;
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    } else {
      localStorage.removeItem("userData");
      document.cookie = "userData=;max-age=0;path=/";
    }
  }, [userData]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserData(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value = {
    userData,
    setUserData,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
