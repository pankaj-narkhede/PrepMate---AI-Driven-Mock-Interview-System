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
            ? "text-xl md:text-2xl text-orange-400" 
            : "text-2xl md:text-4xl text-orange-500"  
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