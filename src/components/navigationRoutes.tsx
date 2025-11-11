import { MainRoutes } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface NavigationRoutesProps {
  isMobile?: boolean; // true = vertical, false = horizontal
}

const NavigationRoutes = ({ isMobile = false }: NavigationRoutesProps) => {
  return (
    <ul
      className={cn(
        "flex",
        isMobile
          ? "flex-col space-y-3 px-2"
          : "flex-row items-center space-x-6"
      )}
    >
      {MainRoutes.map((route) => (
        <li key={route.href}>
          <NavLink
            to={route.href}
            className={({ isActive }) =>
              cn(
                "font-medium text-gray-600 hover:text-primary transition-colors duration-200",
                isActive && "text-primary"
              )
            }
          >
            {route.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavigationRoutes;
