import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useChatClient } from "@/hooks/useChatClient";
import { useAuth } from "@/hooks/useAuth";
import { createDirectMessageChannel } from "@/lib/streamChat";

interface UserSearchResult {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  online?: boolean;
}

export const ChatSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, openChatBox } =
    useChatContext();
  const { client } = useChatClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [recentChats, setRecentChats] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search users using Stream's queryUsers - this uses real data
  const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    if (!query.trim() || !client) return [];

    try {
      const response = await client.queryUsers(
        {
          $and: [
            { name: { $autocomplete: query } },
            { id: { $ne: user?.id } }, // Exclude current user
          ],
        },
        { name: 1 },
        { limit: 10 }
      );

      return response.users.map((streamUser) => ({
        id: streamUser.id,
        name: streamUser.name || streamUser.id,
        avatar: streamUser.image,
        role: streamUser.role,
        online: streamUser.online,
      }));
    } catch (error) {
      console.error("User search failed:", error);
      return [];
    }
  };

  const loadRecentChats = async () => {
    if (!client || !user) return;

    try {
      // Query existing channels to get recent chats - same as MessagePage
      const channels = await client.queryChannels(
        {
          members: { $in: [user.id] },
        },
        { last_message_at: -1 },
        { limit: 10 }
      );

      const recent: UserSearchResult[] = channels
        .map((channel) => {
          // Skip self-DM channels
          if (channel.id?.startsWith(`dm-self-${user.id}`)) {
            return null;
          }

          // Find the other member (not current user)
          const otherMember = Object.values(channel.state.members).find(
            (member) => member.user?.id !== user.id
          );

          if (!otherMember?.user) return null;

          return {
            id: otherMember.user.id,
            name: otherMember.user.name || "Unknown User",
            avatar: otherMember.user.image,
            online: otherMember.user.online,
            role: otherMember.user.role,
          };
        })
        .filter((item): item is UserSearchResult => item !== null); // Remove null entries

      setRecentChats(recent);
    } catch (error) {
      console.error("Failed to load recent chats:", error);
    }
  };

  useEffect(() => {
    if (isSearchModalOpen) {
      loadRecentChats();
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchModalOpen, client, user]);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        try {
          const results = await searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleUserSelect = async (selectedUser: UserSearchResult) => {
    if (!client || !user) return;

    try {
      const channel = await createDirectMessageChannel(
        client,
        user.id,
        selectedUser.id
      );

      openChatBox(
        channel,
        selectedUser.id,
        selectedUser.name,
        selectedUser.avatar
      );

      setIsSearchModalOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const displayUsers = searchQuery.trim() ? searchResults : recentChats;

  return (
    <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {!searchQuery.trim() && recentChats.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Recent conversations
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Searching...
              </div>
            ) : displayUsers.length > 0 ? (
              <div className="space-y-1">
                {displayUsers.map((searchUser) => (
                  <div
                    key={searchUser.id}
                    onClick={() => handleUserSelect(searchUser)}
                    className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        {searchUser.avatar ? (
                          <img src={searchUser.avatar} alt={searchUser.name} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {searchUser.online && (
                        <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {searchUser.name}
                      </p>
                      {searchUser.role && (
                        <p className="text-xs text-muted-foreground">
                          {searchUser.role}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-4 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Search for people to start chatting
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
