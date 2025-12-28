import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  disabled, 
  className 
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const resetSilenceTimer = () => {
    clearTimer();
    silenceTimerRef.current = setTimeout(() => {
      stopRecording();
    }, 5000); // Tự tắt sau 5s im lặng
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false); // Tắt hiệu ứng ngay lập tức
    clearTimer();
  };

  const startRecording = () => {
    try {
      recognitionRef.current?.start();
      setIsListening(true);
      resetSilenceTimer();
    } catch (error) {
      console.error("Speech Recognition Error:", error);
    }
  };

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Ngôn ngữ Tiếng Anh

      recognition.onresult = (event: any) => {
        resetSilenceTimer(); // Reset timer khi có tiếng động
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onTranscript(transcript);
      };

      recognition.onend = () => {
        setIsListening(false); // Đảm bảo hiệu ứng tắt khi tự động dừng
        clearTimer();
      };

      recognition.onerror = () => {
        setIsListening(false);
        clearTimer();
      };
      
      recognitionRef.current = recognition;
    }
    return () => clearTimer();
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      stopRecording(); // Nhấn là dừng, mất hiệu ứng ngay
    } else {
      startRecording();
    }
  };

  if (!recognitionRef.current && typeof window !== 'undefined') return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={cn(
        "p-2.5 rounded-xl transition-all duration-200 flex-shrink-0",
        isListening 
          ? "bg-red-500 text-white animate-pulse shadow-md" 
          : "text-gray-400 hover:bg-gray-200 hover:text-gray-600",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      { <Mic className="w-5 h-5" />}
    </button>
  );
};