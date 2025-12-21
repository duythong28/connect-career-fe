import {
  useChannelStateContext,
  Avatar,
  useChatContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// --- Custom Header ---
const CustomChannelHeader = ({
  isMobile,
  onBack,
}: {
  isMobile: boolean;
  onBack?: () => void;
}) => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const members = Object.values(channel.state.members || {});
  const otherMember = members.find((m) => m.user?.id !== client.userID);
  const displayName =
    channel.data?.name || otherMember?.user?.name || "Unknown User";
  const displayImage = channel.data?.image || otherMember?.user?.image;

  return (
    <div className="flex items-center p-3 border-b bg-background h-[64px]">
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-3 p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <div className="flex items-center gap-3">
        <Avatar image={displayImage} name={displayName} size={40} />
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">
            {displayName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomChannelHeader;
