"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getConversations,
  getOrCreateConversation,
  type ConversationWithUser,
} from "@/actions/conversations-get";
import {
  getMessages,
  sendMessage,
  type MessageWithProfile,
} from "@/actions/messages-get";
import {
  searchUsers,
  getAllUsers,
  type UserProfile,
} from "@/actions/users-search";
import { createClient } from "@/supabase/client";
import { markConversationAsSeen } from "@/actions/mark-conversations-as-seen";

export function useChat() {
  const supabase = useMemo(() => createClient(), []);

  const [conversations, setConversations] = useState<ConversationWithUser[]>(
    []
  );
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load conversations";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setError(null);

      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load messages";
      setError(errorMessage);
      console.error(errorMessage);
    }
  }, []);

  const handleUserSearch = useCallback(async (query: string) => {
    try {
      setIsSearching(true);
      setError(null);

      if (query.trim()) {
        const results = await searchUsers(query);
        setSearchResults(results);
      } else {
        const results = await getAllUsers();
        setSearchResults(results);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search users";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const startConversation = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const conversation = await getOrCreateConversation(userId);

        setSelectedConversationId(conversation.id);

        await loadConversations();

        setShowUserSearch(false);
        setSearchQuery("");
        setSearchResults([]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start conversation";
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [loadConversations]
  );

  const openUserSearch = useCallback(async () => {
    try {
      setShowUserSearch(true);
      setSearchQuery("");

      const results = await getAllUsers();
      setSearchResults(results);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users";
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
      }
    });
  }, [supabase]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel("messages-global")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const message = payload.new;

          if (message.sender_id !== currentUserId) {
            await loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId, loadConversations]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const initConversation = async () => {
      await loadMessages(selectedConversationId);
      await markConversationAsSeen(selectedConversationId);
      await loadConversations();
    };

    initConversation();
  }, [selectedConversationId, loadMessages, loadConversations]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const channel = supabase
      .channel(`messages:${selectedConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        async (payload) => {
          const { data: message, error } = await supabase
            .from("messages")
            .select("*")
            .eq("id", payload.new.id)
            .single();

          if (error) {
            console.error("Error fetching message:", error);
            return;
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", message.sender_id)
            .single();

          const messageWithProfile: MessageWithProfile = {
            ...message,
            senderProfile: {
              username: profile?.username || "Unknown",
              avatar_url: profile?.avatar_url || null,
            },
          };

          setMessages((prev) => {
            const exists = prev.some((m) => m.id === messageWithProfile.id);
            if (exists) return prev;
            return [...prev, messageWithProfile];
          });

          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversationId, supabase, loadConversations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleUserSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleUserSearch]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) return;

    try {
      setError(null);
      await sendMessage(selectedConversationId, content);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  return {
    conversations,
    selectedConversationId,
    messages,
    isLoading,
    error,
    currentUserId,

    setSelectedConversationId,
    handleSendMessage,
    startConversation,

    loadConversations,
    loadMessages,

    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,

    showUserSearch,
    setShowUserSearch,
    openUserSearch,
  };
}
