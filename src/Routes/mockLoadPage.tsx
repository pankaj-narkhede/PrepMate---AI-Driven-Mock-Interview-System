import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { InterviewPin } from "@/components/Pin";
import { BreadCrumbs } from "@/components/BreadCrumbs";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader, Sparkles, Info } from "lucide-react";

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!interviewId) {
      navigate("/generate", { replace: true });
      return;
    }

    const fetchInterview = async () => {
      try {
        const docRef = doc(db, "interviews", interviewId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          navigate("/generate", { replace: true });
          return;
        }

        setInterview({
          ...(docSnap.data() as Interview),
          id: docSnap.id,
        });
      } catch (err) {
        console.error(err);
        navigate("/generate", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!interview) return null;

  const handleStartMock = () => {
    navigate(`/generate/interview/${interviewId}/start`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <BreadCrumbs
        breadCrumbPage={interview.position}
        breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <InterviewPin interview={interview} onMockPage />

      <div className="flex justify-center">
        <Button
          onClick={handleStartMock}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-blue-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Start Mock <Sparkles className="w-5 h-5 animate-bounce" />
        </Button>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200 mt-4">
        <AlertTitle className="text-yellow-800 flex items-center gap-1">
          <Info className="w-4 h-4" /> Guidelines
        </AlertTitle>
        <AlertDescription className="text-yellow-700 text-sm space-y-1">
          <p>1. Enable microphone when prompted.</p>
          <p>2. Camera is used only to simulate real interviews (no recording).</p>
          <p>3. Answer each question clearly and confidently.</p>
          <p>4. You will receive feedback after completion.</p>
        </AlertDescription>
      </Alert>

      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={() => navigate("/generate")}>
          Back to List
        </Button>
      </div>
    </div>
  );
};

export default MockLoadPage;
