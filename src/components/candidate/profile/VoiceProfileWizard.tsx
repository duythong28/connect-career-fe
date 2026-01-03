import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, ArrowRight, Volume2, CheckCircle2, User, Briefcase, GraduationCap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ExtractedData {
  phone?: string;
  address?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  skills?: string[];
  workExperiences?: Array<{
    jobTitle: string;
    organizationName: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }>;
  educations?: Array<{
    institutionName: string;
    degreeType: string;
    fieldOfStudy: string;
    startDate?: string;
    graduationDate?: string;
  }>;
}

interface GeminiResponse {
  extracted_data: ExtractedData;
  next_question: string;
  is_finished: boolean;
}

const VoiceProfileWizard = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [profileData, setProfileData] = useState<ExtractedData>({});
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const navigate = useNavigate();

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(`Voice recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    // Start conversation
    startConversation();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startConversation = async () => {
    const initialQuestion = "Chào bạn! Mình là trợ lý AI của CareerHub. Hãy bắt đầu bằng cách cho mình biết về công việc gần đây nhất của bạn nhé? Bạn đang làm vị trí gì và ở công ty nào?";
    setCurrentQuestion(initialQuestion);
    speakText(initialQuestion);
    
    const msg: ConversationMessage = {
      role: 'assistant',
      content: initialQuestion,
      timestamp: Date.now()
    };
    setConversation([msg]);
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    setError(null);
    setIsListening(true);
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      setError('Failed to start voice recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleUserResponse = async (userText: string) => {
    setIsListening(false);
    
    const userMsg: ConversationMessage = {
      role: 'user',
      content: userText,
      timestamp: Date.now()
    };
    
    setConversation(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setError(null);

    try {
      // Call Gemini API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Bạn là trợ lý tuyển dụng chuyên nghiệp. Nhiệm vụ của bạn là phỏng vấn ứng viên để thu thập thông tin và điền vào hồ sơ JSON.

Hồ sơ hiện tại: ${JSON.stringify(profileData, null, 2)}

Câu trả lời mới nhất của ứng viên: "${userText}"

Hãy trả về CHỈ một JSON object với format sau (KHÔNG thêm markdown, KHÔNG thêm giải thích):
{
  "extracted_data": {
    "phone": "string hoặc null",
    "address": "string hoặc null",
    "socialLinks": {
      "linkedin": "string hoặc null",
      "github": "string hoặc null",
      "portfolio": "string hoặc null"
    },
    "skills": ["array of strings"],
    "workExperiences": [{
      "jobTitle": "string",
      "organizationName": "string",
      "startDate": "YYYY-MM-DD hoặc null",
      "endDate": "YYYY-MM-DD hoặc null",
      "isCurrent": true/false,
      "description": "string hoặc null"
    }],
    "educations": [{
      "institutionName": "string",
      "degreeType": "bachelor|master|doctorate|...",
      "fieldOfStudy": "string",
      "startDate": "YYYY-MM-DD hoặc null",
      "graduationDate": "YYYY-MM-DD hoặc null"
    }]
  },
  "next_question": "Câu hỏi tiếp theo (ngắn gọn, thân thiện)",
  "is_finished": false
}

Ưu tiên hỏi về: Work Experience, Skills, Education.
Nếu user trả lời chung chung, hãy hỏi sâu thêm.
Nếu đã đủ thông tin cơ bản (ít nhất 1 work experience, một vài skills, 1 education), set is_finished = true.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiText = data.content
        .map((item: any) => item.type === 'text' ? item.text : '')
        .join('\n')
        .trim();

      // Parse JSON response
      const cleanText = aiText.replace(/```json|```/g, '').trim();
      const geminiResponse: GeminiResponse = JSON.parse(cleanText);

      // Update profile data
      const updatedData = {
        ...profileData,
        ...geminiResponse.extracted_data,
        skills: geminiResponse.extracted_data.skills?.length 
          ? geminiResponse.extracted_data.skills 
          : profileData.skills,
        workExperiences: geminiResponse.extracted_data.workExperiences?.length
          ? geminiResponse.extracted_data.workExperiences
          : profileData.workExperiences,
        educations: geminiResponse.extracted_data.educations?.length
          ? geminiResponse.extracted_data.educations
          : profileData.educations
      };
      
      setProfileData(updatedData);

      // Add AI response to conversation
      const aiMsg: ConversationMessage = {
        role: 'assistant',
        content: geminiResponse.next_question,
        timestamp: Date.now()
      };
      
      setConversation(prev => [...prev, aiMsg]);
      setCurrentQuestion(geminiResponse.next_question);

      // Speak the next question
      speakText(geminiResponse.next_question);

      // Check if finished
      if (geminiResponse.is_finished) {
        setIsComplete(true);
      }

    } catch (err: any) {
      console.error('Error processing response:', err);
      setError('Đã xảy ra lỗi khi xử lý. Vui lòng thử lại.');
      
      // Fallback question
      const fallbackQuestion = "Xin lỗi, mình không nghe rõ. Bạn có thể nói lại được không?";
      setCurrentQuestion(fallbackQuestion);
      speakText(fallbackQuestion);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    // Pass data to parent component or navigate to wizard
    console.log('Final Profile Data:', profileData);
     navigate('/candidate/wizard', {
    state: { initialData: profileData }
  });
    alert('Profile data collected! In production, this would navigate to the wizard with pre-filled data.');
  };

  const getCompletionStats = () => {
    let total = 0;
    let filled = 0;

    if (profileData.phone) filled++;
    total++;
    
    if (profileData.address) filled++;
    total++;
    
    if (profileData.skills?.length) filled++;
    total++;
    
    if (profileData.workExperiences?.length) filled++;
    total++;
    
    if (profileData.educations?.length) filled++;
    total++;

    return { filled, total, percentage: Math.round((filled / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Voice-Powered Profile Creation
          </h1>
          <p className="text-muted-foreground text-sm">
            Speak naturally and our AI will build your profile
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-card border border-border rounded-3xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Profile Completion
            </span>
            <span className="text-lg font-bold text-primary">
              {stats.percentage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[
              { icon: User, label: 'Contact', filled: !!profileData.phone || !!profileData.address },
              { icon: User, label: 'Social', filled: !!(profileData.socialLinks?.linkedin || profileData.socialLinks?.github) },
              { icon: CheckCircle2, label: 'Skills', filled: !!profileData.skills?.length },
              { icon: Briefcase, label: 'Work', filled: !!profileData.workExperiences?.length },
              { icon: GraduationCap, label: 'Education', filled: !!profileData.educations?.length }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  item.filled 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <item.icon size={14} />
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Conversation Card */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden animate-fade-in">
          {/* Conversation History */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="border-t border-border p-6 bg-card">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            {!isComplete ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing || isSpeaking}
                  className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-destructive text-destructive-foreground animate-pulse'
                      : 'bg-primary text-primary-foreground hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground mb-1">
                    {isListening ? 'Listening...' : isSpeaking ? 'AI Speaking...' : 'Tap to speak'}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {currentQuestion}
                  </div>
                </div>

                {isSpeaking && (
                  <Volume2 size={20} className="text-primary animate-pulse" />
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <CheckCircle2 size={24} />
                  <span className="text-lg font-bold">Profile Complete!</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Great job! We've collected enough information to create your profile.
                </p>
                <button
                  onClick={handleFinish}
                  className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-primary-foreground font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Continue to Profile Setup
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!isComplete && (
          <div className="mt-6 flex justify-center gap-4 animate-fade-in">
            <button
              onClick={() => setIsComplete(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Skip to manual entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceProfileWizard;