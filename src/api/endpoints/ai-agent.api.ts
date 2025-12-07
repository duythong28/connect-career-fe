import axios from "../client";

const API_URL = "/ai-agent";

export interface CreateSessionResponse {
  sessionId: string;
}

export interface ChatMessage {
  message: string;
  agent?: string;
  suggestions?: string[];
}

export interface UploadFileResponse {
  success: boolean;
  message?: string;
}

export interface ChatSession {
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: string;
}

export interface ConversationHistory {
  messages: ConversationMessage[];
}

export const aiAgentAPI = {
  // Create a new chat session
  createChatSession: async (): Promise<CreateSessionResponse> => {
    const response = await axios.post(`${API_URL}/chats`);
    return response.data.data || response.data;
  },

  // Send a chat message
  sendChatMessage: async (
    sessionId: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<ChatMessage> => {
    const response = await axios.post(
      `${API_URL}/chats/${sessionId}/messages`,
      {
        message,
        metadata,
      }
    );
    return response.data.data || response.data;
  },

  sendChatMessageStream: async (
    sessionId: string,
    message: string,
    metadata: Record<string, any> | undefined,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: string, agent?: string, suggestions?: string[]) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/";
      const url = `${baseURL}${API_URL}/chats/${sessionId}/messages/stream`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Streaming error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullMessage = '';
      let agent: string | undefined;
      let suggestions: string[] | undefined;
      let chunkBuffer = ''; // Buffer chunks for batching
      let rafId: number | null = null;

      if (!reader) {
        throw new Error('No reader available');
      }

      // Function to flush buffered chunks
      const flushChunks = () => {
        if (chunkBuffer) {
          onChunk(chunkBuffer);
          chunkBuffer = '';
        }
        rafId = null;
      };

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Flush any remaining chunks
          if (chunkBuffer) {
            onChunk(chunkBuffer);
            chunkBuffer = '';
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              
              const data = JSON.parse(jsonStr);
              
              if (data.type === 'chunk' && data.content) {
                fullMessage += data.content;
                // Batch chunks together for smoother updates
                chunkBuffer += data.content;
                
                // Schedule update on next animation frame (batches multiple chunks)
                if (!rafId) {
                  rafId = requestAnimationFrame(flushChunks);
                }
              } else if (data.type === 'complete') {
                // Flush any pending chunks before completion
                if (chunkBuffer) {
                  onChunk(chunkBuffer);
                  chunkBuffer = '';
                }
                agent = data.agent;
                suggestions = data.suggestions;
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Streaming error');
              } else if (data.content) {
                fullMessage += data.content;
                chunkBuffer += data.content;
                if (!rafId) {
                  rafId = requestAnimationFrame(flushChunks);
                }
              }
            } catch (e) {
              if (line.trim() && !line.startsWith('data:')) {
                fullMessage += line;
                chunkBuffer += line;
                if (!rafId) {
                  rafId = requestAnimationFrame(flushChunks);
                }
              }
            }
          } else if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.content) {
                fullMessage += data.content;
                chunkBuffer += data.content;
                if (!rafId) {
                  rafId = requestAnimationFrame(flushChunks);
                }
              }
            } catch {
              fullMessage += line;
              chunkBuffer += line;
              if (!rafId) {
                rafId = requestAnimationFrame(flushChunks);
              }
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim() && buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6).trim());
          if (data.type === 'complete') {
            agent = data.agent;
            suggestions = data.suggestions;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      onComplete(fullMessage, agent, suggestions);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  },
  // Upload a file for analysis
  uploadFile: async (
    sessionId: string,
    file: File,
    context?: string
  ): Promise<UploadFileResponse> => {
    // Convert file to base64
    const base64Content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(",")[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Determine file type
    const fileType = file.type || "application/octet-stream";
    const fileName = file.name;

    const response = await axios.post(
      `${API_URL}/chats/${sessionId}/media`,
      {
        content: base64Content,
        type: fileType,
        fileName: fileName,
        metadata: context ? { context } : undefined,
      }
    );
    return response.data.data || response.data;
  },

  // Get suggestions for a session
  getSuggestions: async (sessionId: string): Promise<string[]> => {
    const response = await axios.get(
      `${API_URL}/chats/${sessionId}/suggestions`
    );
    return response.data.data?.suggestions || response.data.suggestions || [];
  },

  // Get all chat sessions for the current user
  getChatSessions: async (limit: number = 50): Promise<ChatSession[]> => {
    const response = await axios.get(`${API_URL}/chats`, {
      params: { limit },
    });
    return response.data.data || response.data;
  },

  // Get conversation history for a specific session
  getConversationHistory: async (
    sessionId: string
  ): Promise<ConversationHistory> => {
    const response = await axios.get(
      `${API_URL}/chats/${sessionId}/history`
    );
    return response.data.data || response.data;
  },

  // Get recent conversations across all sessions
  getRecentConversations: async (
    limit: number = 20
  ): Promise<ConversationMessage[]> => {
    const response = await axios.get(`${API_URL}/chats/recent`, {
      params: { limit },
    });
    return response.data.data || response.data;
  },
};