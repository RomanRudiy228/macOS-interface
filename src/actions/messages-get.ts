"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import type { Tables } from "@/supabase/types/database.types";

type Message = Tables<"messages">;

export interface MessageWithProfile extends Message {
  senderProfile: {
    username: string;
    avatar_url: string | null;
  };
}

export async function getMessages(
  conversationId: string,
  limit: number = 50
): Promise<MessageWithProfile[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    if (!messages || messages.length === 0) {
      return [];
    }

    // Get sender profiles
    const senderIds = [...new Set(messages.map((m) => m.sender_id))];

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", senderIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
      return messages.map((msg) => ({
        ...msg,
        senderProfile: {
          username: "Unknown",
          avatar_url: null,
        },
      }));
    }

    // Map profiles to messages
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    return messages.map((msg): MessageWithProfile => {
      const profile = profileMap.get(msg.sender_id);
      return {
        ...msg,
        senderProfile: {
          username: profile?.username || "Unknown",
          avatar_url: profile?.avatar_url || null,
        },
      };
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<MessageWithProfile | null> {
  try {
    if (!content.trim()) {
      throw new Error("Message cannot be empty");
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

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      throw new Error("Conversation not found");
    }

    if (
      conversation.participant_1_id !== user.id &&
      conversation.participant_2_id !== user.id
    ) {
      throw new Error("Not a participant in this conversation");
    }

    // Insert message
    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error sending message:", insertError);
      throw insertError;
    }

    // Get sender profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching sender profile:", profileError);
    }

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return {
      ...message,
      senderProfile: {
        username: profile?.username || "Unknown",
        avatar_url: profile?.avatar_url || null,
      },
    };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
}

export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // Verify the user is the sender
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", messageId)
      .single();

    if (fetchError || !message) {
      throw new Error("Message not found");
    }

    if (message.sender_id !== user.id) {
      throw new Error("Can only delete your own messages");
    }

    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (deleteError) {
      throw deleteError;
    }
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    throw error;
  }
}
