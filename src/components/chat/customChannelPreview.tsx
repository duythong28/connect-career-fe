import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Users } from "lucide-react";
import { ChannelPreviewUIComponentProps } from "stream-chat-react";

const CustomChannelPreview: React.FC<ChannelPreviewUIComponentProps> = ({
  channel,
  setActiveChannel,
  watchers,
  active,
  displayTitle,
  displayImage,
  lastMessage,
}) => {
  const handleSelect = () => {
    if (setActiveChannel) {
      setActiveChannel(channel, watchers);
    }
  };

  const isSelfDM = channel.id?.startsWith("dm-self-");
  const channelName = displayTitle || channel.id;

  const getChannelIcon = () => {
    if (isSelfDM) {
      return <User className="h-4 w-4 text-blue-500" />;
    }

    return <Users className="h-4 w-4 text-purple-500" />;
  };

  const getChannelDisplayName = () => {
    if (isSelfDM) {
      return "Personal Notes";
    }

    return channelName;
  };

  return (
    <div
      onClick={handleSelect}
      className={`
        flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer border-l-2 transition-colors
        ${active ? "bg-accent border-l-primary" : "border-l-transparent"}
      `}
    >
      <div className="flex-shrink-0">
        {displayImage ? (
          <Avatar className="h-8 w-8">
            <img src={displayImage} alt={channelName} />
            <AvatarFallback>{getChannelIcon()}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {getChannelIcon()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">
            {getChannelDisplayName()}
          </h3>
          {channel.state?.unreadCount && channel.state.unreadCount > 0 ? (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {channel.state.unreadCount}
            </span>
          ) : null}
        </div>

        {lastMessage && (
          <p className="text-xs text-muted-foreground truncate">
            {lastMessage.text || "Message"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomChannelPreview;
