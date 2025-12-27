import axios from "../client";
import {
  createFileEntity,
  getSignUrl,
  uploadFile as persistUploadedFile,
} from "./files.api";

const API_URL = "/chat";

export interface CreateSessionResponse {
  sessionId: string;
}

export interface ChatMessage {
  message: string;
  agent?: string;
  suggestions?: string[];
}

export interface ChatSession {
  id: string;
  title?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  agent?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  attachments?: AttachmentInput[];
}

export interface ConversationHistory {
  messages: ConversationMessage[];
}

export interface AttachmentInput {
  type: string;
  name: string;
  mimeType: string;
  url: string;
}

export interface ChatRequestOptions {
  attachments?: AttachmentInput[];
  metadata?: Record<string, unknown>;
  searchEnabled?: boolean;
  clickedSuggestionId?: string | null;
  manualRetryAttempts?: number;
}

export const aiAgentAPI = {
  // Create a new chat session
  createChatSession: async (): Promise<CreateSessionResponse> => {
    const response = await axios.post(`${API_URL}/sessions`);
    const data = response.data?.data ?? response.data;
    return {
      sessionId: data?.sessionId || data?.id,
    };
  },

  // Stream a chat message (SSE)
  sendChatMessageStream: async (
    sessionId: string,
    content: string,
    options: ChatRequestOptions | undefined,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: string, metadata?: Record<string, unknown>) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      const baseURL =
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/").replace(
          /\/$/,
          ""
        );
      const url = `${baseURL}${API_URL}/sessions/${sessionId}/stream`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content,
          attachments: options?.attachments ?? [],
          metadata: options?.metadata ?? {},
          search_enabled: options?.searchEnabled ?? true,
          clicked_suggestion_id: options?.clickedSuggestionId ?? null,
          manual_retry_attempts: options?.manualRetryAttempts ?? 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullMessage = "";
      let finalMetadata: Record<string, unknown> | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          if (!line.startsWith("data:")) continue;

          const payloadStr = line.slice(5).trim();
          if (!payloadStr) continue;

          try {
            const event = JSON.parse(payloadStr);
            const eventType = event.type as string;

            if (eventType === "thinking") {
              // Handle thinking type - REPLACE (not concat)
              const thinkingContent = event.messages?.content as string;
              if (thinkingContent) {
                onChunk(JSON.stringify({
                  type: "thinking",
                  content: thinkingContent,
                  replace: true,
                }));
              }
            } else if (eventType === "chunk") {
              // Handle chunk type - array of messages
              const messages = (event.messages || []) as Record<string, unknown>[];
              
              for (const msg of messages) {
                const msgRecord = msg as Record<string, unknown>;
                const msgContent = msgRecord.content as string;
                const metadata = msgRecord.metadata as Record<string, unknown> || {};
                const isThinking = metadata.isThinking === true;

                if (msgContent) {
                  if (isThinking) {
                    // Thinking chunk - REPLACE (not concat)
                    onChunk(JSON.stringify({
                      type: "thinking",
                      content: msgContent,
                      replace: true,
                    }));
                  } else {
                    // Response chunk - append to response
                    fullMessage += msgContent;
                    onChunk(JSON.stringify({
                      type: "response",
                      content: msgContent,
                      replace: false,
                    }));
                  }
                }
              }
            } else if (eventType === "complete") {
              // Handle complete type - final response
              const completeContent = event.messages?.content as string;
              if (completeContent) {
                fullMessage = completeContent;
              }

              finalMetadata = (event.messages?.metadata as Record<string, unknown>) || event.metadata || {};

              // Emit complete marker
              onChunk(JSON.stringify({
                type: "complete",
                content: fullMessage,
                metadata: finalMetadata,
              }));
            } else if (eventType === "error") {
              throw new Error(event.data?.error as string || "Streaming error");
            }
          } catch (e) {
            console.error("Parse error:", e, "Line:", payloadStr);
            // Continue processing other lines
          }
        }
      }

      onComplete(fullMessage, finalMetadata);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  },

  // Get prompt suggestions
  getPromptSuggestions: async () => {
    const response = await axios.get(`${API_URL}/prompt-suggestions`);
    const data = response.data?.data ?? response.data;
    return data?.suggestions ?? data;
  },

  // Get all chat sessions (search endpoint)
  getChatSessions: async (
    limit: number = 50,
    offset: number = 0,
    searchTerm?: string
  ): Promise<ChatSession[]> => {
    const response = await axios.post(`${API_URL}/sessions/search`, {
      limit,
      offset,
      search_term: searchTerm,
    });
    const data = response.data?.data ?? response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.sessions)) return data.sessions;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  },

  // Get conversation history for a specific session
  getConversationHistory: async (
    sessionId: string
  ): Promise<ConversationHistory> => {
    const response = await axios.get(`${API_URL}/sessions/${sessionId}`);
    return response.data?.data ?? response.data;
  },

  // Upload a file and return attachment payload for chat
  uploadAttachment: async (
    file: File
  ): Promise<AttachmentInput> => {
    const signed = await getSignUrl();
    const uploadResult = await createFileEntity({
      signature: signed.signature,
      timestamp: signed.timestamp,
      cloud_name: signed.cloudName,
      api_key: signed.apiKey,
      public_id: signed.publicId,
      folder: signed.folder || "",
      resourceType: signed.resourceType || "",
      fileId: signed.fileId || "",
      file,
    });

    const persisted = await persistUploadedFile({
      fileId: signed.fileId,
      data: uploadResult,
    });

    return {
      type: "file",
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      url: persisted?.secureUrl || persisted?.url,
    } as AttachmentInput;
  },

  renameChatSession: async (
    sessionId: string,
    newTitle: string
  ): Promise<void> => {
    await axios.put(`${API_URL}/sessions/${sessionId}`, {
      title: newTitle,
    });
  },
};
