import Headings from "@/components/Headings";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { InterviewPin } from "@/components/Pin";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {  Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error fetching interviews:", error);
        toast.error("Something went wrong. Try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
      <div className="flex w-full items-center justify-between">
        <Headings
          title="Dashboard"
          description="Create and start your AI Mock Interviews"
        />
        <Link to="/generate/create">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />

      
      <div className="grid md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse h-40 bg-gray-100" />
            ))
          : interviews.length > 0
          ? interviews.map((interview) => (
              <InterviewPin key={interview.id} interview={interview} />
            ))
          : (
           
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-card border-2 border-dashed border-border/50 rounded-2xl shadow-inner space-y-6 text-center transition-all duration-300 hover:border-primary/50">
              
              <h2 className="text-xl font-bold text-foreground">
                No Mock Interviews Found Yet !!!
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                You haven't created any mock interviews yet. Start your journey to interview success by generating your first personalized AI practice session.
              </p>
              <Link to="/generate/create">
                <Button size="default" className="flex items-center gap-2 mt-4 hover:bg-primary/90 transition-colors">
                  <Plus className="w-5 h-5" /> Generate Your First Interview
                </Button>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};
