import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Check,
} from "lucide-react";
import { ExtractedCvData } from "@/api/types/cv.types";
import { normalizePhone } from "@/lib/helpers";

interface ExtractedData {
  personalInfo?: {
    phone?: string;
    address?: string;
    github?: string | null;
    linkedin?: string | null;
  };
  workExperience?: Array<{
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    responsibilities?: Array<string>
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: string[];
  completedSections?: string[];
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface GeminiResponse {
  extracted_data: ExtractedData;
  current_section: "personalInfo" | "workExperience" | "education" | "skills";
  next_question: string;
  is_finished: boolean;
}

interface VoiceProfileWizardProps {
  onComplete: (data: ExtractedCvData) => void;
  onCancel: () => void;
}

const VoiceProfileWizard: React.FC<VoiceProfileWizardProps> = ({ onComplete, onCancel }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [profileData, setProfileData] = useState<ExtractedData>({});
  const [currentSection, setCurrentSection] = useState<string>("personalInfo");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingForUser, setWaitingForUser] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const profileDataRef = useRef<ExtractedData>({});

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    profileDataRef.current = profileData;
  }, [profileData]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== "aborted" && event.error !== "no-speech") {
          setError(`Voice error: ${event.error}`);
          setIsListening(false);
          setWaitingForUser(true);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;
    startConversation();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch (e) {}
      }
    };
  }, []);

  const startConversation = async () => {
    const initialQuestion =
      "Hello! I'm your AI assistant. Let's build your profile. Please tell me your phone number, address.";
    setCurrentQuestion(initialQuestion);
    speakText(initialQuestion);

    const msg: ConversationMessage = {
      role: "assistant",
      content: initialQuestion,
      timestamp: Date.now(),
    };
    setConversation([msg]);
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.volume = 1.0;
    utterance.rate = 1.0;
    utterance.pitch = 1.0; 

    utterance.onstart = () => {
      setIsSpeaking(true);
      setWaitingForUser(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => {
        if (!isComplete) {
          startListening();
        }
      }, 500);
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;

    setError(null);
    setIsListening(true);
    setWaitingForUser(false);

    try {
      recognitionRef.current.start();
    } catch (e) {
      if (e.name !== "InvalidStateError") {
        console.error("Failed to start:", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (e) {}
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  const handleUserResponse = async (userText: string) => {
    stopListening();

    const userMsg: ConversationMessage = {
      role: "user",
      content: userText,
      timestamp: Date.now(),
    };

    setConversation((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `### ROLE
You are a CV Assistant. Your goal is to conduct a detailed interview to extract high-quality professional data for a CV. You work step-by-step, ensuring every section is addressed, but you allow users to bypass sections that are not applicable to them.

### EXTRACTION PIPELINE (STRICT ORDER)
1. personalInfo → 2. workExperience → 3. education → 4. skills → 5. reviewPhase

### OPERATIONAL LOGIC
1.  **Strict Sequencing:** Only focus on the current_section. Do not move to the next section until the current one is added to completedSections.
2.  **Skip/Bypass Clause:** If a user indicates they do not have information for a section (e.g., "I don't have any work experience," "None," "Skip this"), add that section to completedSections as an empty state and move to the next section.
3.  **Detail Extraction (Deep Dive):** - For workExperience, ask: "What were your key achievements or responsibilities there?"
    - For education, ask for institution, degree, and field of study in one go.
4.  **The Loop:** For Work and Education, after each entry, ask: "Do you have another [Job/Degree] to add?" Move to the next section ONLY when the user says "no" or "that's all".
5.  **Date Standard:** Convert all dates to YYYY-MM-DD. ("Present": current = true, endDate = "").
6.  **Review Phase & Completion (CRITICAL UPDATE):** - Once skills are done, set current_section to "reviewPhase".
    - Action: Present a summary of all collected data.
    - **Exit Condition:** If the user says "everything is perfect," "yes," "no changes," or "looks good," set is_finished to true, set next_question to an empty string, and provide a final closing message.
    - **Modification Condition:** If the user wants to modify a section, set current_section back to that section and remove it from completedSections.

### OUTPUT SCHEMA
{
  "extracted_data": {
    "personalInfo": { "phone": string|null, "address": string|null },
    "workExperience": [{ "company": string, "position": string, "startDate": string, "endDate": string, "current": boolean, "responsibilities": string[] }] | [],
    "education": [{ "institution": string, "degree": string, "fieldOfStudy": string, "startDate": string, "endDate": string }] | [],
    "skills": string[]
  },
  "completedSections": ["personalInfo", "workExperience", "education", "skills", "reviewPhase"],
  "current_section": "personalInfo" | "workExperience" | "education" | "skills" | "reviewPhase",
  "next_question": "string",
  "is_finished": boolean
}`,
              },
              {
                role: "user",
                content: `CURRENT DATA:
${JSON.stringify(profileDataRef.current, null, 2)}

USER: "${userText}"

Extract info and return JSON.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 8192,
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();
      
      // Add debugging
      console.log("🔵 Raw API Response:", data);
      console.log("🔵 Message Content:", data.choices?.[0]?.message?.content);
      
      const geminiResponse: GeminiResponse = JSON.parse(data.choices[0].message.content);
      
      // Add debugging
      console.log("🟢 Parsed Gemini Response:", geminiResponse);
      console.log("🟢 Extracted Data:", geminiResponse.extracted_data);

      // Merge data
      const currentData = profileDataRef.current;
      const newData = geminiResponse.extracted_data;

      // Check duplicates
      const workExists = (job: any) =>
        (currentData.workExperience || []).some(
          (e) =>
            e.company?.toLowerCase() === job.company?.toLowerCase() &&
            e.position?.toLowerCase() === job.position?.toLowerCase()
        );

      const eduExists = (edu: any) =>
        (currentData.education || []).some(
          (e) =>
            e.institution?.toLowerCase() === edu.institution?.toLowerCase() &&
            e.degree?.toLowerCase() === edu.degree?.toLowerCase()
        );

      const validWork = (newData.workExperience || []).filter(
        (j) => j.company?.trim() && j.position?.trim() && !workExists(j)
      );

      const validEdu = (newData.education || []).filter(
        (e) =>
          e.institution?.trim() &&
          e.degree?.trim() &&
          e.fieldOfStudy?.trim() &&
          !eduExists(e)
      );

      // Fix: Better merge logic that preserves existing data when new data is empty/null
      const updatedData: ExtractedData = {
        personalInfo: {
          phone:
            newData.personalInfo?.phone && newData.personalInfo.phone.trim()
              ? normalizePhone(newData.personalInfo.phone.trim())
              : currentData.personalInfo?.phone || null,
          address:
            newData.personalInfo?.address && newData.personalInfo.address.trim()
              ? newData.personalInfo.address.trim()
              : currentData.personalInfo?.address || null,
          github:
            newData.personalInfo?.github && newData.personalInfo.github.trim()
              ? newData.personalInfo.github.trim()
              : currentData.personalInfo?.github || null,
          linkedin:
            newData.personalInfo?.linkedin && newData.personalInfo.linkedin.trim()
              ? newData.personalInfo.linkedin.trim()
              : currentData.personalInfo?.linkedin || null,
        },
        workExperience: [...(currentData.workExperience || []), ...validWork],
        education: [...(currentData.education || []), ...validEdu],
        skills: [
          ...new Set([
            ...(currentData.skills || []),
            ...(newData.skills || []),
          ]),
        ],
        completedSections:
          newData.completedSections || currentData.completedSections || [],
      };

      console.log("✅ Updated:", updatedData);
      console.log("📍 Section:", geminiResponse.current_section);
      console.log("✔️ Completed:", updatedData.completedSections);
      console.log("📊 Current Profile Data State:", profileData); // Add this

      setProfileData(updatedData);
      setCurrentSection(geminiResponse.current_section);

      const aiMsg: ConversationMessage = {
        role: "assistant",
        content: geminiResponse.next_question,
        timestamp: Date.now(),
      };

      setConversation((prev) => [...prev, aiMsg]);
      setCurrentQuestion(geminiResponse.next_question);
      speakText(geminiResponse.next_question);

      if (geminiResponse.is_finished) {
        setIsComplete(true);
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Processing error. Please try again.");
      const fallback = "Sorry, I didn't catch that. Could you repeat?";
      setCurrentQuestion(fallback);
      speakText(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    const cvData: ExtractedCvData = {
      personalInfo: {
        phone: profileData.personalInfo?.phone || "",
        address: profileData.personalInfo?.address || "",
        github: profileData.personalInfo?.github || null,
        linkedin: profileData.personalInfo?.linkedin || null,
      },
      workExperience: (profileData.workExperience || []).map((exp) => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: exp.current || false,
        responsibilities: exp.responsibilities || [],
      })),
      education: (profileData.education || []).map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: "",
      })),
      skills: profileData.skills || [],
      projects: [],
      awards: [],
    };
    onComplete(cvData);
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case "personalInfo":
        return "Personal Info";
      case "workExperience":
        return "Work Experience";
      case "education":
        return "Education";
      case "skills":
        return "Skills";
      default:
        return section;
    }
  };

  return (
<div className="w-full flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6">
      
      {/* LEFT CARD (Bottom on Mobile): Set height trực tiếp ở đây */}
      <div className="bg-card border border-border rounded-3xl p-6 flex flex-col h-[500px] lg:h-[80vh] animate-fade-in shadow-sm">
        
        {/* Fixed Header */}
        <div className="shrink-0 flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">Profile Preview</h3>
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wide">
            {getSectionLabel(currentSection)}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Personal Info */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-primary" />
              <h4 className="text-xs font-bold uppercase text-muted-foreground">Personal Info</h4>
            </div>
            <div className="space-y-4 pl-7">
              {profileData.personalInfo?.phone && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-0.5">Phone</div>
                    <div className="text-sm font-semibold text-foreground">
                      {profileData.personalInfo.phone}
                    </div>
                  </div>
                </div>
              )}
              {profileData.personalInfo?.address && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-0.5">Address</div>
                    <div className="text-sm font-semibold text-foreground">
                      {profileData.personalInfo.address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          {profileData.workExperience && profileData.workExperience.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={18} className="text-primary" />
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Work Experience</h4>
              </div>
              <div className="space-y-4 pl-7">
                {profileData.workExperience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative border-l-2 border-border pl-4 pb-1">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="text-sm font-bold text-foreground">{exp.position}</div>
                    <div className="text-xs text-primary font-bold mb-1">
                      {exp.company}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                    <div className="mt-2 text-sm text-foreground">
                      {
                        exp.responsibilities.join(" ")
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profileData.education && profileData.education.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={18} className="text-primary" />
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Education</h4>
              </div>
              <div className="space-y-4 pl-7">
                {profileData.education.map((edu: any, idx: number) => (
                  <div key={idx} className="relative border-l-2 border-border pl-4 pb-1">
                     <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="text-sm font-bold text-foreground">{edu.institution}</div>
                    <div className="text-xs text-muted-foreground">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profileData.skills && profileData.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-primary" />
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2 pl-7">
                {profileData.skills.map((skill: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-accent text-foreground border border-border px-3 py-1.5 rounded-xl text-xs font-semibold"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CARD (Top on Mobile): Set height trực tiếp ở đây */}
      <div className="bg-card border border-border rounded-3xl p-6 flex flex-col h-[600px] lg:h-[80vh] animate-fade-in shadow-sm">
        
        {/* Fixed Header */}
        <div className="shrink-0 mb-4 pb-4 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">Voice Interview</h3>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium">Processing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {error && (
          <div className="shrink-0 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="text-destructive" />
            <span className="text-xs font-bold text-destructive">{error}</span>
          </div>
        )}

        {/* Fixed Controls */}
        <div className="shrink-0 mt-auto">
          {!isComplete ? (
            <>
              {/* Status Bar */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-secondary/50 border border-border rounded-2xl">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing || isSpeaking}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? "bg-destructive text-white shadow-lg scale-105"
                      : waitingForUser
                      ? "bg-primary text-primary-foreground shadow-blue animate-pulse"
                      : "bg-muted text-muted-foreground"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <Mic size={20} className={isListening ? "animate-pulse" : ""} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase text-primary mb-1">
                    {isListening
                      ? "Listening..."
                      : isSpeaking
                      ? "AI Speaking..."
                      : waitingForUser
                      ? "Tap to speak"
                      : "Processing..."}
                  </div>
                  <div className="text-sm font-medium text-foreground line-clamp-1 truncate">
                    {currentQuestion}
                  </div>
                </div>

                {isSpeaking && (
                  <Volume2 size={20} className="text-primary animate-pulse shrink-0" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onCancel}
                  className="h-9 px-4 rounded-xl border border-border bg-transparent hover:bg-muted text-sm font-bold text-muted-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsComplete(true)} 
                  className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-blue-600 text-sm font-bold shadow-sm transition-all hover:shadow-md"
                >
                  Stop & Review
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <div className="flex flex-col items-center justify-center gap-2 text-primary">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                   <CheckCircle2 size={24} />
                </div>
                <span className="text-lg font-bold text-foreground">Complete!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your profile has been collected.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onCancel}
                  className="h-9 rounded-xl border border-border bg-transparent hover:bg-muted text-xs font-bold text-foreground transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={handleFinish}
                  className="h-9 rounded-xl bg-primary text-primary-foreground hover:bg-blue-600 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  Continue <Check size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceProfileWizard;