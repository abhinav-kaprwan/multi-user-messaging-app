import { InferSelectModel } from 'drizzle-orm';
import { conversations, users } from '@/db/schema';

export type User = InferSelectModel<typeof users>;


export type Message = {
    id: string;
    senderId: string;
    text: string;
    createdAt: Date;
    // Add other message properties as needed
  };
  
  export type Conversation = {
    id: string;
    // Add other conversation properties as needed
  };
  
  export type UserConversation = {
    userId: string;
    conversationId: string;
    // Add other userConversation properties as needed
  };
  
  export type SeenBy = {
    userId: string;
    messageId: string;
    // Add other seenBy properties as needed
  };
    export type ProcessedMessage = Message & {
    sender: User;
  };
  
  export type ProcessedConversation = {
    conversation: Conversation;
    userConversation: UserConversation;
    messages: ProcessedMessage[];
    seenBy: SeenBy[];
  };