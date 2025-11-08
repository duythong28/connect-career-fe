import React, { createContext, useContext, useState, useCallback } from "react";
import { Channel } from "stream-chat";

export interface ChatBox {
  id: string;
  channel: Channel;
  isMinimized: boolean;
  position: number;
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
}

interface ChatContextType {
  chatBoxes: ChatBox[];
  openChatBox: (
    channel: Channel,
    recipientId?: string,
    recipientName?: string,
    recipientAvatar?: string
  ) => void;
  closeChatBox: (chatBoxId: string) => void;
  minimizeChatBox: (chatBoxId: string) => void;
  maximizeChatBox: (chatBoxId: string) => void; // Add this line
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatBoxes, setChatBoxes] = useState<ChatBox[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const MAX_CHATBOXES = 3;

  const openChatBox = useCallback(
    (
      channel: Channel,
      recipientId?: string,
      recipientName?: string,
      recipientAvatar?: string
    ) => {
      setChatBoxes((prev) => {
        // Check if chatbox already exists
        const existingIndex = prev.findIndex(
          (box) => box.channel.id === channel.id
        );

        if (existingIndex !== -1) {
          // If exists, maximize it and bring to front
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            isMinimized: false,
          };
          return updated;
        }

        // If we're at max capacity, remove the oldest one
        let newChatBoxes = prev.length >= MAX_CHATBOXES ? prev.slice(1) : prev;

        // Create new chatbox
        const newChatBox: ChatBox = {
          id: channel.id || `chat-${Date.now()}`,
          channel,
          isMinimized: false,
          position: newChatBoxes.length,
          recipientId,
          recipientName,
          recipientAvatar,
        };

        return [...newChatBoxes, newChatBox];
      });
    },
    []
  );

  const closeChatBox = useCallback((chatBoxId: string) => {
    setChatBoxes((prev) => prev.filter((box) => box.id !== chatBoxId));
  }, []);

  const minimizeChatBox = useCallback((chatBoxId: string) => {
    setChatBoxes((prev) =>
      prev.map((box) =>
        box.id === chatBoxId ? { ...box, isMinimized: true } : box
      )
    );
  }, []);

  const maximizeChatBox = useCallback((chatBoxId: string) => {
    setChatBoxes((prev) =>
      prev.map((box) =>
        box.id === chatBoxId ? { ...box, isMinimized: false } : box
      )
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chatBoxes,
        openChatBox,
        closeChatBox,
        minimizeChatBox,
        maximizeChatBox, // Add this line
        isSearchModalOpen,
        setIsSearchModalOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
