import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Menu,
  Plus,
  Loader2,
  Paperclip,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { aiAgentAPI, ConversationMessage } from "@/api/endpoints/ai-agent.api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";

// --- Types ---
interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  suggestions?: string[];
  timestamp: Date;
  isSystem?: boolean;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

// --- Component ---
export default function AIAgentChatPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Manage URL params
  
  // State
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Derive current session ID from URL to ensure persistence across refreshes
  const currentSessionId = searchParams.get("session");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Auth Check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 2. Scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 3. Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [inputMessage]);

  // --- Core Logic ---

  // Helper: Format API messages to UI messages
  const formatMessages = (apiMessages: ConversationMessage[] | Record<string, unknown>[]): Message[] => {
    return apiMessages.map((msg: ConversationMessage | Record<string, unknown>) => {
        const msgRecord = msg as Record<string, unknown>;
        const role = (msgRecord.role as string) || ((msgRecord.sender === 'user' ? 'user' : 'assistant') as string);
        const content = (msgRecord.content as string) || (msgRecord.message as string) || (msgRecord.text as string) || '';
        const timestamp = msgRecord.timestamp 
          ? new Date(msgRecord.timestamp as string | number | Date)
          : (msgRecord.createdAt ? new Date(msgRecord.createdAt as string | number | Date) : new Date());
        
        return {
          role: role as "user" | "assistant",
          content,
          agent: (msgRecord.agent as string) || (msgRecord.agentName as string),
          suggestions: (msgRecord.suggestions as string[]) || [],
          timestamp,
        };
    });
  };

  // Load a specific conversation's history
  const loadConversationHistory = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      const history = await aiAgentAPI.getConversationHistory(sessionId);
      
      let messagesArray: ConversationMessage[] | Record<string, unknown>[] = [];
      
      // Robust handling of backend response formats
      if (Array.isArray(history)) {
        messagesArray = history as ConversationMessage[];
      } else if (history && typeof history === 'object') {
        const historyObj = history as unknown as Record<string, unknown>;
        if ('messages' in historyObj && Array.isArray(historyObj.messages)) {
          messagesArray = historyObj.messages as ConversationMessage[];
        } else {
          messagesArray = [history as unknown as ConversationMessage]; // Treat as single message
        }
      }

      const formatted = formatMessages(messagesArray);
      setMessages(formatted);
    } catch (error) {
      console.error("Failed to load history:", error);
      // If 404, maybe the session ID in URL is invalid?
      setMessages([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize: Load Sessions List & Handle URL Logic
  useEffect(() => {
    if (!isAuthenticated) return;

    const init = async () => {
      try {
        const sessionsData = await aiAgentAPI.getChatSessions(50);
        
        // Map backend data to UI format
        const formattedSessions: ChatSession[] = sessionsData.map((s) => {
          const sRecord = s as unknown as Record<string, unknown>;
          const title = (sRecord.title as string) || "New Conversation";
          // Try to parse title from last message if title is missing
          if (!sRecord.title && sRecord.lastMessage) {
            try {
              JSON.parse(sRecord.lastMessage as string);
              // Fallback logic could go here if needed
            } catch {
              // Ignore parse errors
            }
          }

          return {
            id: (sRecord.sessionId as string) || (sRecord.id as string) || '',
            title,
            timestamp: new Date(
              (sRecord.lastMessageAt as string) || 
              (sRecord.createdAt as string) || 
              new Date().toISOString()
            ),
          };
        });

        setConversations(formattedSessions);

        // --- THE FIX FOR F5 ---
        if (currentSessionId) {
            // Case A: URL has an ID. Load it.
            await loadConversationHistory(currentSessionId);
        } else if (formattedSessions.length > 0) {
            // Case B: No URL ID, but history exists. Open the most recent one.
            const mostRecent = formattedSessions[0];
            setSearchParams({ session: mostRecent.id }); // This updates URL
            // No need to call loadHistory here, the dependency on currentSessionId will trigger the re-render or effect if split, 
            // but since we are inside init, we should just load it directly to be snappy.
            await loadConversationHistory(mostRecent.id);
        } else {
            // Case C: No URL ID, No history. Create New.
            await handleCreateSession(formattedSessions);
        }

      } catch (error) {
        console.error("Init failed:", error);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); 
  // ^ Note: Dependency array is intentional to run once on mount (or auth change)
  
  // We need a listener for when user clicks a sidebar item manually
  useEffect(() => {
    if (currentSessionId && conversations.length > 0) {
        // Only load if we haven't already (simple check to avoid double loading on mount)
        // For simplicity in this structure, relying on the user click to trigger load is safer
    }
  }, [currentSessionId, conversations.length]);


  const handleCreateSession = async (currentConversations = conversations) => {
    try {
      setIsLoading(true);
      const data = await aiAgentAPI.createChatSession();
      const newSessionId = data.sessionId;

      const newConv: ChatSession = {
        id: newSessionId,
        title: "New Conversation",
        timestamp: new Date(),
      };

      setConversations([newConv, ...currentConversations]);
      setMessages([]);
      
      // Update URL to the new session
      setSearchParams({ session: newSessionId });
      
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed create session:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    if (sessionId === currentSessionId) return; // Don't reload if already active
    setSearchParams({ session: sessionId });
    loadConversationHistory(sessionId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !currentSessionId || isLoading) return;

    const userInput = inputMessage;
    setInputMessage(""); // Clear immediately
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Optimistic UI Update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput, timestamp: new Date() },
      { role: "assistant", content: "", timestamp: new Date() } // Placeholder
    ]);

    setIsLoading(true);

    try {
      await aiAgentAPI.sendChatMessageStream(
        currentSessionId,
        userInput,
        undefined,
        (chunk: string) => {
          setMessages((prev) => {
            const newMsgs = [...prev];
            const last = newMsgs[newMsgs.length - 1];
            if (last && last.role === "assistant") {
              last.content += chunk;
            }
            return newMsgs;
          });
        },
        (fullMessage, agent, suggestions) => {
            setMessages((prev) => {
                const newMsgs = [...prev];
                const last = newMsgs[newMsgs.length - 1];
                if (last && last.role === "assistant") {
                  last.content = fullMessage;
                  last.agent = agent;
                  last.suggestions = suggestions;
              }
              return newMsgs;
            });
            setIsLoading(false);
            refreshTitleIfNew(userInput, currentSessionId);
        },
        (error) => {
             console.error(error);
             handleMessageError();
        }
      );
    } catch (error) {
      handleMessageError();
    }
  };

  const handleMessageError = () => {
    setMessages((prev) => {
        const newMsgs = [...prev];
        const last = newMsgs[newMsgs.length - 1];
        // Add null check
        if (last && last.role === "assistant") {
            last.content = "Sorry, I encountered an error processing your request.";
            last.error = true;
        }
        return newMsgs;
    });
    setIsLoading(false);
  };

  // Helper to update title locally after first message
  const refreshTitleIfNew = (firstMessage: string, sessionId: string) => {
      setConversations(prev => prev.map(c => {
          if (c.id === sessionId && c.title === "New Conversation") {
              return { ...c, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "") };
          }
          return c;
      }));
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSessionId) return;

    setIsLoading(true);
    try {
      const data = await aiAgentAPI.uploadFile(currentSessionId, file, "User uploaded file");
      
      // Add system message
      setMessages(prev => [
          ...prev, 
          { role: "user", content: `📎 Uploaded: ${file.name}`, isSystem: true, timestamp: new Date() },
          { role: "assistant", content: data.success ? "File received. Analyzing..." : "Upload failed.", timestamp: new Date() }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isAuthenticated) return null;

  // --- Render Helpers ---
  const EmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">How can I help you today?</h1>
        <p className="text-gray-500 mb-10 max-w-2xl text-base sm:text-lg">
            Ready to assist with code, analysis, or creative writing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl xl:max-w-6xl w-full">
            {[
                { label: "Analyze my CV", prompt: "Can you analyze my CV and suggest improvements?" },
                { label: "Write a React component", prompt: "Write a responsive React card component" },
            ].map((item, i) => (
                <button
                    key={i}
                    onClick={() => { setInputMessage(item.prompt); textareaRef.current?.focus(); }}
                    className="p-4 bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md rounded-xl text-left transition-all text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                    {item.label}
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans flex flex-col w-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 h-16 flex items-center shadow-sm w-full">
        <div className="flex items-center gap-3 w-full">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">AI Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">Beta</span>
            </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] w-full p-2 sm:p-4 gap-2 sm:gap-4">
        
        {/* Sidebar */}
        <aside className={cn(
            "flex flex-col bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0",
            isSidebarOpen ? "w-[260px] sm:w-[280px] translate-x-0" : "w-0 opacity-0 border-0 p-0 pointer-events-none hidden lg:block"
        )}>
            <div className="p-4 border-b border-gray-100">
                <Button onClick={() => handleCreateSession()} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> New Chat
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {conversations.map((conv) => (
                    <button
                        key={conv.id}
                        onClick={() => handleSelectSession(conv.id)}
                        className={cn(
                            "w-full text-left px-3 py-3 rounded-xl text-sm mb-1 flex items-center gap-3 transition-all",
                            currentSessionId === conv.id 
                                ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100" 
                                : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                        <span className="truncate">{conv.title}</span>
                    </button>
                ))}
            </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
                {messages.length === 0 ? <EmptyState /> : (
                    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto space-y-6 pb-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                
                                <div className={cn("flex flex-col max-w-[90%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%]", msg.role === "user" ? "items-end" : "items-start")}>
                                    {msg.agent && <span className="text-xs font-semibold text-blue-600 mb-1 ml-1">{msg.agent}</span>}
                                    
                                    <div className={cn(
                                        "px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm",
                                        msg.role === "user" 
                                            ? "bg-blue-600 text-white rounded-tr-sm" 
                                            : msg.isSystem 
                                                ? "bg-gray-100 text-gray-500 italic border border-gray-200" 
                                                : "bg-gray-50 text-gray-900 rounded-tl-sm"
                                    )}>
                                        {msg.role === "assistant" && !msg.isSystem ? (
                                            <Markdown content={msg.content} className="prose-sm sm:prose-base prose-blue max-w-none" />
                                        ) : (
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        )}
                                    </div>

                                    {/* Tools: Copy / Suggestions */}
                                    {msg.role === "assistant" && !msg.error && !msg.isSystem && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <button onClick={() => copyToClipboard(msg.content, idx)} className="self-start flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors px-2">
                                                {copiedIndex === idx ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                {copiedIndex === idx ? "Copied" : "Copy"}
                                            </button>
                                            
                                            {msg.suggestions?.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.suggestions.map((s, i) => (
                                                        <button 
                                                            key={i} 
                                                            onClick={() => { setInputMessage(s); textareaRef.current?.focus(); }}
                                                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                             <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex items-center gap-1 pt-3">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                </div>
                             </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 lg:p-8 bg-white border-t border-gray-100">
                <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative">
                     <form onSubmit={sendMessage} className="flex items-end gap-2 bg-gray-50 border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 rounded-2xl p-2 transition-all shadow-inner">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        
                        <textarea
                            ref={textareaRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-gray-900 placeholder:text-gray-400 max-h-[200px]"
                            rows={1}
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            className={cn(
                                "p-2.5 rounded-xl transition-all flex-shrink-0",
                                inputMessage.trim() && !isLoading 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105" 
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                     </form>
                     <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">AI can make mistakes. Verify important info.</p>
                </div>
            </div>
        </section>
      </main>

      <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx" />
    </div>
  );
}