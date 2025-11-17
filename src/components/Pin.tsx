import { useState } from "react";
import { Interview } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader, Edit, Trash, MessageSquare, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";

interface InterviewProps {
  interview: Interview;
  onMockPage?: boolean;
  onRefresh?: () => void; 
}

export const InterviewPin = ({ interview, onMockPage = false, onRefresh }: InterviewProps) => {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  
  const createdAt = interview.createdAt
    ? new Date(interview.createdAt.seconds * 1000).toLocaleDateString()
    : "N/A";

  
  const techStackArray = Array.isArray(interview.techStack)
    ? interview.techStack
    : typeof interview.techStack === "string"
    ? interview.techStack.split(",").map((t) => t.trim())
    : [];


  const handleDelete = async () => {
   
    const confirmDelete = window.confirm("Are you sure you want to delete this interview?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "interviews", interview.id));
      toast.success("Interview deleted successfully");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleUpdate = () => navigate(`/generate/${interview.id}`, { replace: true });
  const handleFeedback = () => navigate(`/generate/feedback/${interview.id}`, { replace: true });
  const handleStart = () => navigate(`/generate/interview/${interview.id}`, { replace: true });

  return (
  
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-border transition-all duration-300 cursor-pointer">
      
      <CardHeader className="pb-3 border-b border-gray-100">
        
        <CardTitle className="text-xl font-bold text-primary line-clamp-1">
          {interview.position}
        </CardTitle>
       
        <CardDescription className="text-sm text-gray-500 line-clamp-2">
          {interview.description || "No description available"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-4">
        
       
        <div className="flex flex-wrap justify-between text-sm text-gray-600 gap-2">
          <span className="flex items-center gap-1 text-gray-700 font-medium">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-gray-600">Exp: {interview.experience} yrs</span>
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Created: {createdAt}</span>
          </span>
        </div>

        
        {techStackArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 border-t pt-3 border-gray-100">
            {techStackArray.map((tech) => (
             
              <Badge 
                key={tech} 
                className="text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {!onMockPage && (
          <div className="flex flex-wrap gap-2 mt-4">
           
            <Button
              onClick={handleStart}
              size="sm"
              className="flex items-center gap-1 text-white font-semibold "
              disabled={loading}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Start Mock"}
              {!loading && <Sparkles className="w-4 h-4" />}
            </Button>

            
            <Button size="sm" variant="destructive" 
              className="flex items-center gap-1 text-gray-700  hover:bg-gray-100 hover:border-border" 
              onClick={handleFeedback}
            >
              <MessageSquare className="w-4 h-4" /> Feedback
            </Button>

           
            <Button size="sm" variant="ghost" 
              className="text-gray-500 hover:bg-gray-100 hover:text-orange-600" 
              onClick={handleUpdate}
            >
              <Edit className="w-4 h-4" /> 
            </Button>

            <Button size="sm" variant="ghost" 
              className="text-red-500 hover:bg-red-50 hover:text-red-700" 
              onClick={handleDelete} 
              disabled={loading}
            >
              <Trash className="w-4 h-4" /> 
            </Button>
          </div>
        )}

       
        {onMockPage && <span className="mt-3 text-sm font-medium text-primary">Mock in progress...</span>}
      </CardContent>
    </Card>
  );
};