import {
  ArrowUpRightSquareIcon,
  AlarmClockIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isLightColor, testEmail } from "@/lib/utils";
import { AIMockInterviewConfiguration, SubmitFeedbackRequest } from "@/api/types/ai-mock-interview.types";
import { RetellWebClient } from "retell-client-js-sdk";
import { FeedbackForm } from "./FeedbackForm";
import { TabSwitchWarning, useTabSwitchPrevention } from "./useTabSwitchPrevention";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";

type CallProps = {
  interview: AIMockInterviewConfiguration;
};

type transcriptType = {
  role: string;
  content: string;
};

// Create a single instance of RetellWebClient
const webClient = new RetellWebClient();

export default function Call({ interview }: CallProps) {
  const navigate = useNavigate();
  const [lastInterviewerResponse, setLastInterviewerResponse] = useState<string>("");
  const [lastUserResponse, setLastUserResponse] = useState<string>("");
  const [activeTurn, setActiveTurn] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>("");
  const { tabSwitchCount } = useTabSwitchPrevention();
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interviewerImg, setInterviewerImg] = useState("");
  const [interviewTimeDuration, setInterviewTimeDuration] = useState<string>("1");
  const [time, setTime] = useState(0);
  const [currentTimeDuration, setCurrentTimeDuration] = useState<string>("0");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const lastUserResponseRef = useRef<HTMLDivElement | null>(null);

  // Fetch interviewer image
  const { data: interviewers } = useQuery({
    queryKey: ["interviewers"],
    queryFn: async () => {
      const response = await fetch("/candidates/mock-ai-interview/interviewers");
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!interview.interviewerAgentId,
  });

  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started");
      setIsCalling(true);
    });

    webClient.on("call_ended", () => {
      console.log("Call ended");
      setIsCalling(false);
      setIsEnded(true);
    });

    if (interviewers && interview.interviewerAgentId) {
      const interviewer = interviewers.find(
        (i: any) => i.id === interview.interviewerAgentId
      );
      if (interviewer?.image) {
        setInterviewerImg(interviewer.image);
      }
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
    if (testEmail(email)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (isEnded && callId && !analysisComplete) {
      const handleCallEnded = async () => {
        try {
          // 1. Update response status (mark as ended)
          await aiMockInterviewAPI.updateResponseStatus(callId, {
            isEnded: true,
          });

          // 2. Wait a moment for backend to process
          await new Promise(resolve => setTimeout(resolve, 2000));

          // 3. Trigger analysis
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

  // Setup Retell event listeners
  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started");
      setIsCalling(true);
    });

    webClient.on("call_ended", () => {
      console.log("Call ended");
      setIsCalling(false);
      setIsEnded(true);
    });

    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent");
    });

    webClient.on("agent_stop_talking", () => {
      setActiveTurn("user");
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
      // Clean up event listeners
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
      questions: "", // TODO: Get questions from interview if available
      name: name || "not provided",
    };
  
    setLoading(true);
  
    try {
      // Register call to get callId and accessToken from backend
      const registerResponse = await aiMockInterviewAPI.registerCall({
        interviewerId: interview.interviewerAgentId!,
        sessionId: interview.id,
        email: email,
        name: name,
        dynamicData: data,
      });

      console.log("Register call response:", registerResponse);

      // Handle different response structures
      let callId: string;
      let accessToken: string;
      let responseId: string;

      // Check if response has success property (wrapped response)
      if (registerResponse.success && registerResponse.data) {
        callId = registerResponse.data.callId;
        accessToken = registerResponse.data.accessToken;
        responseId = registerResponse.data.responseId;
      } 
      // Check if response is the data object directly
      else if (registerResponse.callId && registerResponse.accessToken) {
        callId = registerResponse.callId;
        accessToken = registerResponse.accessToken;
        responseId = registerResponse.responseId || "";
      } 
      // Check nested structure (like reference code)
      else if ((registerResponse as any).data?.registerCallResponse) {
        const resp = (registerResponse as any).data.registerCallResponse;
        callId = resp.call_id || resp.callId;
        accessToken = resp.access_token || resp.accessToken;
        responseId = resp.response_id || resp.responseId || "";
      }
      else {
        throw new Error("Invalid response structure from register call");
      }

      if (!callId || !accessToken) {
        throw new Error("Missing callId or accessToken in response");
      }
      
      setCallId(callId);

      console.log("Starting call with:", { callId, accessToken: accessToken.substring(0, 20) + "..." });

      // Start the call using Retell Web Client with both accessToken and callId
      await webClient.startCall({
        accessToken: accessToken,
        callId: callId,
      }).catch((error) => {
        console.error("Error starting call:", error);
        throw error;
      });

      setIsCalling(true);
      setIsStarted(true);
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast.error(error.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

      
  useEffect(() => {
    if (isEnded && callId) {
      const updateInterview = async () => {
        await aiMockInterviewAPI.updateResponse(callId, {
          isEnded: true,
        });
      };
      updateInterview();
    }
  }, [isEnded, callId]);

  const handleFeedbackSubmit = async (
    formData: Omit<SubmitFeedbackRequest, "sessionId">
  ) => {
    try {
      const result = await aiMockInterviewAPI.submitFeedback({
        ...formData,
        sessionId: interview.id,
      });

      if (result) {
        toast.success("Thank you for your feedback!");
        setIsFeedbackSubmitted(true);
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isStarted && <TabSwitchWarning />}
      <div className="bg-white rounded-md md:w-[80%] w-[90%]">
        <Card className="h-[88vh] rounded-lg border-2 border-b-4 border-r-4 border-black text-xl font-bold transition-all md:block dark:border-white">
          <div>
            <div className="m-4 h-[15px] rounded-lg border-[1px] border-black">
              <div
                className="bg-indigo-600 h-[15px] rounded-lg transition-all"
                style={{
                  width: isEnded
                    ? "100%"
                    : `${
                        (Number(currentTimeDuration) /
                          (Number(interviewTimeDuration) * 60)) *
                        100
                      }%`,
                }}
              />
            </div>
            <CardHeader className="items-center p-1">
              {!isEnded && (
                <CardTitle className="flex flex-row items-center text-lg md:text-xl font-bold mb-2">
                  AI Mock Interview
                </CardTitle>
              )}
              {!isEnded && interview.configuration?.duration && (
                <div className="flex mt-2 flex-row">
                  <AlarmClockIcon className="text-indigo-600 h-[1rem] w-[1rem] mr-2 font-bold" />
                  <div className="text-sm font-normal">
                    Expected duration:{" "}
                    <span className="font-bold text-indigo-600">
                      {interviewTimeDuration} mins
                    </span>{" "}
                    or less
                  </div>
                </div>
              )}
            </CardHeader>

            {!isStarted && !isEnded && (
              <div className="w-fit min-w-[400px] max-w-[400px] mx-auto mt-2 border border-indigo-200 rounded-md p-2 m-2 bg-slate-50">
                <div>
                  <div className="p-2 font-normal text-sm mb-4 whitespace-pre-line">
                    {interview.jobDescription && (
                      <div className="mb-4">
                        <p className="font-semibold mb-2">Job Description:</p>
                        <p>{interview.jobDescription}</p>
                      </div>
                    )}
                    <p className="font-bold text-sm">
                      Ensure your volume is up and grant microphone access when
                      prompted. Additionally, please make sure you are in a quiet
                      environment.
                      {"\n\n"}Note: Tab switching will be recorded.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="flex justify-center">
                      <input
                        value={email}
                        className="h-fit mx-auto py-2 border-2 rounded-md w-[75%] self-center px-2 border-gray-400 text-sm font-normal"
                        placeholder="Enter your email address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        value={name}
                        className="h-fit mb-4 mx-auto py-2 border-2 rounded-md w-[75%] self-center px-2 border-gray-400 text-sm font-normal"
                        placeholder="Enter your first name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[80%] flex flex-row mx-auto justify-center items-center align-middle">
                  <Button
                    className="min-w-20 h-10 rounded-lg flex flex-row justify-center mb-8 bg-indigo-600 text-white"
                    disabled={loading || !isValidEmail || !name}
                    onClick={startConversation}
                  >
                    {!loading ? "Start Interview" : "Starting..."}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-white border ml-2 text-black min-w-15 h-10 rounded-lg flex flex-row justify-center mb-8"
                        style={{ borderColor: "#4F46E5" }}
                        disabled={loading}
                      >
                        Exit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-indigo-600 hover:bg-indigo-800"
                          onClick={onEndCallClick}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}

            {isStarted && !isEnded && (
              <div className="flex flex-row p-2 grow">
                <div className="border-x-2 border-grey w-[50%] my-auto min-h-[70%]">
                  <div className="flex flex-col justify-evenly">
                    <div className="text-[22px] w-[80%] md:text-[26px] mt-4 min-h-[250px] mx-auto px-6">
                      {lastInterviewerResponse || (
                        <p className="text-muted-foreground">Waiting for interviewer...</p>
                      )}
                    </div>
                    <div className="flex flex-col mx-auto justify-center items-center align-middle">
                      {interviewerImg ? (
                        <img
                          src={interviewerImg}
                          alt="Image of the interviewer"
                          className={`w-[120px] h-[120px] object-cover object-center mx-auto my-auto rounded-full ${
                            activeTurn === "agent"
                              ? "border-4 border-indigo-600"
                              : ""
                          }`}
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] bg-indigo-100 rounded-full flex items-center justify-center">
                          <Skeleton className="w-full h-full rounded-full" />
                        </div>
                      )}
                      <div className="font-semibold">Interviewer</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-evenly w-[50%]">
                  <div
                    ref={lastUserResponseRef}
                    className="text-[22px] w-[80%] md:text-[26px] mt-4 mx-auto h-[250px] px-6 overflow-y-auto"
                  >
                    {lastUserResponse || (
                      <p className="text-muted-foreground">Your responses will appear here...</p>
                    )}
                  </div>
                  <div className="flex flex-col mx-auto justify-center items-center align-middle">
                    <div
                      className={`w-[120px] h-[120px] bg-gray-200 rounded-full flex items-center justify-center ${
                        activeTurn === "user" ? "border-4 border-indigo-600" : ""
                      }`}
                    >
                      <span className="text-4xl">👤</span>
                    </div>
                    <div className="font-semibold">You</div>
                  </div>
                </div>
              </div>
            )}

            {isStarted && !isEnded && (
              <div className="items-center p-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="bg-white text-black border border-indigo-600 h-10 mx-auto flex flex-row justify-center mb-8 w-full"
                      disabled={loading}
                    >
                      End Interview{" "}
                      <XCircleIcon className="h-[1.5rem] ml-2 w-[1.5rem] text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This action will end the call.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-indigo-600 hover:bg-indigo-800"
                        onClick={onEndCallClick}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {isEnded && (
              <div className="w-fit min-w-[400px] max-w-[400px] mx-auto mt-2 border border-indigo-200 rounded-md p-2 m-2 bg-slate-50 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div>
                  <div className="p-2 font-normal text-base mb-4 whitespace-pre-line">
                    <CheckCircleIcon className="h-[2rem] w-[2rem] mx-auto my-4 text-indigo-500" />
                    <p className="text-lg font-semibold text-center">
                      {isStarted
                        ? `Thank you for taking the time to participate in this interview`
                        : "Thank you very much for considering."}
                    </p>
                    <p className="text-center">
                      {"\n"}
                      You can close this tab now.
                    </p>
                  </div>

                  {!isFeedbackSubmitted && (
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <div className="w-full flex justify-center">
                          <Button
                            className="bg-indigo-600 text-white h-10 mt-4 mb-4"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            Provide Feedback
                          </Button>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <FeedbackForm
                          email={email}
                          onSubmit={handleFeedbackSubmit}
                        />
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
        <a
          className="flex flex-row justify-center align-middle mt-3"
          href="https://folo-up.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-center text-md font-semibold mr-2">
            Powered by{" "}
            <span className="font-bold">
              Folo<span className="text-indigo-600">Up</span>
            </span>
          </div>
          <ArrowUpRightSquareIcon className="h-[1.5rem] w-[1.5rem] text-indigo-500" />
        </a>
      </div>
    </div>
  );
}