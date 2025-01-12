import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/auth";
import HomeNavbar from "../components/HomeNavbar";
import { ToastProvider } from "../components/ui/toast";
import FloatingChat from "../components/FloatingChat";

export function AuthLayout() {
  const { userData } = useUser();

  if (!userData?.userId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ToastProvider>
      <div className="container mx-auto">
        <HomeNavbar />
        <main className="mt-5">
          <Outlet />
        </main>
      </div>
      <FloatingChat />
    </ToastProvider>
  );
}
