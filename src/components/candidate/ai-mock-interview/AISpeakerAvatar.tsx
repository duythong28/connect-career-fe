import { useState, useRef, useEffect } from "react";
import { drawProfessionalAvatar } from "@/lib/avatarRenderer";

export const AvatarSpeaker = ({
  isPlaying,
  realtimeAudioData,
  isFemale = false,
  avatarImageUrl = "/final-interviewer.png",
  className = "",
}: {
  audioSrc?: string;
  isPlaying: boolean;
  realtimeAudioData?: Float32Array;
  isFemale?: boolean;
  avatarImageUrl?: string;
  className?: string;
}) => {
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const canvasRef = useRef(null);
  const blinkIntervalRef = useRef(null);

  const isRealtimeMode = !!realtimeAudioData;

  // Render avatar when state changes
  useEffect(() => {
    if (canvasRef.current) {
      drawProfessionalAvatar(canvasRef.current, {
        isFemale,
        isSpeaking: isPlaying,
        mouthOpenness,
        isBlinking,
      });
    }
  }, [mouthOpenness, isPlaying, isFemale, isBlinking]);

  // Blinking animation
  useEffect(() => {
    const scheduleNextBlink = () => {
      const nextBlinkDelay = 2000;
      blinkIntervalRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, nextBlinkDelay);
    };

    scheduleNextBlink();

    return () => {
      if (blinkIntervalRef.current) {
        clearTimeout(blinkIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRealtimeMode || !realtimeAudioData) return;

    // Process Float32Array để tính mouth openness
    const processAudioData = (audioData) => {
      let sum = 0;
      for (let i = 0; i < audioData.length; i++) {
        sum += audioData[i] * audioData[i];
      }
      const rms = Math.sqrt(sum / audioData.length);
      let normalizedValue = rms * 10;
      normalizedValue = Math.max(0, Math.min(1, normalizedValue));

      // Apply smoothing
      const smoothedValue = Math.pow(normalizedValue, 0.6);

      setMouthOpenness(smoothedValue);
    };

    processAudioData(realtimeAudioData);
  }, [realtimeAudioData, isRealtimeMode]);

  return (
    <div className={className}>
      <div className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
        <img
          src={avatarImageUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
};
