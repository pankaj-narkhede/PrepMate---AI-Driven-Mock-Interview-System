import { useState } from "react";
import { Interview } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader, Edit, Trash, MessageSquare, Clock, Users } from "lucide-react"; // Added Clock and Users icons
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";

interface InterviewProps {
  interview: Interview;
  onMockPage?: boolean;
  onRefresh?: () => void; // optional callback to refresh parent list
}

export const InterviewPin = ({ interview, onMockPage = false, onRefresh }: InterviewProps) => {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Convert Firestore timestamp to JS Date
  const createdAt = interview.createdAt
    ? new Date(interview.createdAt.seconds * 1000).toLocaleDateString()
    : "N/A";

  // Normalize tech stack to array
  const techStackArray = Array.isArray(interview.techStack)
    ? interview.techStack
    : typeof interview.techStack === "string"
    ? interview.techStack.split(",").map((t) => t.trim())
    : [];

  // Delete handler - Replaced window.confirm placeholder
  const handleDelete = async () => {
    // NOTE: Replace this placeholder with a custom modal in a full production environment.
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
    // CARD STYLING: Clean white background, subtle border, smooth shadow hover
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-border transition-all duration-300 cursor-pointer">
      
      <CardHeader className="pb-3 border-b border-gray-100">
        {/* Title: Dark, prominent text */}
        <CardTitle className="text-xl font-bold text-gray-800 line-clamp-1">
          {interview.position}
        </CardTitle>
        {/* Description: Light gray text */}
        <CardDescription className="text-sm text-gray-500 line-clamp-2">
          {interview.description || "No description available"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-4">
        
        {/* Experience & Creation Date - Cleaner icon-based detail line */}
        <div className="flex flex-wrap justify-between text-sm text-gray-600 gap-2">
          <span className="flex items-center gap-1 text-gray-700 font-medium">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Exp: {interview.experience} yrs</span>
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Created: {createdAt}</span>
          </span>
        </div>

        {/* Tech stack badges */}
        {techStackArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 border-t pt-3 border-gray-100">
            {techStackArray.map((tech) => (
              // BADGE STYLING: Secondary/Outline style (e.g., blue/gray)
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
            {/* Start Button: Primary Blue CTA */}
            <Button
              onClick={handleStart}
              size="sm"
              className="flex items-center gap-1 text-white font-semibold "
              disabled={loading}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Start Mock"}
              {!loading && <Sparkles className="w-4 h-4" />}
            </Button>

            {/* Feedback Button: Secondary/Outline style */}
            <Button size="sm" variant="destructive" 
              className="flex items-center gap-1 text-gray-700  hover:bg-gray-100 hover:border-border" 
              onClick={handleFeedback}
            >
              <MessageSquare className="w-4 h-4" /> Feedback
            </Button>

            {/* Update and Delete Buttons: Tertiary/Icon-only style */}
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

        {/* Mock in progress text */}
        {onMockPage && <span className="mt-3 text-sm font-medium text-blue-500">Mock in progress...</span>}
      </CardContent>
    </Card>
  );
};