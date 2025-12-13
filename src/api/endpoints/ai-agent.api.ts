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
        if (done) {
          break;
        }

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
            const { type, data } = event;
            const payload = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
            const nested = (payload.data && typeof payload.data === "object" ? payload.data : {}) as Record<string, unknown>;

            if (type === "chunk") {
              const content = (payload.content as string) || (nested.content as string);
              if (content) {
                fullMessage += content;
                onChunk(content);
              }
            } else if (type === "complete") {
              const metaSource = payload.metadata || payload || {};
              const meta = { ...(metaSource as Record<string, unknown>) };

              // Capture any final content sent on the complete event
              const completeContent =
                (payload.content as string) ||
                (nested.content as string);
              if (completeContent) {
                fullMessage += completeContent;
                onChunk(completeContent);
              }

              // Preserve suggestions/agent if they come top-level or nested
              const suggestions = (payload.suggestions as unknown) || (nested.suggestions as unknown);
              const agent = (payload.agent as unknown) || (nested.agent as unknown);
              if (suggestions && !(meta as Record<string, unknown>).suggestions) {
                (meta as Record<string, unknown>).suggestions = suggestions;
              }
              if (agent && !(meta as Record<string, unknown>).agent) {
                (meta as Record<string, unknown>).agent = agent;
              }

              finalMetadata = meta;
            } else if (type === "error") {
              throw new Error((payload.error as string) || "Streaming error");
            }
          } catch (e) {
            // Fallback: surface raw text even if JSON parse fails
            fullMessage += payloadStr;
            onChunk(payloadStr);
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
};