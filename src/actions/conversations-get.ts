"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import type { Tables } from "@/supabase/types/database.types";

type Conversation = Tables<"conversations">;

export interface ConversationWithUser extends Conversation {
  otherUserProfile: {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  lastMessageContent: string | null;
}

export async function getConversations(): Promise<ConversationWithUser[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    // Get all conversations for the user
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`);

    if (error || !conversations) {
      console.error("Error fetching conversations:", error);
      return [];
    }

    // Fetch profiles for conversations
    const otherUserIds = conversations.map((conv) =>
      conv.participant_1_id === user.id
        ? conv.participant_2_id
        : conv.participant_1_id
    );

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, email, avatar_url")
      .in("id", otherUserIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
      return [];
    }

    const conversationIds = conversations.map((conv) => conv.id);
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("conversation_id, content, created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false });

    const lastMessageByConversation = new Map<string, string>();
    if (!messagesError && messages) {
      for (const message of messages as {
        conversation_id: string;
        content: string;
        created_at: string | null;
      }[]) {
        if (!lastMessageByConversation.has(message.conversation_id)) {
          lastMessageByConversation.set(
            message.conversation_id,
            message.content
          );
        }
      }
    } else if (messagesError) {
      console.error("Error fetching last messages:", messagesError);
    }

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    return conversations.map((conv): ConversationWithUser => {
      const otherUserId =
        conv.participant_1_id === user.id
          ? conv.participant_2_id
          : conv.participant_1_id;
      const profile = profileMap.get(otherUserId);

      return {
        ...conv,
        otherUserProfile: profile || {
          id: otherUserId,
          username: "Unknown",
          email: "unknown@example.com",
          avatar_url: null,
        },
        lastMessageContent: lastMessageByConversation.get(conv.id) ?? null,
      };
    });
  } catch (error) {
    console.error("Error in getConversations:", error);
    return [];
  }
}

export async function getOrCreateConversation(
  otherUserId: string
): Promise<Conversation> {
  try {
    if (!otherUserId || typeof otherUserId !== "string") {
      throw new Error("Invalid user ID");
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    if (user.id === otherUserId) {
      throw new Error("Cannot create conversation with yourself");
    }

    // Order IDs so smaller is first (for unique constraint)
    const [participant1, participant2] = [user.id, otherUserId].sort();

    // Try to get existing conversation
    const { data: existingConv, error: getError } = await supabase
      .from("conversations")
      .select("*")
      .eq("participant_1_id", participant1)
      .eq("participant_2_id", participant2)
      .maybeSingle();

    if (getError) {
      console.error("Error fetching conversation:", getError);
      throw getError;
    }

    if (existingConv) {
      return existingConv;
    }

    // Create new conversation
    const { data: newConv, error: createError } = await supabase
      .from("conversations")
      .insert({
        participant_1_id: participant1,
        participant_2_id: participant2,
      })
      .select()
      .single();

    if (createError) {
      const errorInfo = createError as unknown as Record<string, unknown>;
      console.error("Error creating conversation:", {
        message: createError.message,
        details: errorInfo.details,
      });
      throw createError;
    }

    if (!newConv) {
      throw new Error("Failed to create conversation");
    }

    return newConv;
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error("Error in getOrCreateConversation:", errorDetails);
    throw error;
  }
}
