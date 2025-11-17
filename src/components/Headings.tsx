import { cn } from "@/lib/utils";

interface HeadingsProps{
title:string;
description?:string;
isSubheading?:boolean;
className?: string; 
}

export const Headings = ({title,description,isSubheading=false, className} : HeadingsProps) => {
  return (
    
    <div className={cn("space-y-1", className)}>
   
      <h2 
        className={cn(
          "font-extrabold tracking-tight", 
          isSubheading 
            ? "text-xl md:text-2xl bg-gradient-to-r from-orange-600  to-orange-400 bg-clip-text text-transparent" 
            : "text-2xl md:text-4xl bg-gradient-to-r from-orange-600  to-orange-400 bg-clip-text text-transparent "  
        )}
      >
        {title}
      </h2>

      
      {description && (
        <p className="text-sm md:text-base text-gray-400 font-light">
          {description}
        </p>
      )}
    </div>
  )
}

export default Headings;