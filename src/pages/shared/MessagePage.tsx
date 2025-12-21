import { useState, useMemo, useCallback } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  useChatContext,
  SearchResultItemProps,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useChatClient } from "@/hooks/useChatClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Channel as StreamChannel } from "stream-chat";
import CustomChannelPreview from "@/components/chat/customChannelPreview";
import CustomSearchResultItem from "@/components/chat/CustomSearchResultItem";
import CustomChannelHeader from "@/components/chat/CustomChannelHeader";

const MessagePage = () => {
  const { user } = useAuth();
  const { client, loading, error } = useChatClient();
  const { openChatBox } = useChatContext();
  const isMobile = useIsMobile();

  const [selectedChannel, setSelectedChannel] = useState<StreamChannel | null>(
    null
  );

  // --- 1. Local Selection Handler (Right Pane & Mobile) ---
  const handleChannelSelect = useCallback(
    (channel: StreamChannel) => {
      setSelectedChannel(channel);
      if (isMobile) {
        const otherMember = Object.values(channel.state.members).find(
          (member) => member.user?.id !== user?.id
        );
        if (openChatBox) {
          openChatBox(
            channel,
            otherMember?.user?.id,
            otherMember?.user?.name || "Unknown User",
            otherMember?.user?.image
          );
        }
      }
    },
    [isMobile, user?.id, openChatBox]
  );

  // --- 2. Memoize Search Props ---
  const additionalChannelSearchProps = useMemo(
    () => ({
      searchForChannels: true,
      searchQueryParams: {
        channelFilters: {
          filters: { members: { $in: [user?.id || ""] } },
        },
      },
      // Pass our Custom Item which now has access to useChatContext
      SearchResultItem: (props: SearchResultItemProps) => (
        <CustomSearchResultItem
          {...props}
          onSelectLocal={handleChannelSelect}
        />
      ),
    }),
    [user?.id, handleChannelSelect]
  );

  const filters = useMemo(
    () => ({ members: { $in: [user?.id || ""] } }),
    [user?.id]
  );
  const options = useMemo(() => ({ presence: true, state: true }), []);
  const sort = useMemo(() => ({ last_message_at: -1 as const }), []);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  if (error)
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!client)
    return (
      <div className="h-full flex items-center justify-center">
        Unable to connect
      </div>
    );

  return (
    <div className="h-[calc(100vh-4.4rem)] border border-1 relative overflow-hidden">
      <Chat client={client}>
        <div className="flex h-full">
          <div
            className={`${
              isMobile && selectedChannel ? "hidden" : "block"
            } w-full md:w-80 border-r bg-background flex flex-col relative`}
          >
            <div className="flex-1 overflow-y-auto">
              <ChannelList
                filters={filters}
                options={options}
                sort={sort}
                showChannelSearch
                additionalChannelSearchProps={additionalChannelSearchProps}
                Preview={(previewProps) => (
                  <CustomChannelPreview
                    {...previewProps}
                    // REVERTED: No strict ID check needed anymore.
                    // setActiveChannel here handles list clicks
                    setActiveChannel={(channel, watchers) => {
                      handleChannelSelect(channel);
                      if (previewProps.setActiveChannel) {
                        previewProps.setActiveChannel(channel, watchers);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div
            className={`${
              isMobile && !selectedChannel ? "hidden" : "flex-1"
            } relative`}
          >
            {!selectedChannel && !isMobile ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Welcome to Chat
                  </h3>
                  <p className="text-muted-foreground">
                    Select a channel to start messaging
                  </p>
                </div>
              </div>
            ) : selectedChannel ? (
              <Channel channel={selectedChannel}>
                <Window>
                  <CustomChannelHeader
                    isMobile={isMobile}
                    onBack={() => setSelectedChannel(null)}
                  />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            ) : null}
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default MessagePage;
