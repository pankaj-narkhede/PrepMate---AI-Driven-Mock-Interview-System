import React, { useState, useEffect } from "react";
import { InterviewForm } from "@/components/InterviewForm";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";

export const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) {
        setLoading(false);
        return;
      }

      try {
        const interviewRef = doc(db, "interviews", interviewId);
        const interviewDoc = await getDoc(interviewRef);

        if (interviewDoc.exists()) {
          setInterview({ id: interviewDoc.id, ...interviewDoc.data() } as Interview);
        } else {
          console.warn("Interview not found");
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Loading interview...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <InterviewForm initialData={interview} />
    </div>
  );
};
