import {
  AlarmClockIcon,
  XCircleIcon,
  CheckCircleIcon,
  Mic,
  User,
  Bot,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AIMockInterviewConfiguration } from "@/api/types/ai-mock-interview.types";
import { RetellWebClient } from "retell-client-js-sdk";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";
import { AvatarSpeaker } from "../AISpeakerAvatar";
import { Avatar,  AvatarImage } from "@/components/ui/avatar";

type CallProps = {
  interview: AIMockInterviewConfiguration;
};

type transcriptType = {
  role: string;
  content: string;
};

const webClient = new RetellWebClient();

export default function Call({ interview }: CallProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lastInterviewerResponse, setLastInterviewerResponse] =
    useState<string>("");
  const [lastUserResponse, setLastUserResponse] = useState<string>("");
  const [activeTurn, setActiveTurn] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState<string>("");
  const [interviewTimeDuration, setInterviewTimeDuration] =
    useState<string>("1");
  const [time, setTime] = useState(0);
  const [currentTimeDuration, setCurrentTimeDuration] = useState<string>("0");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const lastUserResponseRef = useRef<HTMLDivElement | null>(null);
  const [audioData, setAudioData] = useState(null);

  const { data: interviewers } = useQuery({
    queryKey: ["interviewers"],
    queryFn: async () => {
      const response = await fetch(
        "/candidates/mock-ai-interview/interviewers"
      );
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!interview.interviewerAgentId,
  });

  useEffect(() => {
    webClient.on("call_started", () => {
      setIsCalling(true);
    });

    webClient.on("call_ended", () => {
      setIsCalling(false);
      setIsEnded(true);
    });

    if (interviewers && interview.interviewerAgentId) {
      const interviewer = interviewers.find(
        (i: any) => i.id === interview.interviewerAgentId
      );
    }
  }, [interviewers, interview.interviewerAgentId]);

  useEffect(() => {
    if (lastUserResponseRef.current) {
      const { current } = lastUserResponseRef;
      current.scrollTop = current.scrollHeight;
    }
  }, [lastUserResponse]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isCalling) {
      intervalId = setInterval(() => setTime((prev) => prev + 1), 10);
    }
    setCurrentTimeDuration(String(Math.floor(time / 100)));
    if (Number(currentTimeDuration) === Number(interviewTimeDuration) * 60) {
      webClient.stopCall();
      setIsEnded(true);
    }

    return () => clearInterval(intervalId);
  }, [isCalling, time, currentTimeDuration, interviewTimeDuration]);

  useEffect(() => {
    if (isEnded && callId && !analysisComplete) {
      const handleCallEnded = async () => {
        try {
          await aiMockInterviewAPI.updateResponseStatus(callId, {
            isEnded: true,
          });

          await new Promise((resolve) => setTimeout(resolve, 2000));

          setIsAnalyzing(true);
          try {
            await aiMockInterviewAPI.analyzeCall(callId);
            setAnalysisComplete(true);
            toast.success("Analysis completed!");
          } catch (error) {
            console.error("Error analyzing call:", error);
            toast.error("Analysis failed, but you can view results");
          } finally {
            setIsAnalyzing(false);
          }
        } catch (error) {
          console.error("Error handling call ended:", error);
          toast.error("Failed to process call results");
        }
      };

      handleCallEnded();
    }
  }, [isEnded, callId, analysisComplete]);

  useEffect(() => {
    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent");
    });

    webClient.on("agent_stop_talking", () => {
      setActiveTurn("user");
    });

    webClient.on("audio", (audio) => {
      setAudioData(audio);
    });

    webClient.on("error", (error: any) => {
      console.error("An error occurred:", error);
      webClient.stopCall();
      setIsEnded(true);
      setIsCalling(false);
      toast.error("An error occurred during the call");
    });

    webClient.on("update", (update: any) => {
      if (update.transcript) {
        const transcripts: transcriptType[] = update.transcript;
        const roleContents: { [key: string]: string } = {};

        transcripts.forEach((transcript) => {
          roleContents[transcript?.role] = transcript?.content;
        });

        setLastInterviewerResponse(roleContents["agent"] || "");
        setLastUserResponse(roleContents["user"] || "");
      }
    });

    return () => {
      webClient.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (interview.configuration?.duration) {
      setInterviewTimeDuration(String(interview.configuration.duration));
    }
  }, [interview]);

  const onEndCallClick = async () => {
    if (isStarted) {
      setLoading(true);
      webClient.stopCall();
      setIsEnded(true);
      setLoading(false);
    } else {
      setIsEnded(true);
    }
  };

  const startConversation = async () => {
    const data = {
      mins: String(interview.configuration?.duration || 10),
      objective: interview.customPrompt || "",
      questions: "",
      name: user?.firstName || user?.username || "Guest",
    };

    setLoading(true);

    try {
      const registerResponse = await aiMockInterviewAPI.registerCall({
        interviewerId: interview.interviewerAgentId!,
        sessionId: interview.id,
        email: user?.email || "",
        name: user?.firstName || user?.username || "Guest",
        dynamicData: data,
      });

      let callId: string;
      let accessToken: string;

      if (registerResponse.success && registerResponse.data) {
        callId = registerResponse.data.callId;
        accessToken = registerResponse.data.accessToken;
      } else if (registerResponse.callId && registerResponse.accessToken) {
        callId = registerResponse.callId;
        accessToken = registerResponse.accessToken;
      } else if ((registerResponse as any).data?.registerCallResponse) {
        const resp = (registerResponse as any).data.registerCallResponse;
        callId = resp.call_id || resp.callId;
        accessToken = resp.access_token || resp.accessToken;
      } else {
        throw new Error("Invalid response structure from register call");
      }

      if (!callId || !accessToken) {
        throw new Error("Missing callId or accessToken in response");
      }

      setCallId(callId);

      await webClient.startCall({
        accessToken: accessToken,
        callId: callId,
        emitRawAudioSamples: true,
      });

      setIsCalling(true);
      setIsStarted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnded && callId) {
      const updateInterview = async () => {
        await aiMockInterviewAPI.recordCallResult(callId, {
          isEnded: true,
        });
      };
      updateInterview();
    }
  }, [isEnded, callId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
<div className="min-h-screen bg-[#F8F9FB] animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/candidate/ai-mock-interview")}
                className="text-muted-foreground hover:text-foreground h-9"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  AI Mock Interview
                </h1>
                {!isEnded && interview.configuration?.duration && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <AlarmClockIcon className="w-4 h-4 text-primary" />
                    Expected: {interviewTimeDuration} minutes
                  </p>
                )}
              </div>
            </div>

            {isCalling && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-destructive">
                    {formatTime(Number(currentTimeDuration))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {!isEnded && (
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: isEnded
                    ? "100%"
                    : `${Math.min(
                        (Number(currentTimeDuration) /
                          (Number(interviewTimeDuration) * 60)) *
                          100,
                        100
                      )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!isStarted && !isEnded && (
          <Card className="border border-border rounded-3xl bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl font-bold text-foreground">
                Interview Preparation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {interview.jobDescription && (
                  <div className="p-4 bg-muted/50 border border-border rounded-2xl">
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">
                      Job Description
                    </h3>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <Markdown content={interview.jobDescription} />
                    </div>
                  </div>
                )}

                {(interview as any).questions &&
                  Array.isArray((interview as any).questions) &&
                  (interview as any).questions.length > 0 && (
                    <div className="p-4 bg-secondary/50 border border-border rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-xs font-bold uppercase text-muted-foreground">
                          Interview Questions
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {(interview as any).questions.map(
                          (question: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-sm text-foreground leading-relaxed flex-1">
                                  {question.question || question}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div className="p-4 bg-muted/50 border border-border rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Mic className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-muted-foreground">
                        Before You Start
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>
                          Ensure your volume is up and grant microphone access
                          when prompted
                        </li>
                        <li>Make sure you are in a quiet environment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={startConversation}
                    disabled={loading}
                    variant="default"
                    className="flex-1 h-10 rounded-xl font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Interview
                      </>
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={loading}
                        className="h-10 rounded-xl"
                      >
                        Exit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Exit Interview?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to exit? Your progress will not
                          be saved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onEndCallClick}
                          className="bg-destructive hover:bg-destructive/90 rounded-xl"
                        >
                          Exit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isStarted && !isEnded && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interviewer Side */}
            <Card className="border border-border rounded-3xl bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div
                    className={cn(
                      "w-44 h-44 rounded-3xl overflow-hidden flex items-center justify-center transition-all duration-300",
                      activeTurn === "agent"
                        ? "ring-4 ring-primary ring-offset-2 bg-primary/5"
                        : "bg-muted"
                    )}
                  >
                    <AvatarSpeaker
                      realtimeAudioData={audioData}
                      isPlaying={true}
                      isFemale={false}
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">
                        Interviewer
                      </h3>
                    </div>
                  </div>

                  <div className="w-full min-h-[200px] max-h-[300px] overflow-y-auto p-4 bg-muted/50 rounded-2xl border border-border">
                    <p className="text-foreground leading-relaxed">
                      {lastInterviewerResponse || (
                        <span className="text-muted-foreground italic">
                          Waiting for interviewer...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Side */}
            <Card className="hidden lg:block border border-border rounded-3xl bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div
                    className={cn(
                      "w-44 h-44 rounded-3xl overflow-hidden bg-muted flex items-center justify-center transition-all duration-300",
                      activeTurn === "user"
                        ? "ring-4 ring-primary ring-offset-2"
                        : ""
                    )}
                  >
                    {user && user.avatar ? (
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                          src={user.avatar ?? undefined}
                          className="object-cover"
                        />
                      </Avatar>
                    ) : (
                      <User className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Mic className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">You</h3>
                    </div>
                  </div>

                  <div
                    ref={lastUserResponseRef}
                    className="w-full min-h-[200px] max-h-[300px] overflow-y-auto p-4 bg-primary/5 rounded-2xl border border-primary/10 custom-scrollbar"
                  >
                    <p className="text-foreground leading-relaxed">
                      {lastUserResponse || (
                        <span className="text-muted-foreground italic">
                          Your responses will appear here...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isStarted && !isEnded && (
          <div className="mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 h-10 rounded-xl"
                  disabled={loading}
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  End Interview
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>End Interview?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The interview will be ended
                    immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onEndCallClick}
                    className="bg-destructive hover:bg-destructive/90 rounded-xl"
                  >
                    End Interview
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {isEnded && (
          <Card className="border border-border rounded-3xl bg-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-12 h-12 text-brand-success" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                    {isStarted ? "Interview Completed!" : "Thank You"}
                  </h2>
                  <p className="text-muted-foreground text-center">
                    {isStarted
                      ? "Thank you for taking the time to participate in this interview."
                      : "Thank you very much for considering."}
                  </p>
                </div>

                {isAnalyzing && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold uppercase text-primary tracking-tight">
                        Analyzing your interview...
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() =>
                      navigate(
                        `/candidate/ai-mock-interview/${interview.id}/results`
                      )
                    }
                    variant="default"
                    className="flex-1 h-10 rounded-xl font-semibold"
                  >
                    View Results
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/candidate/ai-mock-interview")}
                    className="flex-1 h-10 rounded-xl"
                  >
                    Back to Interviews
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
