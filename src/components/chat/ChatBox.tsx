import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Minus, X, User, Video, Phone, Maximize2 } from "lucide-react";
import { Channel, MessageList, MessageInput } from "stream-chat-react";
import { useChatContext, ChatBox as ChatBoxType } from "@/context/ChatContext";
import { useChatClient } from "@/hooks/useChatClient";
import { useAuth } from "@/hooks/useAuth";

interface ChatBoxProps {
  chatBox: ChatBoxType;
  style: React.CSSProperties;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ chatBox, style }) => {
  const { closeChatBox, minimizeChatBox, maximizeChatBox } = useChatContext();
  const { client } = useChatClient();
  const { user } = useAuth();

  const handleVideoCall = async () => {
    if (!client || !user) {
      console.log("No client or user available");
      return;
    }

    console.log("Initiating video call...");
    console.log("Using channel:", chatBox.channel.id);
    console.log("Channel members:", chatBox.channel.state.members);

    try {
      const callId = `video_${Date.now()}`;

      // Send regular message instead of system message
      const message = await chatBox.channel.sendMessage({
        text: `📹 ${user.firstName} ${user.lastName} is calling...`,
        // Remove type: "system" - use regular message
        custom: {
          message_type: "call_notification", // Use custom field to identify call messages
          call_type: "video",
          call_status: "calling",
          call_id: callId,
          caller_id: user.id,
          caller_name: `${user.firstName} ${user.lastName}`,
          caller_avatar: user.avatar,
          channel_id: chatBox.channel.id,
        },
      });

      console.log("Call message sent successfully:", message);

      // Dispatch local event for caller
      const videoCallEvent = new CustomEvent("initiate-video-call", {
        detail: {
          recipientId: chatBox.recipientId,
          recipientName: chatBox.recipientName,
          recipientAvatar: chatBox.recipientAvatar,
          channelId: chatBox.channel.id,
          callId: callId,
        },
      });

      window.dispatchEvent(videoCallEvent);
      console.log("Local video call event dispatched");
    } catch (error) {
      console.error("Failed to initiate video call:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }
  };

  const handleVoiceCall = async () => {
    if (!client || !user) {
      console.log("No client or user available");
      return;
    }

    console.log("Initiating voice call...");

    try {
      const callId = `voice_${Date.now()}`;

      // Send regular message instead of system message
      const message = await chatBox.channel.sendMessage({
        text: `📞 ${user.firstName} ${user.lastName} is calling...`,
        // Remove type: "system" - use regular message
        custom: {
          message_type: "call_notification", // Use custom field to identify call messages
          call_type: "voice",
          call_status: "calling",
          call_id: callId,
          caller_id: user.id,
          caller_name: `${user.firstName} ${user.lastName}`,
          caller_avatar: user.avatar,
          channel_id: chatBox.channel.id,
        },
      });

      console.log("Voice call message sent successfully:", message);

      // Dispatch local event for caller
      const voiceCallEvent = new CustomEvent("initiate-voice-call", {
        detail: {
          recipientId: chatBox.recipientId,
          recipientName: chatBox.recipientName,
          recipientAvatar: chatBox.recipientAvatar,
          channelId: chatBox.channel.id,
          callId: callId,
        },
      });

      window.dispatchEvent(voiceCallEvent);
      console.log("Local voice call event dispatched");
    } catch (error) {
      console.error("Failed to initiate voice call:", error);
    }
  };

  const handleMaximize = () => {
    maximizeChatBox(chatBox.id);
  };

  return (
    <Card
      className="fixed bottom-0 w-80 h-96 shadow-xl border-t-2 border-t-primary z-50 flex flex-col overflow-hidden"
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar className="h-6 w-6">
            {chatBox.recipientAvatar ? (
              <img src={chatBox.recipientAvatar} alt={chatBox.recipientName} />
            ) : (
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-sm truncate">
            {chatBox.recipientName || "Chat"}
          </span>
          {/* Online status indicator */}
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVideoCall}
            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
            title="Start video call"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceCall}
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
            title="Start voice call"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            className="h-8 w-8 p-0"
            title="Maximize"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => minimizeChatBox(chatBox.id)}
            className="h-8 w-8 p-0"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => closeChatBox(chatBox.id)}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      {!chatBox.isMinimized && (
        <div className="flex-1 flex flex-col min-h-0">
          <Channel channel={chatBox.channel}>
            <div className="str-chat__container str-chat__container--chatbox flex flex-col h-full">
              <div className="str-chat__main-panel flex flex-col h-full">
                <div className="flex-1 overflow-hidden">
                  <MessageList />
                </div>
                <div className="flex-shrink-0">
                  <MessageInput />
                </div>
              </div>
            </div>
          </Channel>
        </div>
      )}
    </Card>
  );
};
