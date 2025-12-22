import {
  Avatar,
  useChatContext,
  SearchResultItemProps,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { useAuth } from "@/hooks/useAuth";
import { Channel as StreamChannel } from "stream-chat";

const CustomSearchResultItem = ({
  result,
  selectChannel,
  onSelectLocal,
}: SearchResultItemProps & { onSelectLocal: (c: StreamChannel) => void }) => {
  const { client, setActiveChannel } = useChatContext();
  const { user } = useAuth();

  const handleSelect = async () => {
    if (!client || !user?.id) return;

    let channel: StreamChannel;

    // 1. Get or Create the Channel Instance
    if (result.cid) {
      // It is an existing channel
      channel = client.channel(result.type || "messaging", result.id);
    } else {
      // It is a user, create/retrieve DM
      channel = client.channel("messaging", {
        members: [user.id, result.id],
      });
    }

    // Ensure channel is initialized
    if (!channel.initialized) {
      await channel.watch();
    }

    // 2. IMPORTANT: Update Stream's Internal Context
    // This tells ChannelList: "Hey, make this channel active (highlighted)"
    if (setActiveChannel) setActiveChannel(channel);

    // 3. Update Local State
    // This tells MessagePage: "Hey, show this channel in the right pane"
    onSelectLocal(channel);

    // 4. Close the Search UI
    if (selectChannel) selectChannel();
  };

  const isChannel = !!result.cid;
  const displayImage = isChannel ? result.data?.image : result.image;
  const displayName = isChannel
    ? result.data?.name || result.cid
    : result.name || result.id;

  return (
    <div
      onClick={handleSelect}
      className="flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors"
    >
      <Avatar image={displayImage} name={displayName} size={40} />
      <div className="flex flex-col">
        <span className="font-medium text-sm text-foreground">
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground">
          {isChannel ? "Channel" : "User"}
        </span>
      </div>
    </div>
  );
};

export default CustomSearchResultItem;
