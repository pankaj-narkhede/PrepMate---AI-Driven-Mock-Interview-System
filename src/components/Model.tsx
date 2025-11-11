import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";

interface ModelProps{
  title:string;
  description:string;
  isOpen:boolean;
  onClose:()=>void;
  children?: React.ReactNode;
}


export const Model = ({title,description,isOpen,onClose,children}:ModelProps) => {
  const onChange = (open:boolean)=>{
    if (!open) {
      onClose();
    }
  }
  return (
  <>
  <Dialog open={isOpen} onOpenChange={onChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>
       {description}
      </DialogDescription>
    </DialogHeader>

    <div>{children}</div>
  </DialogContent>
</Dialog>
  
  </>
  )
}

export default Model;