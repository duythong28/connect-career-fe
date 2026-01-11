import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Plus,
  MessageSquare,
  Paperclip,
  Menu,
  X,
  Sparkles,
  Bot,
  BrainCircuit,
  ChevronRight,
  Loader2,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  Copy,
  Check,
  Briefcase,
  DollarSign,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  aiAgentAPI,
  ConversationMessage,
  AttachmentInput,
} from "@/api/endpoints/ai-agent.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";
import { Edit2 } from "lucide-react"; // Import thêm icon
import { RenameSessionModal } from "@/components/candidate/ai-mock-interview/RenameSessionModal";
import { VoiceInput } from "@/components/ui/VoiceInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  intent?: string;
  suggestions?: string[];
  attachments?: AttachmentInput[];
  metadata?: {
    executionTime?: number;
    confidence?: number;
    fileName?: string;
    mimeType?: string;
    [key: string]: unknown;
  };
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
  isSystem?: boolean;
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  lastMessage?: string;
  messageCount?: number;
}

// --- Component ---
export default function AIAgentChatPageV2() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<
    AttachmentInput[]
  >([]);
  const streamBufferRef = useRef("");
  const thinkingBufferRef = useRef("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(
    null
  );

  // Derive current session ID from URL
  const currentSessionId = searchParams.get("session");

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Helper: Format API messages to UI messages
  const formatMessages = useCallback(
    (
      apiMessages: ConversationMessage[] | Record<string, unknown>[]
    ): Message[] => {
      return apiMessages.map(
        (msg: ConversationMessage | Record<string, unknown>) => {
          const msgRecord = msg as Record<string, unknown>;
          const role =
            (msgRecord.role as string) ||
            ((msgRecord.sender === "user" ? "user" : "assistant") as string);
          const content =
            (msgRecord.content as string) ||
            (msgRecord.message as string) ||
            (msgRecord.text as string) ||
            "";
          const timestamp = msgRecord.timestamp
            ? new Date(msgRecord.timestamp as string | number | Date)
            : msgRecord.createdAt
            ? new Date(msgRecord.createdAt as string | number | Date)
            : new Date();

          return {
            id: (msgRecord.id as string) || Date.now().toString(),
            role: role as "user" | "assistant",
            content,
            agent:
              (msgRecord.agent as string) || (msgRecord.agentName as string),
            intent: msgRecord.intent as string,
            suggestions: (msgRecord.suggestions as string[]) || [],
            attachments:
              (msgRecord.attachments as AttachmentInput[]) ||
              (msgRecord.metadata &&
                ((msgRecord.metadata as Record<string, unknown>)
                  .attachments as AttachmentInput[])) ||
              [],
            metadata: msgRecord.metadata as Message["metadata"],
            timestamp,
          };
        }
      );
    },
    []
  );

  // Load conversation history
  const loadHistory = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      try {
        const history = await aiAgentAPI.getConversationHistory(sessionId);
        const historyObj = history as unknown as Record<string, unknown>;
        const messagesArray: ConversationMessage[] | Record<string, unknown>[] =
          Array.isArray(historyObj?.messages)
            ? (historyObj.messages as ConversationMessage[])
            : Array.isArray(history)
            ? (history as ConversationMessage[])
            : [];

        const formatted = formatMessages(messagesArray);
        setMessages(formatted);
      } catch (error) {
        console.error("Failed to load history:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [formatMessages]
  );

  // Initialize: Load Sessions & Handle URL Logic
  useEffect(() => {
    if (!isAuthenticated) return;

    const init = async () => {
      try {
        const sessionsData = await aiAgentAPI.getChatSessions(50);

        const formattedSessions: ChatSession[] = sessionsData.map((s) => {
          const sRecord = s as unknown as Record<string, unknown>;
          const title = (sRecord.title as string) || "New Conversation";

          return {
            id: (sRecord.id as string) || (sRecord.sessionId as string) || "",
            title,
            timestamp: new Date(
              (sRecord.updatedAt as string) ||
                (sRecord.lastMessageAt as string) ||
                (sRecord.createdAt as string) ||
                new Date().toISOString()
            ),
            lastMessage: sRecord.lastMessage as string,
            messageCount: sRecord.messageCount as number,
          };
        });

        setSessions(formattedSessions);

        if (currentSessionId) {
          await loadHistory(currentSessionId);
        } else if (formattedSessions.length > 0) {
          const mostRecent = formattedSessions[0];
          setSearchParams({ session: mostRecent.id });
          await loadHistory(mostRecent.id);
        } else {
          await handleCreateSession();
        }
      } catch (error) {
        console.error("Init failed:", error);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentSessionId]);

  const handleCreateSession = async () => {
    try {
      setIsLoading(true);
      const data = await aiAgentAPI.createChatSession();
      const newSessionId = data.sessionId;

      const newSession: ChatSession = {
        id: newSessionId,
        title: "New Conversation",
        timestamp: new Date(),
      };

      setSessions(updatedSessions);
      setMessages([]);
      setSearchParams({ session: newSessionId });

      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    try {
      await aiAgentAPI.renameChatSession(sessionId, newTitle);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
      );
    } catch (error) {
      console.error("Failed to rename session:", error);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    setSearchParams({ session: sessionId });
    loadHistory(sessionId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  // --- FIXED SEND MESSAGE LOGIC WITH THINKING DISPLAY ---
  const handleSendMessage = async (textOverride?: string) => {
    // 1. Determine message text
    const messageText = typeof textOverride === "string" ? textOverride : input;
    if (!messageText.trim() || !currentSessionId) return;

    // 2. Generate Unique IDs
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const botMsgId = `${timestamp}-bot-${randomSuffix}`;
    const thinkingMsgId = `${timestamp}-thinking-${randomSuffix}`;
    const userMsgId = `${timestamp}-user-${randomSuffix}`;

    // 3. Reset the stream buffers
    streamBufferRef.current = "";
    thinkingBufferRef.current = "";

    // 4. Add ONLY user message and thinking message
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: messageText,
      attachments: pendingAttachments,
      timestamp: new Date(),
    };

    // 5. Add thinking message
    const thinkingMsg: Message = {
      id: thinkingMsgId,
      role: "assistant",
      content: "",
      isThinking: true,
      isStreaming: true,
      timestamp: new Date(),
    };

    // DON'T add botMsg yet - only add thinking
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);

    setInput("");
    setIsLoading(true);

    try {
      await aiAgentAPI.sendChatMessageStream(
        currentSessionId,
        messageText,
        { attachments: pendingAttachments, searchEnabled: true },

        // --- ON CHUNK RECEIVED ---
        (chunkRaw: string) => {
          try {
            // Parse the chunk
            const chunkData = JSON.parse(chunkRaw);
            const chunkType = chunkData.type as string;

            if (chunkType === "thinking") {
              // Replace thinking content (not concatenate)
              const thinkingContent = chunkData.content as string;
              thinkingBufferRef.current = thinkingContent; // Replace, not append

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === thinkingMsgId
                    ? {
                        ...m,
                        content: thinkingBufferRef.current,
                        isThinking: true,
                      }
                    : m
                )
              );
            } else if (chunkType === "response") {
              // Create botMsg on first response chunk
              const responseContent = chunkData.content as string;
              streamBufferRef.current += responseContent;

              setMessages((prev) => {
                // Check if botMsg already exists
                const botMsgExists = prev.some((m) => m.id === botMsgId);

                if (!botMsgExists) {
                  // Add botMsg for the first time
                  const botMsg: Message = {
                    id: botMsgId,
                    role: "assistant",
                    content: streamBufferRef.current,
                    isStreaming: true,
                    suggestions: [],
                    timestamp: new Date(),
                  };
                  return [...prev, botMsg];
                } else {
                  // Update existing botMsg
                  return prev.map((m) =>
                    m.id === botMsgId
                      ? {
                          ...m,
                          content: streamBufferRef.current,
                          isStreaming: true,
                        }
                      : m
                  );
                }
              });
            } else if (chunkType === "complete") {
              // Handle complete - replace thinking with final response
              const completeContent = chunkData.content as string;
              const metadata = chunkData.metadata as Record<string, unknown>;

              // Update both messages: remove thinking, update bot with final content
              setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== thinkingMsgId); // Remove thinking message

                // Check if botMsg exists, if not create it
                const botMsgExists = filtered.some((m) => m.id === botMsgId);

                if (!botMsgExists) {
                  // Bot message doesn't exist yet, add it
                  const botMsg: Message = {
                    id: botMsgId,
                    role: "assistant",
                    content: completeContent,
                    isStreaming: false,
                    agent: metadata?.agent as string,
                    suggestions: (metadata?.suggestions as string[]) || [],
                    timestamp: new Date(),
                  };
                  return [...filtered, botMsg];
                } else {
                  // Update existing bot message
                  return filtered.map((m) => {
                    if (m.id === botMsgId) {
                      return {
                        ...m,
                        isStreaming: false,
                        content: completeContent,
                        isThinking: false,
                        agent: metadata?.agent as string,
                        suggestions: (metadata?.suggestions as string[]) || [],
                      };
                    }
                    return m;
                  });
                }
              });
            }
          } catch (e) {
            console.warn("Chunk parse error:", e);
          }
        },

        // --- ON COMPLETE ---
        (_fullMessageRaw: string, metadata?: Record<string, unknown>) => {
          // Final cleanup - ensure thinking is gone and response is finalized
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== thinkingMsgId); // Remove thinking

            const botMsgExists = filtered.some((m) => m.id === botMsgId);

            if (!botMsgExists) {
              // Add bot message if it doesn't exist
              const botMsg: Message = {
                id: botMsgId,
                role: "assistant",
                content: streamBufferRef.current,
                isStreaming: false,
                agent: metadata?.agent as string | undefined,
                suggestions: (metadata?.suggestions as string[]) || [],
                timestamp: new Date(),
              };
              return [...filtered, botMsg];
            } else {
              // Update existing
              return filtered.map((m) => {
                if (m.id === botMsgId) {
                  return {
                    ...m,
                    isStreaming: false,
                    content: streamBufferRef.current,
                    isThinking: false,
                    agent: metadata?.agent as string | undefined,
                    suggestions:
                      (metadata?.suggestions as string[]) || m.suggestions,
                  };
                }
                return m;
              });
            }
          });

          setIsLoading(false);
          setPendingAttachments([]);

          const currentSession = sessions.find(
            (s) => s.id === currentSessionId
          );
          const isDefaultTitle =
            !currentSession?.title ||
            currentSession.title === "New Conversation" ||
            currentSession.title.startsWith("Session ");
          if (isDefaultTitle) {
            const newTitle =
              messageText.slice(0, 30) + (messageText.length > 30 ? "..." : "");

            handleRenameSession(currentSessionId!, newTitle);
          }
        },

        // --- ON ERROR ---
        (error: Error) => {
          console.error(error);
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== thinkingMsgId); // Remove thinking on error

            const botMsgExists = filtered.some((m) => m.id === botMsgId);

            if (!botMsgExists) {
              // Add error message
              const botMsg: Message = {
                id: botMsgId,
                role: "assistant",
                content:
                  streamBufferRef.current || "Error generating response.",
                isStreaming: false,
                isError: true,
                timestamp: new Date(),
              };
              return [...filtered, botMsg];
            } else {
              return filtered.map((m) => {
                if (m.id === botMsgId) {
                  return {
                    ...m,
                    isStreaming: false,
                    isError: true,
                    content:
                      streamBufferRef.current || "Error generating response.",
                  };
                }
                return m;
              });
            }
          });
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Setup error", error);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== thinkingMsgId); // Remove thinking on setup error

        const botMsgExists = filtered.some((m) => m.id === botMsgId);

        if (!botMsgExists) {
          const botMsg: Message = {
            id: botMsgId,
            role: "assistant",
            content: "Failed to send message.",
            isStreaming: false,
            isError: true,
            timestamp: new Date(),
          };
          return [...filtered, botMsg];
        } else {
          return filtered.map((m) => {
            if (m.id === botMsgId) {
              return {
                ...m,
                isStreaming: false,
                isError: true,
                content: "Failed to send message.",
              };
            }
            return m;
          });
        }
      });
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSessionId) return;

    setIsLoading(true);
    try {
      const attachment = await aiAgentAPI.uploadAttachment(file);
      setPendingAttachments((prev) => [...prev, attachment]);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          content: `📎 Attached: ${file.name}`,
          timestamp: new Date(),
          metadata: { fileName: file.name, mimeType: file.type },
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openRenameModal = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setSessionToRename(session);
    setIsRenameModalOpen(true);
  };

  const renderAgentBadge = (agentName?: string, intent?: string) => {
    if (!agentName) return null;

    const getColors = (name: string) => {
      if (name.includes("Job"))
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      if (name.includes("Analysis"))
        return "bg-purple-100 text-purple-700 border-purple-200";
      return "bg-blue-50 text-blue-700 border-blue-200";
    };

    return (
      <div className="flex items-center gap-2 mb-2">
        <Badge
          className={cn(
            "text-[10px] uppercase tracking-wider font-bold",
            getColors(agentName)
          )}
        >
          {agentName}
        </Badge>
        {intent && (
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
            <BrainCircuit className="w-3 h-3" />
            {intent.replace("_", " ")}
          </span>
        )}
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div className="h-full overflow-hidden bg-[#F8F9FB] flex flex-col">
      {sessionToRename && (
        <RenameSessionModal
          isOpen={isRenameModalOpen}
          onClose={() => {
            setIsRenameModalOpen(false);
            setSessionToRename(null);
          }}
          currentTitle={sessionToRename.title}
          onConfirm={(newTitle) =>
            handleRenameSession(sessionToRename.id, newTitle)
          }
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm ">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0EA5E9] rounded-lg flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 text-lg">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex gap-6 overflow-hidden min-h-0">
        {/* Left Column: Sessions List */}
        <div
          className={cn(
            "w-full lg:w-[400px] flex-col bg-white rounded-xl border border-gray-200 shadow-sm flex-shrink-0 transition-all duration-300",
            !isSidebarOpen ? "hidden" : "hidden lg:flex"
          )}
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">
              {sessions.length}{" "}
              {sessions.length === 1 ? "Conversation" : "Conversations"}
            </span>
            <Button
              onClick={handleCreateSession}
              className="h-8 px-3 text-xs font-bold bg-[#0EA5E9] hover:bg-[#0284c7] text-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              New
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl mb-2 transition-all border",
                  currentSessionId === session.id
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare
                    className={cn(
                      "w-4 h-4 mt-0.5 flex-shrink-0",
                      currentSessionId === session.id
                        ? "text-[#0EA5E9]"
                        : "text-gray-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-bold text-sm mb-1 truncate",
                        currentSessionId === session.id
                          ? "text-[#0EA5E9]"
                          : "text-gray-900"
                      )}
                    >
                      {session.title}
                    </div>
                    {session.lastMessage && (
                      <div className="text-xs text-gray-500 truncate mb-1">
                        {session.lastMessage}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400">
                      {session.timestamp.toLocaleDateString()} •{" "}
                      {session.messageCount || 0} messages
                    </div>
                  </div>
                  {/* Rename Button Here */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-[#0EA5E9] hover:bg-blue-50"
                      onClick={(e) => openRenameModal(e, session)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </button>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">
                No conversations yet. Create a new chat to get started.
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden h-screen"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed left-0 top-[4.5rem] w-[400px] min-h-0 z-30 lg:hidden bg-white border-r border-gray-200 shadow-lg flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                Conversations
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <Button
                onClick={handleCreateSession}
                className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    handleSelectSession(session.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl mb-2 transition-all border",
                    currentSessionId === session.id
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm mb-1 truncate">
                        {session.title}
                      </div>
                      {session.lastMessage && (
                        <div className="text-xs text-gray-500 truncate">
                          {session.lastMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right Column: Chat Area */}
        <div className="flex flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex-col min-w-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-2 lg:px-6 py-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0EA5E9] to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  How can I help you today?
                </h2>
                <p className="text-gray-500 max-w-2xl mb-10 text-base">
                  Ask about job opportunities, get your CV analyzed, or request
                  career strategy advice.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                  {[
                    {
                      icon: <Briefcase className="w-5 h-5" />,
                      text: "Find Senior React jobs in NY",
                      prompt:
                        "I'm looking for senior React developer jobs in New York",
                    },
                    {
                      icon: <FileText className="w-5 h-5" />,
                      text: "Analyze my resume",
                      prompt: "Can you analyze my CV and suggest improvements?",
                    },
                    {
                      icon: <DollarSign className="w-5 h-5" />,
                      text: "Compare job offers",
                      prompt: "Help me compare these job offers",
                    },
                    {
                      icon: <BrainCircuit className="w-5 h-5" />,
                      text: "Career path advice",
                      prompt: "What skills should I learn next for my career?",
                    },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(item.prompt);
                        textareaRef.current?.focus();
                      }}
                      className="p-5 bg-white border border-gray-200 hover:border-[#0EA5E9] hover:shadow-md rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-[#0EA5E9] group-hover:bg-blue-100 transition-colors">
                          {item.icon}
                        </div>
                        <span className="font-bold text-sm text-gray-900 group-hover:text-[#0EA5E9] transition-colors">
                          {item.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-4",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* Avatar - ONLY show if not thinking, or if thinking (brain icon) */}
                    {msg.role === "assistant" && msg.isThinking && (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1 bg-gradient-to-br from-amber-500 to-orange-500 animate-pulse">
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                    )}

                    {msg.role === "assistant" && !msg.isThinking && (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1 bg-gradient-to-br from-[#0EA5E9] to-blue-600">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}

                    {/* Thinking Message - ONLY show if thinking with smooth fade out */}
                    {msg.isThinking && (
                      <div
                        className={cn(
                          "flex flex-col max-w-[85%] lg:max-w-[75%] items-start transition-all duration-300",
                          msg.isStreaming
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none hidden"
                        )}
                      >
                        <div className="relative px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-amber-50 text-amber-900 border border-amber-100 rounded-tl-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                            <span className="text-xs font-semibold text-amber-700">
                              Thinking...
                            </span>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Bubble - ONLY show if NOT thinking with smooth fade in */}
                    {!msg.isThinking && msg.role === "assistant" && (
                      <div
                        className={cn(
                          "flex flex-col max-w-[85%] lg:max-w-[75%] transition-all duration-500",
                          !msg.isStreaming && msg.content
                            ? "opacity-100 animate-in fade-in slide-in-from-bottom-2"
                            : "opacity-100"
                        )}
                      >
                        {/* Agent Badge */}
                        {renderAgentBadge(msg.agent, msg.intent)}

                        <div
                          className={cn(
                            "relative px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.isError
                              ? "bg-red-50 text-red-800 border border-red-100 rounded-tl-sm"
                              : "bg-gray-50 text-gray-900 border border-gray-100 rounded-tl-sm"
                          )}
                        >
                          {msg.content?.trim() ? (
                            // Markdown for response
                            <Markdown
                              content={msg.content}
                              className="prose-sm prose-blue max-w-none"
                            />
                          ) : msg.isStreaming ? (
                            // Only show loading dots if still streaming
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                              <span>Generating...</span>
                            </div>
                          ) : null}

                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {msg.attachments.map((att, i) => (
                                <a
                                  key={i}
                                  href={att.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 transition"
                                >
                                  📎 {att.name || att.url}
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Media Metadata */}
                          {msg.metadata?.fileName && (
                            <div className="mt-3 flex items-center gap-2 p-2 bg-black/5 rounded-lg text-xs">
                              {msg.metadata.mimeType?.includes("image") ? (
                                <ImageIcon className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {msg.metadata.fileName}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Copy Button - only for non-thinking responses */}
                        {!msg.isError && msg.content && (
                          <button
                            onClick={() => copyToClipboard(msg.content, idx)}
                            className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors px-2"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-green-500" />{" "}
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy
                              </>
                            )}
                          </button>
                        )}

                        {/* Suggestions Chips - only for non-thinking responses */}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-300">
                            {msg.suggestions.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setInput(s);
                                  textareaRef.current?.focus();
                                }}
                                className="px-4 py-2 bg-white border border-[#0EA5E9] text-[#0EA5E9] text-xs font-bold rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-colors flex items-center gap-1 shadow-sm"
                              >
                                {s}{" "}
                                <ChevronRight className="w-3 h-3 opacity-50" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="mt-1 text-[10px] text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {msg.metadata?.executionTime && (
                            <span> • {msg.metadata.executionTime}ms</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User Message Bubble */}
                    {msg.role === "user" && (
                      <>
                        <div className="flex flex-col max-w-[85%] lg:max-w-[75%] items-end">
                          <div className="relative px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-[#0EA5E9] text-white rounded-tr-sm">
                            <div className="whitespace-pre-wrap">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-300 mt-1">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <div ref={scrollRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="pt-2 px-2 lg:px-6 bg-white border-t border-gray-100">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-end gap-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#0EA5E9] transition-all shadow-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message AI Assistant..."
                  rows={1}
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-2 text-sm text-gray-900 placeholder-gray-400 max-h-[200px] custom-scrollbar"
                  disabled={isLoading}
                />
{/* 2. Add the VoiceInput component */}
  <VoiceInput 
    onTranscript={(text) => setInput(text)} 
    disabled={isLoading}
  />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-2.5 rounded-xl transition-all duration-200 flex-shrink-0",
                    input.trim() && !isLoading
                      ? "bg-[#0EA5E9] text-white shadow-md hover:bg-[#0284c7]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {pendingAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">
                  {pendingAttachments.map((att, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full"
                    >
                      📎 {att.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
