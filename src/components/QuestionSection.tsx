import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecordAnswer from "./RecordAnswer";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import { useNavigate } from "react-router-dom";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}

const QuestionSection = ({ questions }: QuestionSectionProps) => {
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [webcamsState, setWebcamsState] = useState(questions.map(() => false));
  const [attempted, setAttempted] = useState<boolean[]>(questions.map(() => false));

  const navigate = useNavigate();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const activeTab = questions[currentIndex]?.question;

  const stopAllWebcams = () => {
    setWebcamsState(Array(questions.length).fill(false));
  };

  const handlePlayQuestion = (qIndex: number, qst: string) => {
    if (isPlaying && currentSpeech) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      } else {
        alert("Your browser does not support text-to-speech.");
      }
    }
  };

  const toggleWebCam = (index: number) => {
    setWebcamsState((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      stopAllWebcams();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      stopAllWebcams();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTabChange = (value: string) => {
    const index = questions.findIndex((q) => q.question === value);
    if (index !== -1) {
      stopAllWebcams();
      setCurrentIndex(index);
    }
  };

  const handleEndInterview = () => {
    navigate("/generate");
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    const activeButton = container?.querySelector(`[value="${activeTab}"]`) as HTMLElement;
    if (container && activeButton) {
      const offsetLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: offsetLeft - containerWidth / 2 + buttonWidth / 2,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);


  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth border-b border-gray-200 rounded-t-lg bg-gray-50 px-1"
        >
          <TabsList className="flex min-w-max space-x-1">
            {questions.map((tab, i) => (
              <TabsTrigger
                key={tab.question}
                value={tab.question}
                className="flex-shrink-0 px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-[color:var(--accent)] rounded-t-lg data-[state=active]:bg-white data-[state=active]:text-[color:var(--primary)] data-[state=active]:font-semibold transition-colors"
              >
                {`Question ${i + 1}`}
                {attempted[i] && <span className="text-green-600 font-bold ml-1">A</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 sm:p-6 shadow-sm">
          {questions.map((tab, i) => (
            <TabsContent key={i} value={tab.question}>
              {i === currentIndex && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-lg text-[color:var(--primary)]">{tab.question}</p>
                    <IconButtonWithTooltip
                      tooltip={isPlaying ? "Stop Speaking" : "Play Question"}
                      icon={isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      onClick={() => handlePlayQuestion(i, tab.question)}
                    />
                  </div>

                  <RecordAnswer
                    question={tab}
                    isWebCam={webcamsState[i]}
                    setIsWebCam={() => toggleWebCam(i)}
                    index={i}
                    setAttempted={setAttempted}
                  />

                  {/* Navigation Buttons */}
                  <div className="mt-6 flex justify-between">
                    <Button disabled={i === 0} onClick={goToPrev} variant="outline">
                      Previous
                    </Button>

                    {i === questions.length - 1 ? (
                      <Button onClick={handleEndInterview} className="bg-red-600 hover:bg-red-700 text-white">
                        End Interview
                      </Button>
                    ) : (
                      <Button onClick={goToNext} className="bg-primary text-white">
                        Next
                      </Button>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default QuestionSection;
