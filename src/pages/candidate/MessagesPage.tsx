import React, { useState } from "react";
import { Send, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();

  // Mock conversations
  const conversations = [
    {
      id: "1",
      participantId: "recruiter-1",
      participantName: "Sarah Johnson",
      participantRole: "HR Manager at TechCorp",
      lastMessage:
        "Hi! I saw your application for the Frontend Developer position...",
      timestamp: "2024-01-15 10:30",
      unread: 2,
    },
    {
      id: "2",
      participantId: "recruiter-2",
      participantName: "Mike Chen",
      participantRole: "Recruiter at DataSoft",
      lastMessage:
        "Thanks for your interest! When would be a good time for an interview?",
      timestamp: "2024-01-14 16:45",
      unread: 0,
    },
  ];

  const messages = selectedConversation
    ? [
        {
          id: "1",
          senderId: "recruiter-1",
          content:
            "Hi! I saw your application for the Frontend Developer position. Your profile looks great!",
          timestamp: "2024-01-15 10:30",
          isFromMe: false,
        },
        {
          id: "2",
          senderId: user?.id || "",
          content: "Thank you! I'm very interested in the position.",
          timestamp: "2024-01-15 10:32",
          isFromMe: true,
        },
        {
          id: "3",
          senderId: "recruiter-1",
          content: "Would you be available for a phone interview this week?",
          timestamp: "2024-01-15 10:35",
          isFromMe: false,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with recruiters and candidates
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border h-[600px] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Conversations</h2>
            </div>

            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {conversation.participantName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {conversation.participantRole}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conversation.timestamp}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-blue-600">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.participantName
                        }
                      </h3>
                      <p className="text-sm text-gray-600">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.participantRole
                        }
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isFromMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromMe
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isFromMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setNewMessage("");
                          toast({
                            title: "Message sent",
                            description:
                              "Your message has been sent successfully.",
                          });
                        }
                      }}
                    />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
