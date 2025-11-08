import { useEffect, useState } from "react";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import { useAuth } from "./useAuth";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamVideoClient = () => {
  const { user } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!user) {
      setClient(null);
      return;
    }

    try {
      const videoUser: User = {
        id: user.id,
        name: user.firstName + " " + user.lastName,
        image: user.avatar,
      };

      // Create a temporary chat client instance to generate the token
      const tempChatClient = StreamChat.getInstance(apiKey);
      const token = tempChatClient.devToken(user.id);

      const videoClient = new StreamVideoClient({
        apiKey,
        user: videoUser,
        token,
      });

      setClient(videoClient);
    } catch (error) {
      console.error("Failed to initialize video client:", error);
    }

    return () => {
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [user]);

  return { client };
};