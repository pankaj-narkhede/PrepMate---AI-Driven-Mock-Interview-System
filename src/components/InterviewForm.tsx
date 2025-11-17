import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { BreadCrumbs } from "./BreadCrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Headings from "./Headings";

import { sendPrompt } from "@/scripts";
import { Interview } from "@/types";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface FormData {
  position: string;
  description: string;
  experience: number | string;
  techStack: string;
}

interface AIQuestion {
  question: string;
  answer: string;
}

interface InterviewFormProps {
  initialData?: Interview | null;
}

export const InterviewForm = ({ initialData }: InterviewFormProps) => {
  const form = useForm<FormData>({
    defaultValues: initialData || {
      position: "",
      description: "",
      experience: "",
      techStack: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId, isLoaded } = useAuth();

  const cleanAiResponse = (text: string): AIQuestion[] => {
    const match = text.match(/\[.*\]/s);
    if (!match) return [];

    try {
      return JSON.parse(match[0]) as AIQuestion[];
    } catch {
      return [];
    }
  };

  const generateAiResponse = async (data: FormData): Promise<AIQuestion[]> => {
    const prompt = `
      Generate 5 interview Q&A JSON array for:
      Role: ${data.position}
      Description: ${data.description}
      Tech: ${data.techStack}
      Experience: ${data.experience}
      Only return valid JSON:
      [
        { "question": "", "answer": "" }
      ]
    `;

    const result = await sendPrompt(prompt);
    return cleanAiResponse(result.trim());
  };

  const handleDelete = async (): Promise<void> => {
    if (!initialData) return;
    if (!confirm("Delete this interview?")) return;

    setLoading(true);
    await deleteDoc(doc(db, "interviews", initialData.id));
    toast.success("Interview deleted.");
    navigate("/generate", { replace: true });
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    if (!isLoaded || !userId) {
      toast.error("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const formattedData = {
        ...data,
        experience: Number(data.experience),
      };

      const questions = await generateAiResponse(formattedData);

      if (initialData) {
        await updateDoc(doc(db, "interviews", initialData.id), {
          ...formattedData,
          questions,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "interviews"), {
          ...formattedData,
          userId,
          questions,
          createdAt: serverTimestamp(),
        });
      }

      toast.success("New mock interview created successfully.");
      navigate("/generate", { replace: true });
    } catch (error) {
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData, form]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-8">

      <BreadCrumbs
        breadCrumbPage={initialData ? "Edit" : "Create"}
        breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="flex justify-between items-center">
        <Headings
          title={initialData ? "Edit Mock Interview" : "Create a New Mock Interview"}
          isSubheading
        />
        {initialData && (
          <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader className="w-4 h-4 animate-spin text-primary" /> : <Trash2 className="w-5 h-5" />}
          </Button>
        )}
      </div>

      <Separator />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Position */}
          <FormField
            control={form.control}
            name="position"
            rules={{ required: "Position is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl><Input {...field} disabled={loading} /></FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-28" disabled={loading} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Experience */}
          <FormField
            control={form.control}
            name="experience"
            rules={{ required: "Experience is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience (years)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    className="appearance-none"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Tech Stack */}
          <FormField
            control={form.control}
            name="techStack"
            rules={{ required: "Tech stack is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <FormControl><Input {...field} disabled={loading} /></FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" disabled={loading} onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={loading} >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : (initialData ? "Save Changes" : "Create")}
            </Button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
};
