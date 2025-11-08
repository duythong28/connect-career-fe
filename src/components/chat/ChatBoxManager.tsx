import React from "react";
import { Chat } from "stream-chat-react";
import { ChatBox } from "./ChatBox";
import { useChatContext } from "@/context/ChatContext";
import { useChatClient } from "@/hooks/useChatClient";

export const ChatBoxManager: React.FC = () => {
  const { chatBoxes, maximizeChatBox } = useChatContext();
  const { client } = useChatClient();

  if (!client) return null;

  const CHATBOX_WIDTH = 320; // 80 * 4 (w-80)
  const CHATBOX_SPACING = 10;

  return (
    <Chat client={client}>
      {chatBoxes.map((chatBox, index) => {
        const rightOffset = (CHATBOX_WIDTH + CHATBOX_SPACING) * index + 24; // 24px from right edge

        if (chatBox.isMinimized) {
          return (
            <div
              key={chatBox.id}
              className="fixed bottom-0 w-80 h-12 bg-primary text-primary-foreground shadow-xl border-t-2 border-t-primary z-50 flex items-center justify-between px-3 cursor-pointer hover:bg-primary/90 transition-colors"
              style={{ right: `${rightOffset}px` }}
              onClick={() => maximizeChatBox(chatBox.id)}
              title={`Click to restore chat with ${chatBox.recipientName}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium text-sm truncate">
                  {chatBox.recipientName || "Chat"}
                </span>
              </div>
              {chatBox.channel.state?.unreadCount &&
                chatBox.channel.state.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {chatBox.channel.state.unreadCount > 99
                      ? "99+"
                      : chatBox.channel.state.unreadCount}
                  </span>
                )}
            </div>
          );
        }

        return (
          <ChatBox
            key={chatBox.id}
            chatBox={chatBox}
            style={{ right: `${rightOffset}px` }}
          />
        );
      })}
    </Chat>
  );
};
