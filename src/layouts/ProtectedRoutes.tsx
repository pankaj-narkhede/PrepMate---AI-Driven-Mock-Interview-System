import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoaderPage from "@/Routes/LoaderPage";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk auth state is loaded
  if (!isLoaded) {
    return <LoaderPage />;
  }

  // Redirect if user is not signed in
  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoutes;
