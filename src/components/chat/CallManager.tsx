import React, { useState, useEffect } from "react";
import { CallModal } from "./CallModal";
import { useToast } from "@/hooks/use-toast";
import { useChatClient } from "@/hooks/useChatClient";
import { useAuth } from "@/hooks/useAuth";
import { useStreamVideoClient } from "@/hooks/useStreamVideoClient";
import { Call } from "@stream-io/video-react-sdk";

interface CallData {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  channelId: string;
  callId?: string;
  callerId?: string;
  callerName?: string;
  callerAvatar?: string;
}

export const CallManager: React.FC = () => {
  const [currentCall, setCurrentCall] = useState<{
    type: "video" | "voice";
    data: CallData;
    isIncoming?: boolean;
    streamCall?: Call;
  } | null>(null);
  const { toast } = useToast();
  const { client: chatClient } = useChatClient();
  const { client: videoClient } = useStreamVideoClient();
  const { user } = useAuth();

  // Handle outgoing calls (when current user initiates)
  useEffect(() => {
    const handleVideoCall = async (event: CustomEvent<CallData>) => {
      console.log("CallManager: Initiating video call", event.detail);
      
      if (!videoClient || !user) {
        console.log("CallManager: Missing video client or user");
        return;
      }

      try {
        // Create Stream Video call
        const callId = event.detail.callId || `video_${Date.now()}`;
        const call = videoClient.call('default', callId);
        
        // Create the call with members
        await call.getOrCreate({
          data: {
            members: [
              { user_id: user.id },
              { user_id: event.detail.recipientId }
            ],
          },
        });

        // Join the call automatically for the caller
        await call.join();

        setCurrentCall({
          type: "video",
          data: event.detail,
          isIncoming: false,
          streamCall: call,
        });

        console.log("CallManager: Video call created and joined");
      } catch (error) {
        console.error("CallManager: Failed to create video call:", error);
        toast({
          title: "Call Failed",
          description: "Unable to start video call. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleVoiceCall = async (event: CustomEvent<CallData>) => {
      console.log("CallManager: Initiating voice call", event.detail);
      
      if (!videoClient || !user) {
        console.log("CallManager: Missing video client or user");
        return;
      }

      try {
        // Create Stream Video call for voice only
        const callId = event.detail.callId || `voice_${Date.now()}`;
        const call = videoClient.call('default', callId);
        
        await call.getOrCreate({
          data: {
            members: [
              { user_id: user.id },
              { user_id: event.detail.recipientId }
            ],
          },
        });

        // Join the call automatically for the caller
        await call.join();
        
        // Disable video for voice calls
        await call.camera.disable();

        setCurrentCall({
          type: "voice",
          data: event.detail,
          isIncoming: false,
          streamCall: call,
        });

        console.log("CallManager: Voice call created and joined");
      } catch (error) {
        console.error("CallManager: Failed to create voice call:", error);
        toast({
          title: "Call Failed",
          description: "Unable to start voice call. Please try again.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener("initiate-video-call", handleVideoCall as EventListener);
    window.addEventListener("initiate-voice-call", handleVoiceCall as EventListener);

    return () => {
      window.removeEventListener("initiate-video-call", handleVideoCall as EventListener);
      window.removeEventListener("initiate-voice-call", handleVoiceCall as EventListener);
    };
  }, [videoClient, user, toast]);

  // Listen for incoming calls via Stream Chat messages
  useEffect(() => {
    if (!chatClient || !user || !videoClient) {
      console.log("CallManager: Missing clients or user for incoming calls");
      return;
    }

    console.log("CallManager: Setting up incoming call listener for user:", user.id);

    const handleMessage = (event: any) => {
      console.log("CallManager: Received chat event:", event.type, event);
      
      if (event.type === "message.new") {
        const message = event.message;
        console.log("CallManager: Processing message:", message);
        
        // Updated to check for call_notification message type instead of system type
        if (
          message.custom?.message_type === "call_notification" &&
          message.custom?.call_status === "calling" &&
          message.custom?.caller_id !== user.id &&
          message.text?.includes("is calling...")
        ) {
          console.log("CallManager: Incoming call detected!", message.custom);
          
          // Create call for recipient
          const handleIncomingCall = async () => {
            try {
              const callId = message.custom.call_id || `incoming_${Date.now()}`;
              const call = videoClient.call('default', callId);
              
              // Get or create the call
              await call.getOrCreate({
                data: {
                  members: [
                    { user_id: user.id },
                    { user_id: message.custom.caller_id }
                  ],
                },
              });
              
              setCurrentCall({
                type: message.custom.call_type,
                data: {
                  recipientId: user.id,
                  recipientName: user.firstName + " " + user.lastName,
                  recipientAvatar: user.avatar,
                  channelId: message.custom.channel_id,
                  callId: callId,
                  callerId: message.custom.caller_id,
                  callerName: message.custom.caller_name,
                  callerAvatar: message.custom.caller_avatar,
                },
                isIncoming: true,
                streamCall: call,
              });

              console.log("CallManager: Incoming call set up successfully");
            } catch (error) {
              console.error("CallManager: Failed to handle incoming call:", error);
            }
          };

          handleIncomingCall();
        } else {
          console.log("CallManager: Message doesn't match call criteria:", {
            messageType: message.custom?.message_type,
            callStatus: message.custom?.call_status,
            callerId: message.custom?.caller_id,
            currentUserId: user.id,
            textMatch: message.text?.includes("is calling...")
          });
        }
      }
    };

    // Listen for message events
    chatClient.on(handleMessage);

    return () => {
      console.log("CallManager: Cleaning up incoming call listener");
      chatClient.off(handleMessage);
    };
  }, [chatClient, user, videoClient]);

  const handleCallEnd = async () => {
    console.log("CallManager: Ending call");
    
    if (currentCall?.streamCall) {
      try {
        await currentCall.streamCall.leave();
        console.log("CallManager: Left call successfully");
      } catch (error) {
        console.error("CallManager: Error leaving call:", error);
      }
    }
    
    setCurrentCall(null);
  };

  const handleCallAnswer = async () => {
    console.log("CallManager: Answering call");
    
    if (currentCall?.streamCall) {
      try {
        await currentCall.streamCall.join();
        
        // For voice calls, disable video
        if (currentCall.type === "voice") {
          await currentCall.streamCall.camera.disable();
        }
        
        toast({
          title: "Call Connected",
          description: `Connected to ${
            currentCall.isIncoming
              ? currentCall.data.callerName
              : currentCall.data.recipientName
          }`,
        });
        
        console.log("CallManager: Call answered successfully");
      } catch (error) {
        console.error("CallManager: Error answering call:", error);
        toast({
          title: "Call Failed",
          description: "Unable to join the call. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCallDecline = async () => {
    console.log("CallManager: Declining call");
    
    if (currentCall?.streamCall) {
      try {
        await currentCall.streamCall.leave();
      } catch (error) {
        console.error("CallManager: Error declining call:", error);
      }
    }
    
    toast({
      title: "Call Declined",
      description: `Call with ${
        currentCall.isIncoming
          ? currentCall.data.callerName
          : currentCall.data.recipientName
      } was declined`,
    });
    
    setCurrentCall(null);
  };

  // Debug log when currentCall changes
  useEffect(() => {
    console.log("CallManager: Current call state changed:", currentCall);
  }, [currentCall]);

  if (!currentCall) {
    console.log("CallManager: No current call, not rendering");
    return null;
  }

  const displayName = currentCall.isIncoming
    ? currentCall.data.callerName || "Unknown Caller"
    : currentCall.data.recipientName || "Unknown User";

  const displayAvatar = currentCall.isIncoming
    ? currentCall.data.callerAvatar
    : currentCall.data.recipientAvatar;

  console.log("CallManager: Rendering call modal for:", displayName);

  return (
    <CallModal
      isOpen={true}
      onClose={handleCallEnd}
      callType={currentCall.type}
      recipientName={displayName}
      recipientAvatar={displayAvatar}
      onAnswer={handleCallAnswer}
      onDecline={handleCallDecline}
      isIncoming={currentCall.isIncoming || false}
      streamCall={currentCall.streamCall}
    />
  );
};