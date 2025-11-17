import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { Brain, Video, MessageCircle, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const startInterview = () => {
    if (userId) {
      navigate("/generate");
    } else {
      navigate("/signin");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="mx-auto">
        <section
          className="min-h-screen flex flex-col justify-center bg-cover bg-center bg-no-repeat relative mb-2"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <Container className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-16">
              <div className="flex-1 space-y-6 text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Ace Your Next Interview with{" "}
                  <span className="text-4xl md:text-5xl bg-gradient-to-r from-red-500  to-orange-400 bg-clip-text text-transparent">AI-Powered Practice</span>
                </h1>
                <p className="text-lg max-w-md text-gray-200">
                  Get personalized mock interviews, real-time feedback, and performance analytics tailored to your skills and experience.
                </p>

                <Button
                  size="lg"
                  className="shadow-lg transition-all px-6 py-3 rounded-lg font-semibold "
                  onClick={startInterview}
                >
                  Start An Interview
                </Button>
              </div>

              <div className="flex-1"></div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-orange-50 m-2 rounded-4xl shadow-md ">
          <Container>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">
              Why Choose Our Platform?
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Brain className="w-10 h-10 text-primary" />,
                  title: "AI-Curated Questions",
                  desc: "We generate high-quality interview questions based on your role and experience."
                },
                {
                  icon: <Video className="w-10 h-10 text-primary" />,
                  title: "Real Interview Environment",
                  desc: "Your camera stays on to simulate real interviews. No recording — just practice."
                },
                {
                  icon: <MessageCircle className="w-10 h-10 text-primary" />,
                  title: "Speech-to-Text Transcription",
                  desc: "Your spoken responses are converted into text so you can clearly review how you express your answers."
                },
                {
                  icon: <ChartBar className="w-10 h-10 text-primary" />,
                  title: "AI Feedback",
                  desc: "Receive clear, structured suggestions to improve clarity, confidence, and communication style."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-border text-center transition transform hover:-translate-y-1 bg-white"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-background m-2 rounded-4xl shadow-md">
          <Container>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-10 text-center">
              {[
                {
                  step: "1",
                  title: "Create an Interview",
                  desc: "Enter your role, tech stack, and experience level to generate tailored questions."
                },
                {
                  step: "2",
                  title: "Answer in Real-Time",
                  desc: "Practice with your camera on to simulate real interview pressure."
                },
                {
                  step: "3",
                  title: "Get Feedback",
                  desc: "Review speech transcription and AI-powered improvement suggestions."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-border hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default HomePage;
