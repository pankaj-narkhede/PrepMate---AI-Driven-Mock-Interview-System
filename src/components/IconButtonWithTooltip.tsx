import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface IconButtonWithTooltipProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  variant?: "outline" | "default";
  size?: "icon";
  disabled?:boolean;
}

const IconButtonWithTooltip = ({
  icon,
  tooltip,
  onClick,
  variant = "outline",
  size = "icon",
}: IconButtonWithTooltipProps) => {
  return (
    <div className="relative group">
      <Button
        variant={variant}
        size={size}
        className="rounded-full hover:scale-110 transition-transform duration-200"
        onClick={onClick}
      >
        {icon}
      </Button>

      {/* Tooltip */}
      <span className="
        absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
        whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 
        opacity-0 group-hover:opacity-100 
        translate-y-1 group-hover:translate-y-0 
        transition-all duration-200 pointer-events-none
      ">
        {tooltip}
      </span>
    </div>
  );
};

export default IconButtonWithTooltip;
