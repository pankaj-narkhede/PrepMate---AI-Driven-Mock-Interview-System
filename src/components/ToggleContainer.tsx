import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Menu } from "lucide-react";

const ToggleContainer = () => {
  const { userId } = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {/* Vertical menu for mobile */}
       
         {/* <NavigationRoutes isMobile={true} /> */}

      <nav >
          {userId && (
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              cn(
                "px-4 py-2 font-semibold rounded-md transition-all duration-200",
                    "bg-primary text-primary-foreground",
                    " hover:scale-[1.03] hover:shadow-lg ml-4",
                isActive && "text-primary"
              )
            }
          >
            Take An Interview
          </NavLink>
        )}
      </nav>
       
      </SheetContent>
    </Sheet>
  );
};

export default ToggleContainer;
