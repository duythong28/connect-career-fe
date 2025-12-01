import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";
import { useChatClient } from "@/hooks/useChatClient";
import { createDirectMessageChannel } from "@/lib/streamChat";

export default function MessageButton({
  senderId,
  recieverId,
}: {
  senderId: string;
  recieverId: string;
}) {
  const { client } = useChatClient();
  const { openChatBox } = useChatContext();

  const handleMessageRecruiter = async () => {
    if (!client || !senderId || !recieverId) return;

    try {
      const userResponse = await client.queryUsers(
        { id: { $eq: recieverId } },
        {},
        { limit: 1 }
      );

      const recruiterUser = userResponse.users[0];
      const recruiterName = recruiterUser?.name || "Recruiter";
      const recruiterAvatar = recruiterUser?.image;

      const channel = await createDirectMessageChannel(
        client,
        senderId,
        recieverId
      );

      openChatBox(channel, recieverId, recruiterName, recruiterAvatar);
    } catch (error) {
      console.error("Failed to start chat with recruiter:", error);

      try {
        const channel = await createDirectMessageChannel(
          client,
          senderId,
          recieverId
        );
        openChatBox(channel, recieverId, "Recruiter");
      } catch (fallbackError) {
        console.error("Fallback chat creation also failed:", fallbackError);
      }
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        handleMessageRecruiter();
      }}
    >
      <MessageSquare className="h-4 w-4 mr-1" />
      Message
    </Button>
  );
}
