import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { BreadCrumbs } from "@/components/BreadCrumbs";
import Headings from "@/components/Headings";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { UserAnswer } from "@/types";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!interviewId) {
      navigate("/generate", { replace: true });
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const interviewRef = doc(db, "interviews", interviewId);
        const interviewSnap = await getDoc(interviewRef);

        if (!interviewSnap.exists()) {
          toast.error("Interview not found");
          navigate("/generate", { replace: true });
          return;
        }

        
        setInterview({
          ...(interviewSnap.data() as Interview),
          id: interviewSnap.id,
        });

        if (!userId) return;

        const feedbackQuery = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId),
          where("mockIdRef", "==", interviewId)
        );

        const feedbackSnap = await getDocs(feedbackQuery);

        
        const fetchedFeedbacks: UserAnswer[] = feedbackSnap.docs.map((doc) => ({
          ...(doc.data() as UserAnswer),
          id: doc.id,
        }));

        setFeedbacks(fetchedFeedbacks);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch feedbacks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [interviewId, navigate, userId]);

  const overallRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";
    const total = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const getBadgeColor = (rating: number) => {
    if (rating >= 8) return "bg-green-500";
    if (rating >= 5) return "bg-yellow-400";
    return "bg-red-500";
  };

  const pieData = useMemo(() => {
    const high = feedbacks.filter(f => f.rating >= 8).length;
    const medium = feedbacks.filter(f => f.rating >= 5 && f.rating < 8).length;
    const low = feedbacks.filter(f => f.rating < 5).length;
    return [
      { name: "High (8-10)", value: high },
      { name: "Medium (5-7)", value: medium },
      { name: "Low (<5)", value: low },
    ];
  }, [feedbacks]);

  const COLORS = ["#34D399", "#FBBF24", "#EF4444"];

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen container mx-auto">
      <BreadCrumbs
        breadCrumbPage="Feedback"
        breadCrumbItems={[
          { label: "Mock Interviews", link: "/generate" },
          { label: interview?.position || "Interview", link: `/generate/interview/${interview?.id}` },
        ]}
      />

      <Headings title="Congratulations!" description="Your personalized feedback is ready. Review it below." />

      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between border-l-4 border-primary transition-all">
        <h3 className="text-lg font-semibold text-gray-800">Overall Rating</h3>
        <span className="text-2xl font-bold text-primary">{overallRating}/10</span>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-gray-800 font-semibold mb-2">Rating Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {feedbacks.length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-6">No feedback available yet.</p>
      )}

      <div className="space-y-4">
        {feedbacks.map((feed) => (
          <Accordion key={feed.id} type="single" collapsible className="border rounded-lg shadow-sm">
            <AccordionItem value={feed.id}>
              <AccordionTrigger className="flex justify-between items-center px-4 py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-t-lg transition">
                <span className="flex-1 pr-3">{feed.question}</span>
                <span className={`ml-3 px-3 py-1 text-white text-sm rounded-full transition-colors ${getBadgeColor(feed.rating)}`}>
                  {feed.rating}/10
                </span>
              </AccordionTrigger>

              <AccordionContent className="p-4 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Card className="p-4 mt-5 bg-green-100 border-green-600 rounded-md shadow-sm border hover:shadow-lg transition">
                    <CardTitle className="text-green-600 font-semibold">Expected Answer</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{feed.correct_ans}</CardDescription>
                  </Card>

                  <Card className="p-4 mt-5 rounded-md shadow-sm border bg-yellow-100 border-yellow-600 hover:shadow-lg transition">
                    <CardTitle className="text-yellow-500 font-semibold">Your Answer</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{feed.user_ans}</CardDescription>
                  </Card>

                  <Card className="p-4 rounded-md mt-5 bg-orange-100 border-orange-600 shadow-sm border hover:shadow-lg transition">
                    <CardTitle className="text-orange-600 font-semibold">AI Feedback</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{feed.feedback}</CardDescription>
                  </Card>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
