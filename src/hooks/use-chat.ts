import { useEffect, useState } from "react";
import {
  getConversations,
  getOrCreateConversation,
  type ConversationWithUser,
} from "@/actions/conversations-get";
import { getMessages, sendMessage, type MessageWithProfile } from "@/actions/messages-get";
import { searchUsers, getAllUsers, type UserProfile } from "@/actions/users-search";
import { createClient } from "@/supabase/client";

export function useChat() {
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Realtime subscription for conversations
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          // Reload conversations when any conversation is updated
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Realtime subscription for messages
  useEffect(() => {
    if (!selectedConversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${selectedConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        async (payload) => {
          // Fetch the new message with profile
          const { data: message, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Error fetching new message:', error);
            return;
          }

          // Get sender profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', message.sender_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          const messageWithProfile: MessageWithProfile = {
            ...message,
            senderProfile: {
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
            },
          };

          // Add new message to state
          setMessages(prev => [...prev, messageWithProfile]);

          // Reload conversations to update last message
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversationId]);

  // Search users as user types
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim()) {
        await handleUserSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const loadConversations = async () => {
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
  };

  const loadMessages = async (conversationId: string) => {
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
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) return;

    try {
      setError(null);
      const newMessage = await sendMessage(selectedConversationId, content);
      if (newMessage) {
        // Add the new message to state immediately
        setMessages(prev => [...prev, newMessage]);
        // Reload conversations to update "last message"
        await loadConversations();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  const handleUserSearch = async (query: string) => {
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
  };

  const startConversation = async (userId: string) => {
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
  };

  const openUserSearch = async () => {
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
  };

  return {
    conversations,
    selectedConversationId,
    messages,
    isLoading,
    error,
    setSelectedConversationId,
    handleSendMessage,
    startConversation,
    loadConversations,
    loadMessages,
    // User search
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showUserSearch,
    setShowUserSearch,
    openUserSearch,
  };
}
