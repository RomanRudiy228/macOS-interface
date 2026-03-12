"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";

export const MessagesWindow: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    messages,
    isLoading,
    error,
    setSelectedConversationId,
    handleSendMessage,
    searchQuery,
    setSearchQuery,
    searchResults,
    showUserSearch,
    setShowUserSearch,
    openUserSearch,
    startConversation,
    currentUserId,
  } = useChat();

  const [messageInput, setMessageInput] = useState("");
  const [conversationSearchQuery, setConversationSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendClick = async () => {
    if (!messageInput.trim()) return;
    try {
      await handleSendMessage(messageInput);
      setMessageInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserProfile.username
      .toLowerCase()
      .includes(conversationSearchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7)
      return date.toLocaleDateString("uk-UA", { weekday: "short" });
    return date.toLocaleDateString("uk-UA");
  };

  const getAvatarInitial = (username: string) =>
    username.charAt(0).toUpperCase();
  const getAvatarColor = (username: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-orange-500",
      "bg-indigo-500",
    ];
    const hash =
      username.charCodeAt(0) + username.charCodeAt(username.length - 1);
    return colors[hash % colors.length];
  };

  const formatMessageTime = (value: string | null) => {
    if (!value) return "";
    return new Date(value).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full bg-white dark:bg-slate-800">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 dark:border-slate-600 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Messages
          </h1>
          <button
            onClick={openUserSearch}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title="Start new conversation"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        {!showUserSearch ? (
          <div className="p-3 border-b border-gray-200 dark:border-slate-600">
            <input
              type="text"
              placeholder="Search conversations"
              value={conversationSearchQuery}
              onChange={(e) => setConversationSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
        ) : (
          <div className="p-3 border-b border-gray-200 dark:border-slate-600">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
            <button
              onClick={() => setShowUserSearch(false)}
              className="mt-2 w-full px-3 py-1 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
            >
              ← Back to conversations
            </button>
          </div>
        )}

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {showUserSearch
            ? searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => startConversation(user.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 ${getAvatarColor(user.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3`}
                  >
                    {getAvatarInitial(user.username)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm">
                      {user.username}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))
            : filteredConversations.map((conv) => {
                const lastMessage =
                  conv.lastMessageContent ?? "No messages yet";
                const hasNew =
                  conv.lastMessageSenderId !== currentUserId &&
                  conv.lastMessageCreatedAt &&
                  (!conv.lastSeenAt ||
                    new Date(conv.lastMessageCreatedAt) >
                      new Date(conv.lastSeenAt));

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full flex items-center p-3 text-left transition-colors ${
                      selectedConversationId === conv.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                        : "hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 ${getAvatarColor(conv.otherUserProfile.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3`}
                    >
                      {getAvatarInitial(conv.otherUserProfile.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">
                          {conv.otherUserProfile.username}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-slate-400 ml-2 flex-shrink-0">
                          {formatTime(conv.updated_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                        {lastMessage}
                      </p>
                    </div>
                    {hasNew && (
                      <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                );
              })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 ${getAvatarColor(selectedConversation.otherUserProfile.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3`}
                >
                  {getAvatarInitial(
                    selectedConversation.otherUserProfile.username
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-slate-100">
                    {selectedConversation.otherUserProfile.username}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {selectedConversation.otherUserProfile.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-slate-400">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage =
                    currentUserId != null && msg.sender_id === currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p
                          className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500 dark:text-slate-400"} mt-1`}
                        >
                          {formatMessageTime(msg.created_at as string | null)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-600">
              {error && (
                <div className="mb-2 text-xs text-red-500 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleSendClick}
                  disabled={!messageInput.trim() || isLoading}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.99 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.01298827 C3.34915502,-0.1 2.40734225,0.0570974071 1.77946707,0.4283718264 C0.994623095,1.05701895 0.837654326,2.00848975 1.15159189,2.95011527 L3.03521743,9.39237306 C3.03521743,9.54947052 3.19218622,9.70656798 3.50612381,9.70656798 L16.6915026,10.4920549 C16.6915026,10.4920549 17.1624089,10.4920549 17.1624089,9.98090862 L17.1624089,11.4772061 C17.1624089,11.9485983 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-slate-400">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
