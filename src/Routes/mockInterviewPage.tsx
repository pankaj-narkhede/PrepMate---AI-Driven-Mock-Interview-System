import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { Loader } from "lucide-react";
import { BreadCrumbs } from "@/components/BreadCrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import  QuestionSection  from "@/components/QuestionSection"; 

export const MockInterviewPage = () => {
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
        const interviewRef = doc(db, "interviews", interviewId);
        const interviewDoc = await getDoc(interviewRef);

        if (interviewDoc.exists()) {
          setInterview({
            id: interviewDoc.id,
            ...interviewDoc.data(),
          } as Interview);
        } else {
          console.warn("Interview not found");
          navigate("/generate", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
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
        <Loader className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  
  if (!interview) {
    return <div className="text-center text-gray-600 mt-10">Interview not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <BreadCrumbs
        breadCrumbPage="Interview Window"
        breadCrumbItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview.position || "Interview",
            link: `/generate/interview/${interview.id}`,
          },
        ]}
      />

      <Alert>
        <AlertTitle>Important Information!</AlertTitle>
        <AlertDescription>
          Please enable your webcam and microphone to start the mock interview.
          The interview consists of five questions, and you will receive a
          personalized report based on your responses at the end.
        </AlertDescription>
      </Alert>

  
      {interview.questions && interview.questions.length > 0 ? (
        <QuestionSection questions={interview.questions} />
      ) : (
        <p className="text-gray-500">No questions available for this interview.</p>
      )}
    </div>
  );
}; 
