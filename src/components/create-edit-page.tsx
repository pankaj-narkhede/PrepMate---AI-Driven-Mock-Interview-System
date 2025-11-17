import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Interview } from "@/types";
import { db } from "@/config/firebase.config";
import { InterviewForm } from "@/components/InterviewForm";

export const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {

      if (interviewId) {
        try {
          const interviewRef = doc(db, "interviews", interviewId);
          const interviewDoc = await getDoc(interviewRef);

          if (interviewDoc.exists()) {
            const data = interviewDoc.data() as Interview;

            setInterview({
              ...data,
              id: interviewDoc.id,
            });
          }
        } catch (error) {
          console.error("Error fetching interview:", error);
        }
      }

      setIsLoading(false); 
    };

    fetchInterview();
  }, [interviewId]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {isLoading ? (
        <p>Loading interview...</p>
      ) : (
        <InterviewForm initialData={interview ?? undefined} />
      )}
    </div>
  );
};
