import { useState } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useChatClient } from "@/hooks/useChatClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft } from "lucide-react";
import CustomChannelPreview from "@/components/chat/customChannelPreview";
import { useAuth } from "@/hooks/useAuth";

const MessagePage = () => {
  const { user } = useAuth();
  const { client, loading, error } = useChatClient();
  const isMobile = useIsMobile();

  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  const filters = {
    members: { $in: [user?.id || ""] },
  };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 as const };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Unable to connect to chat</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] border border-1 relative overflow-hidden">
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
                Preview={(props) => (
                  <div onClick={() => setSelectedChannel(props.channel)}>
                    <CustomChannelPreview {...props} />
                  </div>
                )}
                additionalChannelSearchProps={{
                  searchForChannels: true,
                  searchQueryParams: {
                    channelFilters: {
                      filters: { members: { $in: [user?.id || ""] } },
                    },
                  },
                }}
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
            ) : (
              <Channel>
                <Window>
                  {isMobile && selectedChannel && (
                    <div className="flex items-center p-3 border-b bg-background">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedChannel(null)}
                        className="mr-3"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <ChannelHeader />
                      </div>
                    </div>
                  )}
                  {!isMobile && <ChannelHeader />}
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            )}
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default MessagePage;
