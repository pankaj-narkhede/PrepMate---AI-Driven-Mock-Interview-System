import { useAuth, UserButton } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProfileContainer = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center">
        <Loader className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {isSignedIn ? (
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 rounded-full",
            },
          }}
        />
      ) : (
        <Link to="/signin">
          <Button>Start An Interview</Button>
        </Link>
      )}
    </div>
  );
};

export default ProfileContainer;
