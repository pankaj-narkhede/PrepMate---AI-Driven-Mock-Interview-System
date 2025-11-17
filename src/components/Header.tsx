import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import Container from "./Container";
import { NavLink } from "react-router-dom";
import ProfileContainer from "./ProfileContainer";
import ToggleContainer from "./ToggleContainer";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="logo" className="h-10 object-contain" />
            <span className="text-lg font-semibold">
              <span className="text-primary">Prep</span>Mate
            </span>
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center gap-6">

            {userId && (
              <NavLink
                to="/generate"
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 font-semibold rounded-md transition-all duration-200",
                    "bg-primary text-primary-foreground",
                    " hover:scale-[1.03] hover:shadow-lg",
                    isActive && "bg-secondary text-secondary-foreground shadow-md scale-105"
                  )
                }
              >
                Take An Interview
              </NavLink>
            )}

            <ProfileContainer />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <ProfileContainer />
            <ToggleContainer />
          </div>

        </div>
      </Container>
    </header>
  );
};

export default Header;
