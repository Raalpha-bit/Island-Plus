'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Image as ImageIcon, Smile, Send, CheckCheck, MoreVertical, Loader2 } from 'lucide-react';
import { Api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [thread, setThread] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation lists
  const loadConversations = async () => {
    try {
      setIsLoadingChats(true);
      const data = await Api.get<any[]>('/messages');
      setConversations(data);
      if (data.length > 0 && !activeChat) {
        setActiveChat(data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setIsLoadingChats(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Fetch thread messages
  const loadThread = async (contactId: string) => {
    try {
      setIsLoadingThread(true);
      const data = await Api.get<any[]>(`/messages?userId=${contactId}`);
      setThread(data);
    } catch (err) {
      console.error('Failed to load message thread', err);
    } finally {
      setIsLoadingThread(false);
    }
  };

  useEffect(() => {
    if (activeChat) {
      loadThread(activeChat.contact.id);
    }
  }, [activeChat]);

  // Real-time messages subscription
  useEffect(() => {
    if (!activeChat || !user) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`chat_${activeChat.contact.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === activeChat.contact.id && newMsg.receiver_id === user.id) ||
            (newMsg.sender_id === user.id && newMsg.receiver_id === activeChat.contact.id)
          ) {
            setThread((prev) => {
              // Avoid duplicate if we just sent it
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const textToSend = messageText;
    setMessageText('');

    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        id: tempId,
        sender_id: user?.id,
        receiver_id: activeChat.contact.id,
        body: textToSend,
        created_at: new Date().toISOString(),
        is_read: false
      };
      setThread((prev) => [...prev, tempMsg]);

      const sentMsg = await Api.post<any>('/messages', {
        receiverId: activeChat.contact.id,
        text: textToSend
      });

      // Replace optimistic message with saved DB message
      setThread((prev) => prev.map((m) => (m.id === tempId ? sentMsg : m)));
      
      // Update last message in local conv lists
      setConversations(prev => prev.map(c => {
        if (c.contact.id === activeChat.contact.id) {
          return {
            ...c,
            lastMessage: {
              body: textToSend,
              createdAt: new Date().toISOString(),
              senderId: user?.id,
              isRead: false
            }
          };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4 md:gap-6">
      {/* Conversations List */}
      <div className="w-full md:w-80 flex flex-col glass-card rounded-2xl overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black-surface border border-black-border text-sm text-white placeholder:text-gray-500 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-purple-neon" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              No messages yet.
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.contact.id}
                onClick={() => setActiveChat(conv)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                  activeChat?.contact?.id === conv.contact.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={conv.contact.avatar} alt={conv.contact.displayName} className="w-12 h-12 rounded-full object-cover bg-black-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-white truncate">{conv.contact.displayName}</h3>
                    <span className="text-[10px] text-gray-500">
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{conv.lastMessage.body}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active Chat */}
      <div className="hidden md:flex flex-1 flex-col glass-card rounded-2xl overflow-hidden">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <img src={activeChat.contact.avatar} alt={activeChat.contact.displayName} className="w-10 h-10 rounded-full object-cover bg-black-surface" />
                <div>
                  <h3 className="text-sm font-bold text-white">{activeChat.contact.displayName}</h3>
                  <p className="text-xs text-gray-400">@{activeChat.contact.username}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingThread ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-neon" />
                </div>
              ) : (
                thread.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                          isMe
                            ? 'gradient-purple text-white rounded-br-sm'
                            : 'bg-black-surface text-gray-200 border border-white/5 rounded-bl-sm'
                        }`}
                      >
                        {msg.body}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-purple-neon" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black-surface/50">
              <div className="flex items-end gap-2">
                <button type="button" className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-black-surface border border-black-border text-sm text-white placeholder:text-gray-500 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 outline-none"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button type="submit" className="p-3 gradient-purple text-white rounded-xl hover:opacity-90 transition-all glow-purple cursor-pointer">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <p>Select a conversation or subscribe to a creator to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
