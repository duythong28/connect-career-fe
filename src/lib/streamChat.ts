import { StreamChat } from "stream-chat";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let chatClient: StreamChat | null = null;

export const getChatClient = () => {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey);
  }
  return chatClient;
};

export const createOrUpdateUser = async (
  client: StreamChat,
  userId: string,
  name: string,
  userToken: string,
  userAvatar?: string
) => {
  try {
    await client.connectUser(
      {
        id: userId,
        name: name,
        role: "admin",
        image: userAvatar,
      },
      userToken
    );
  } catch (error) {
    throw error;
  }
};

export const createDirectMessageChannel = async (
  client: StreamChat,
  userId: string
) => {
  try {
    const channelId = `dm-self-${userId}`;

    const channel = client.channel("messaging", channelId, {
      members: [userId],
      created_by_id: userId,
      ...{ name: "Personal Notes" },
    });

    try {
      await channel.watch();
      return channel;
    } catch (watchError) {
      try {
        await channel.create();
        return channel;
      } catch (createError) {
        throw createError;
      }
    }
  } catch (error) {
    throw error;
  }
};

export const generateUserToken = (userId: string): string => {
  const client = getChatClient();
  return client.devToken(userId);
};
