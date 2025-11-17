
import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import IconButtonWithTooltip from "./IconButtonWithTooltip";
import { sendPrompt } from "@/scripts";
import { db } from "@/config/firebase.config";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import SaveModal from "./SaveModel";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
  index: number;
  setAttempted: React.Dispatch<React.SetStateAction<boolean[]>>;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
  index,
  setAttempted,
}: RecordAnswerProps) => {
  const { userId } = useAuth();
  const { interviewId } = useParams();

  const webcamRef = useRef<Webcam>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({ continuous: true, useLegacyResults: false });

  const [userAnswer, setUserAnswer] = useState("");
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [open, setOpen] = useState(false);

  // Combine speech result
  useEffect(() => {
    const combined = results
      .filter((r): r is ResultType => typeof r !== "string")
      .map((r) => r.transcript)
      .join(" ");
    setUserAnswer(combined);
  }, [results]);

  
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      setStream(mediaStream);
      setIsWebCam(true);

      
      if (webcamRef.current?.video) {
        (webcamRef.current.video as HTMLVideoElement).srcObject = mediaStream;
      }

      toast.success("Webcam started");
    } catch (err) {
      toast.error("Camera access denied or unavailable");
      setIsWebCam(false);
    }
  };

  
  const stopWebcam = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsWebCam(false);
    toast.info("Webcam stopped");
  };


  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  
  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer.length < 30) {
        toast.error("Your answer should be more than 30 characters");
        return;
      }

      const ai = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );
      setAiResult(ai);

      setAttempted((prev) => {
        const newArr = [...prev];
        newArr[index] = true;
        return newArr;
      });
    } else {
      startSpeechToText();
    }
  };

  
  const generateResult = async (q: string, correct: string, userAns: string) => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${q}"
      User Answer: "${userAns}"
      Correct Answer: "${correct}"
      Rate answer 1-10 and give brief feedback.
      Respond in JSON: { "ratings": number, "feedback": string }
    `;

    try {
      const text = await sendPrompt(prompt);
      return JSON.parse(text.replace(/```|json/gi, "").trim());
    } catch {
      toast.error("Error generating AI feedback");
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };


  const recordNewAnswer = () => {
    stopSpeechToText();
    setUserAnswer("");
    setAiResult(null);
    startSpeechToText();
  };

  
  const saveUserAnswer = async () => {
    if (!aiResult) return;

    setLoadingSave(true);
    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", question.question)
      );

      const snap = await getDocs(userAnswerQuery);
      if (!snap.empty) {
        toast.info("Already answered this question");
        return;
      }

      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: question.question,
        correct_ans: question.answer,
        user_ans: userAnswer,
        feedback: aiResult.feedback,
        rating: aiResult.ratings,
        userId,
        createdAt: serverTimestamp(),
      });

      toast.success("Answer saved successfully");
      setUserAnswer("");
      setAiResult(null);
      stopSpeechToText();
    } catch {
      toast.error("Failed to save answer");
    } finally {
      setLoadingSave(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-4">
      <SaveModal isOpen={open} onClose={() => setOpen(false)} onConfirm={saveUserAnswer} loading={loadingSave} />

      <div className="w-full h-64 md:w-96 flex items-center justify-center border p-2 bg-gray-50 rounded-md">
        {isWebCam && stream ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user",
            }}
            className="w-full h-full object-cover rounded-md"
            screenshotFormat="image/jpeg"
          />
        ) : (
          <WebcamIcon className="w-16 h-16 text-gray-400" />
        )}
      </div>

      <div className="flex justify-center gap-3">
        <IconButtonWithTooltip
          tooltip={isWebCam ? "Turn Off Webcam" : "Turn On Webcam"}
          icon={isWebCam ? <VideoOff /> : <Video />}
          onClick={isWebCam ? stopWebcam : startWebcam}
        />

        <IconButtonWithTooltip
          tooltip={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <CircleStop /> : <Mic />}
          onClick={recordUserAnswer}
        />

        <IconButtonWithTooltip tooltip="Record Again" icon={<RefreshCw />} onClick={recordNewAnswer} />

        <IconButtonWithTooltip
          tooltip="Save Result"
          icon={isAiGenerating ? <Loader className="animate-spin" /> : <Save />}
          onClick={() => setOpen(true)}
          disabled={!aiResult}
        />
      </div>

      <div className="w-full p-4 border rounded-md bg-gray-50">
        <h2 className="font-semibold text-lg">Your Answer:</h2>
        <p className="text-sm mt-2 text-gray-700">{userAnswer || "Start recording to see your answer here."}</p>
        {interimResult && <p className="text-sm mt-2 text-gray-500"><strong>Current Speech:</strong> {interimResult}</p>}
      </div>
    </div>
  );
};

export default RecordAnswer;
