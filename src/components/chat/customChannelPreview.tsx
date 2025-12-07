import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Users } from "lucide-react";
import { ChannelPreviewUIComponentProps } from "stream-chat-react";
import { useAuth } from "@/hooks/useAuth";

const CustomChannelPreview: React.FC<ChannelPreviewUIComponentProps> = ({
  channel,
  setActiveChannel,
  watchers,
  active,
  displayTitle,
  displayImage,
  lastMessage,
}) => {
  const { user } = useAuth();

  const handleSelect = () => {
    if (setActiveChannel) {
      setActiveChannel(channel, watchers);
    }
  };

  // Check if this is a self-DM channel
  const isSelfDM = channel.id?.startsWith("dm-self-");

  // Get the other member for regular DM channels
  const otherMember = Object.values(channel.state.members).find(
    (member) => member.user?.id !== user?.id
  );

  const getChannelDisplayInfo = () => {
    if (isSelfDM) {
      return {
        name: "Personal Notes",
        avatar: null,
        icon: <User className="h-4 w-4 text-blue-500" />,
      };
    }

    if (otherMember?.user) {
      return {
        name: otherMember.user.name || "Unknown User",
        avatar: otherMember.user.image,
        icon: <User className="h-4 w-4 text-green-500" />,
      };
    }

    // Fallback for group channels or unknown structure
    return {
      name: displayTitle || channel.id || "Unknown Channel",
      avatar: displayImage,
      icon: <Users className="h-4 w-4 text-purple-500" />,
    };
  };

  const { name, avatar, icon } = getChannelDisplayInfo();

  const formatLastMessage = () => {
    if (!lastMessage) return null;

    if (lastMessage.text) {
      return lastMessage.text;
    }

    if (lastMessage.attachments?.length) {
      return "📎 Attachment";
    }

    return "Message";
  };

  const isOnline = otherMember?.user?.online;

  return (
    <div
      onClick={handleSelect}
      className={`
        flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer border-l-2 transition-colors
        ${active ? "bg-accent border-l-primary" : "border-l-transparent"}
      `}
    >
      <div className="flex-shrink-0 relative">
        {avatar ? (
          <Avatar className="h-8 w-8">
            <img src={avatar} alt={name} />
            <AvatarFallback>{icon}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        )}
        {/* Online indicator for non-self channels */}
        {!isSelfDM && isOnline && (
          <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-background"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          {channel.state?.unreadCount && channel.state.unreadCount > 0 ? (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {channel.state.unreadCount > 99
                ? "99+"
                : channel.state.unreadCount}
            </span>
          ) : null}
        </div>

        {lastMessage && (
          <p className="text-xs text-muted-foreground truncate">
            {formatLastMessage()}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomChannelPreview;
