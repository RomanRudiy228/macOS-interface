import type { Tables } from "@/supabase/types/database.types";

export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;

export interface ConversationWithUser extends Conversation {
  otherUserProfile: {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  lastMessageContent?: string | null;
  lastMessageSenderId?: string | null;
  lastMessageCreatedAt?: string | null;
  lastSeenAt?: string | number | null;
}

export interface MessageWithProfile extends Message {
  senderProfile: {
    username: string;
    avatar_url: string | null;
  };
}

export interface ChatState {
  conversations: ConversationWithUser[];
  selectedConversationId: string | null;
  messages: MessageWithProfile[];
  isLoading: boolean;
  error: string | null;
}
