import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  User,
  Monitor,
  MonitorOff,
  Settings,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Camera,
  MoreVertical,
} from "lucide-react";
import {
  StreamCall,
  CallControls,
  ParticipantView,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: "video" | "voice";
  recipientName: string;
  recipientAvatar?: string;
  onAnswer?: () => void;
  onDecline?: () => void;
  isIncoming?: boolean;
  streamCall?: Call;
}

const CallContent: React.FC<{
  callType: "video" | "voice";
  recipientName: string;
  recipientAvatar?: string;
  onAnswer?: () => void;
  onDecline?: () => void;
  isIncoming?: boolean;
  onClose: () => void;
}> = ({
  callType,
  recipientName,
  recipientAvatar,
  onAnswer,
  onDecline,
  isIncoming,
  onClose,
}) => {
  const {
    useCallCallingState,
    useParticipants,
    useCallStartsAt,
    useLocalParticipant,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const callStartsAt = useCallStartsAt();
  const localParticipant = useLocalParticipant();

  // Local state for controls
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const isConnected = callingState === "joined";
  const isRinging = callingState === "ringing" || callingState === "idle";

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && callStartsAt) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(callStartsAt);
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
        setCallDuration(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, callStartsAt]);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isFullscreen && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isFullscreen, showControls]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Control handlers
  const toggleVideo = async () => {
    try {
      if (isVideoEnabled) {
        await localParticipant?.videoDevice?.disable();
      } else {
        await localParticipant?.videoDevice?.enable();
      }
      setIsVideoEnabled(!isVideoEnabled);
    } catch (error) {
      console.error("Failed to toggle video:", error);
    }
  };

  const toggleAudio = async () => {
    try {
      if (isAudioEnabled) {
        await localParticipant?.microphoneDevice?.disable();
      } else {
        await localParticipant?.microphoneDevice?.enable();
      }
      setIsAudioEnabled(!isAudioEnabled);
    } catch (error) {
      console.error("Failed to toggle audio:", error);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await localParticipant?.screenShareDevice?.disable();
      } else {
        await localParticipant?.screenShareDevice?.enable();
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error("Failed to toggle screen share:", error);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(true);
  };

  const getStatusText = () => {
    if (isConnected) return formatDuration(callDuration);
    if (isIncoming) return `Incoming ${callType} call...`;
    if (isRinging) return "Calling...";
    return "Connecting...";
  };

  const otherParticipants = participants.filter(
    (p) => p.userId !== localParticipant?.userId
  );
  const hasRemoteParticipants = otherParticipants.length > 0;

  // Render incoming call UI
  if (isIncoming && !isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
        <div className="text-center mb-8">
          <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-white/20">
            {recipientAvatar ? (
              <img src={recipientAvatar} alt={recipientName} />
            ) : (
              <AvatarFallback className="bg-white/10 text-white text-4xl">
                <User className="h-16 w-16" />
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-2xl font-semibold mb-2">{recipientName}</h2>
          <p className="text-blue-100">{getStatusText()}</p>
        </div>

        <div className="flex items-center space-x-8">
          <Button
            onClick={onDecline}
            size="lg"
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            onClick={onAnswer}
            size="lg"
            className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all animate-pulse"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  // Render connected call UI
  return (
    <div
      className={`relative h-full bg-gray-900 ${
        isFullscreen ? "cursor-none" : ""
      }`}
      onClick={() => isFullscreen && setShowControls(true)}
      onMouseMove={() => isFullscreen && setShowControls(true)}
    >
      {/* Main video area */}
      <div className="absolute inset-0">
        {callType === "video" && hasRemoteParticipants ? (
          <div className="w-full h-full">
            {/* Main participant view */}
            <div className="relative w-full h-full">
              {otherParticipants.map((participant) => (
                <ParticipantView
                  key={participant.sessionId}
                  participant={participant}
                  className="w-full h-full object-cover"
                />
              ))}

              {/* Local participant PiP */}
              {localParticipant && isVideoEnabled && (
                <div className="absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <ParticipantView
                    participant={localParticipant}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Voice call or no video - show avatar */
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <Avatar className="h-32 w-32 mb-6 ring-4 ring-white/20">
              {recipientAvatar ? (
                <img src={recipientAvatar} alt={recipientName} />
              ) : (
                <AvatarFallback className="bg-gray-600 text-white text-4xl">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{recipientName}</h2>
            <p className="text-gray-300">{getStatusText()}</p>
          </div>
        )}
      </div>

      {/* Top bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4 transition-opacity duration-300 ${
          isFullscreen && !showControls ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-sm">{getStatusText()}</span>
            </div>
            <span className="text-sm opacity-75">•</span>
            <span className="text-sm">{recipientName}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-6 transition-opacity duration-300 ${
          isFullscreen && !showControls ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-center space-x-4">
          {/* Audio toggle */}
          <Button
            onClick={toggleAudio}
            size="lg"
            variant={isAudioEnabled ? "secondary" : "destructive"}
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          {/* Video toggle (only for video calls) */}
          {callType === "video" && (
            <Button
              onClick={toggleVideo}
              size="lg"
              variant={isVideoEnabled ? "secondary" : "destructive"}
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isVideoEnabled ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Screen share */}
          <Button
            onClick={toggleScreenShare}
            size="lg"
            variant={isScreenSharing ? "default" : "secondary"}
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isScreenSharing ? (
              <MonitorOff className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
          </Button>

          {/* Speaker toggle */}
          <Button
            onClick={toggleSpeaker}
            size="lg"
            variant={isSpeakerOn ? "secondary" : "destructive"}
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isSpeakerOn ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>

          {/* Camera switch (for mobile) */}
          <Button
            size="lg"
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Camera className="h-5 w-5" />
          </Button>

          {/* End call */}
          <Button
            onClick={onClose}
            size="lg"
            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all ml-4"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Connection status indicator */}
      {!isConnected && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-black/80 text-white px-6 py-3 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  callType,
  recipientName,
  recipientAvatar,
  onAnswer,
  onDecline,
  isIncoming = false,
  streamCall,
}) => {
  if (!streamCall) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-full h-[80vh] max-h-[800px] p-0 overflow-hidden bg-gray-900">
        <StreamCall call={streamCall}>
          <CallContent
            callType={callType}
            recipientName={recipientName}
            recipientAvatar={recipientAvatar}
            onAnswer={onAnswer}
            onDecline={onDecline}
            isIncoming={isIncoming}
            onClose={onClose}
          />
        </StreamCall>
      </DialogContent>
    </Dialog>
  );
};
