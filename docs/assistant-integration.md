Here are cURL examples for the main chat endpoints (replace `{{BASE_URL}}` with your server, `{{TOKEN}}` with a valid Bearer JWT).

### 1) Create session

```bash
curl -X POST "{{BASE_URL}}/api/v1/chat/sessions" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json"
```

### 2) Search/list sessions (paginated)

```bash
curl -X POST "{{BASE_URL}}/api/v1/chat/sessions/search" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"limit":20,"offset":0,"search_term":"career"}'
```

### 3) Get session detail (with messages)

```bash
curl -X GET "{{BASE_URL}}/api/v1/chat/sessions/{{sessionId}}" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### 4) Share session

```bash
curl -X PUT "{{BASE_URL}}/api/v1/chat/sessions/{{sessionId}}/share" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### 5) Update session (title/metadata)

```bash
curl -X PUT "{{BASE_URL}}/api/v1/chat/sessions/{{sessionId}}" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"New title","metadata":{"foo":"bar"}}'
```

### 6) Delete session

```bash
curl -X DELETE "{{BASE_URL}}/api/v1/chat/sessions/{{sessionId}}" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### 7) Stream chat (SSE)

```bash
curl -N -X POST "{{BASE_URL}}/api/v1/chat/sessions/{{sessionId}}/stream" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hi, I need help with my CV",
    "attachments": [],
    "metadata": {},
    "search_enabled": true,
    "clicked_suggestion_id": null,
    "manual_retry_attempts": 0
  }'
```

- Uses `text/event-stream`; keep connection open; parse `data:` events.
- Response events include `chunk` (partial text) and a final `complete`.

### 9) Prompt suggestions

```bash
curl -X GET "{{BASE_URL}}/api/v1/chat/prompt-suggestions" \
  -H "Authorization: Bearer {{TOKEN}}"
```

Notes for frontend:

- Always include `Authorization: Bearer {{TOKEN}}`.
- SSE: use `EventSource`/`fetch` streaming; handle `data:` lines and final `complete`.
- Attachments: server expects URLs (not base64). Include in `attachments` array if needed.
- Retry: pass `manual_retry_attempts` if you implement retry UI.

// Auth
type AuthToken = string;

// Sessions
interface CreateSessionResponse {
statusCode: number;
message: string;
data: { sessionId: string };
}

interface SearchSessionsRequest {
limit?: number;
offset?: number;
search_term?: string;
}

interface ChatSession {
id: string;
title?: string;
metadata?: Record<string, any>;
createdAt: string;
updatedAt: string;
}

interface ChatSessionDetail extends ChatSession {
messages: Message[];
}

// Messages
type Role = 'user' | 'assistant' | 'system';

interface Message {
id: string;
sessionId: string;
role: Role;
content: string;
metadata?: Record<string, any>;
createdAt: string;
attachments?: Attachment[];
}

interface Attachment {
id?: string;
messageId?: string;
type: string;
name: string;
mimeType: string;
url: string;
processingResult?: {
extractedText?: string;
analysis?: any;
success: boolean;
error?: string;
};
}

// Chat request (stream)
interface ChatRequest {
content: string;
attachments?: AttachmentInput[];
metadata?: Record<string, any>;
search_enabled?: boolean;
clicked_suggestion_id?: string | null;
manual_retry_attempts?: number;
}

interface AttachmentInput {
type: string;
name: string;
mimeType: string;
url: string;
}

// Stream events
type StreamEvent =
| { type: 'chunk'; data: { content: string; isThinking?: boolean } }
| { type: 'complete'; data: { metadata?: Record<string, any> } }
| { type: 'error'; data: { error: string } };

// Prompt suggestions
interface PromptSuggestionResponse {
statusCode: number;
message: string;
data: {
group_suggestion_id: string;
suggestions: Array<{ suggestion_id: string; content: string; category?: string }>;
};
}
