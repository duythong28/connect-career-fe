import RetellWebClient from 'retell-sdk';
import { RegisterCallRequest } from '../types/ai-mock-interview.types';
import { aiMockInterviewAPI } from '../endpoints/ai-mock-interview.api';

export class RetellCallClient {
    private client: RetellWebClient | null = null;
    private callId: string | null = null;
    private onTranscriptUpdate?: (transcript: { role: 'agent' | 'user'; content: string }) => void;
    private onCallEnded?: () => void;
    private onError?: (error: Error) => void;
  
    constructor(
      callId: string,
      accessToken: string,
      callbacks?: {
        onTranscriptUpdate?: (transcript: { role: 'agent' | 'user'; content: string }) => void;
        onCallEnded?: () => void;
        onError?: (error: Error) => void;
      }
    ) {
      this.callId = callId;
      this.onTranscriptUpdate = callbacks?.onTranscriptUpdate;
      this.onCallEnded = callbacks?.onCallEnded;
      this.onError = callbacks?.onError;
  
      // Create RetellWebClient with proper configuration
      this.client = new RetellWebClient({
        accessToken: accessToken,
        callId: callId,
      });
  
      this.setupEventHandlers();
    }
  
    private setupEventHandlers() {
      if (!this.client) return;
  
      // Call lifecycle events
      this.client.on('conversation-started', () => {
        console.log('Conversation started');
      });
  
      this.client.on('conversation-ended', () => {
        console.log('Conversation ended');
        this.onCallEnded?.();
      });
  
      // Error handling
      this.client.on('error', (error: Error) => {
        console.error('Call error:', error);
        this.onError?.(error);
      });
  
      // Real-time updates (transcript, events, etc.)
      this.client.on('update', (update: any) => {
        console.log('Update received:', update);
        
        // Handle transcript updates
        // Retell SDK can send transcript in different formats:
        // 1. As an object: { role: 'agent' | 'user', content: string }
        // 2. As an array: [{ role: 'agent', content: '...' }, ...]
        if (update.transcript) {
          if (Array.isArray(update.transcript)) {
            // If transcript is an array, get the latest entry
            const transcripts = update.transcript;
            if (transcripts.length > 0) {
              const latest = transcripts[transcripts.length - 1];
              this.onTranscriptUpdate?.(latest as { role: 'agent' | 'user'; content: string });
            }
          } else if (update.transcript.role && update.transcript.content) {
            // If transcript is an object
            this.onTranscriptUpdate?.(update.transcript as { role: 'agent' | 'user'; content: string });
          }
        }
        
        // Handle other update types
        if (update.event) {
          if (update.event === 'agent_speaking' || update.event === 'agent_start_talking') {
            console.log('Agent started talking');
          } else if (update.event === 'agent_stop_talking') {
            console.log('Agent stopped talking');
          } else if (update.event === 'user_speaking' || update.event === 'user_start_talking') {
            console.log('User started talking');
          }
        }
      });
  
      // Metadata updates
      this.client.on('metadata', (metadata: any) => {
        console.log('Call metadata:', metadata);
      });
    }
  
    async start(): Promise<void> {
      if (!this.client) {
        throw new Error('Client not initialized');
      }
      try {
        await this.client.start();
        console.log('Retell client started successfully');
      } catch (error) {
        console.error('Error starting Retell client:', error);
        throw error;
      }
    }
  
    async stop(): Promise<void> {
      if (this.client) {
        try {
          await this.client.stop();
          console.log('Retell client stopped');
        } catch (error) {
          console.error('Error stopping Retell client:', error);
        } finally {
          this.client = null;
        }
      }
    }
  
    async mute(): Promise<void> {
      if (this.client) {
        try {
          await this.client.mute();
        } catch (error) {
          console.error('Error muting:', error);
          throw error;
        }
      }
    }
  
    async unmute(): Promise<void> {
      if (this.client) {
        try {
          await this.client.unmute();
        } catch (error) {
          console.error('Error unmuting:', error);
          throw error;
        }
      }
    }
  
    isActive(): boolean {
      return this.client !== null;
    }
  
    getCallId(): string | null {
      return this.callId;
    }
}

export async function startInterviewCall(
  registerCallData: RegisterCallRequest,
  callbacks?: {
    onTranscriptUpdate?: (transcript: { role: 'agent' | 'user'; content: string }) => void;
    onCallEnded?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<{ client: RetellCallClient; callId: string; responseId: string }> {
  try {
    console.log('Registering call with:', registerCallData);
    
    // 1. Register the call
    const registerResponse = await aiMockInterviewAPI.registerCall(registerCallData);
    
    console.log('Register call response:', registerResponse);
    
    if (!registerResponse.success || !registerResponse.data) {
      throw new Error('Failed to register call: ' + JSON.stringify(registerResponse));
    }

    const { callId, accessToken, responseId } = registerResponse.data;
    
    console.log('Received credentials:', { 
      callId, 
      accessToken: accessToken?.substring(0, 20) + '...', 
      responseId 
    });

    // 2. Request microphone permission before creating client
    try {
      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone permission error:', error);
      throw new Error('Microphone permission denied. Please allow microphone access to start the interview.');
    }

    // 3. Create the Retell client
    console.log('Creating Retell client...');
    const client = new RetellCallClient(callId, accessToken, callbacks);
    console.log('Retell client created');

    // 4. Start the call
    console.log('Starting Retell call...');
    await client.start();
    console.log('Retell call started successfully');

    return { client, callId, responseId };
  } catch (error) {
    console.error('Error starting interview call:', error);
    throw error;
  }
}