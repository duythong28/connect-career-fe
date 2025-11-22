import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  getChatClient,
  generateUserToken,
  createOrUpdateUser,
  createSelfDirectMessageChannel,
} from "@/lib/streamChat";
import { useAuth } from "./useAuth";

export const useChatClient = () => {
  const { user } = useAuth();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const chatClient = getChatClient();
        const userToken = generateUserToken(user.id);

        await createOrUpdateUser(
          chatClient,
          user.id,
          user.firstName + " " + user.lastName,
          userToken,
          user.avatar || undefined
        );

        setClient(chatClient);

        await createSelfDirectMessageChannel(chatClient, user.id);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [user?.id]);

  return { client, loading, error };
};
