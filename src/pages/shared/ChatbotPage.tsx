import React, { useState } from "react";
import { Brain, MessageSquare, Send } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const ChatbotPage = () => {
  const { user } = useAuth();
  const chatType = user?.role === "candidate" ? "candidate" : "recruiter";
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "bot";
      content: string;
      timestamp: string;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");

  // Chat Functions
  const sendChatMessage = (
    message: string,
    chatType: "candidate" | "recruiter"
  ) => {
    const userMessage = {
      id: `msg${Date.now()}`,
      sender: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Generate bot response
    setTimeout(() => {
      let botResponse = "";

      if (chatType === "candidate") {
        if (
          message.toLowerCase().includes("cv") ||
          message.toLowerCase().includes("resume")
        ) {
          botResponse =
            "Here are some tips to improve your CV: 1) Use action verbs, 2) Quantify your achievements, 3) Tailor it to each job application. Would you like specific advice for any section?";
        } else if (message.toLowerCase().includes("interview")) {
          botResponse =
            "Interview preparation tips: 1) Research the company thoroughly, 2) Practice common questions, 3) Prepare questions to ask them, 4) Dress appropriately. What type of interview are you preparing for?";
        } else if (message.toLowerCase().includes("job")) {
          botResponse =
            "I can help you find relevant jobs based on your skills and experience. What type of role are you looking for?";
        } else {
          botResponse =
            "I'm here to help with your career! I can assist with CV improvements, interview preparation, job search strategies, and career advice. What would you like to know?";
        }
      } else {
        if (message.toLowerCase().includes("job description")) {
          botResponse =
            "Here are tips for writing effective job descriptions: 1) Use clear, specific language, 2) Include both required and preferred qualifications, 3) Highlight company culture and benefits, 4) Use inclusive language. Would you like me to review a specific job posting?";
        } else if (message.toLowerCase().includes("candidate")) {
          botResponse =
            "For better candidate attraction: 1) Write compelling job titles, 2) Include salary ranges, 3) Highlight growth opportunities, 4) Showcase company culture. Need help with candidate screening?";
        } else if (message.toLowerCase().includes("interview")) {
          botResponse =
            "Interview best practices: 1) Prepare structured questions, 2) Allow time for candidate questions, 3) Take detailed notes, 4) Provide clear next steps. What interview stage are you planning?";
        } else {
          botResponse =
            "I'm your recruiting assistant! I can help with writing job descriptions, candidate screening strategies, interview planning, and hiring best practices. How can I assist you today?";
        }
      }

      const botMessage = {
        id: `msg${Date.now()}`,
        sender: "bot" as const,
        content: botResponse,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {chatType === "candidate"
              ? "Career Assistant"
              : "Recruiting Assistant"}
          </h1>
          <p className="text-gray-600 mt-2">
            {chatType === "candidate"
              ? "Get personalized advice for your career growth"
              : "Get help with recruiting and hiring strategies"}
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  {chatType === "candidate"
                    ? "Your personal career advisor"
                    : "Your recruiting expert"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {chatType === "candidate"
                      ? "Ask me about CV improvements, interview tips, job search strategies, or career advice."
                      : "Ask me about writing job descriptions, candidate screening, interview techniques, or hiring best practices."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chatType === "candidate"
                      ? [
                          "How can I improve my CV?",
                          "Tips for job interviews?",
                          "Help me find relevant jobs",
                          "Career transition advice",
                        ]
                      : [
                          "How to write effective job descriptions?",
                          "Best practices for candidate screening",
                          "Interview question suggestions",
                          "Strategies to attract top talent",
                        ].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              sendChatMessage(suggestion, chatType)
                            }
                            className="text-left"
                          >
                            {suggestion}
                          </Button>
                        ))}
                  </div>
                </div>
              )}

              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask your ${
                  chatType === "candidate" ? "career" : "recruiting"
                } question...`}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    sendChatMessage(chatInput, chatType);
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (chatInput.trim()) {
                    sendChatMessage(chatInput, chatType);
                  }
                }}
                disabled={!chatInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;
