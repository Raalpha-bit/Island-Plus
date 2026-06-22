'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Image as ImageIcon, Smile, Send, CheckCheck, MoreVertical } from 'lucide-react';
import { creators } from '@/lib/mock/creators';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(creators[0]);
  const [message, setMessage] = useState('');

  // Mock messages
  const messages = [
    { id: '1', sender: 'them', text: 'Hey there! Thanks for subscribing to the Gold tier 💛', time: '10:42 AM' },
    { id: '2', sender: 'them', text: 'Let me know what kind of exclusive content you want to see next!', time: '10:43 AM' },
    { id: '3', sender: 'me', text: 'Thanks! Really excited for the upcoming live stream.', time: '11:15 AM' },
    { id: '4', sender: 'them', text: 'It\'s going to be epic! I\'ll send out the private link an hour before we start.', time: '11:18 AM' },
  ];

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
          {creators.slice(0, 5).map((creator) => (
            <button
              key={creator.id}
              onClick={() => setActiveChat(creator)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                activeChat.id === creator.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <img src={creator.avatar} alt={creator.displayName} className="w-12 h-12 rounded-full object-cover" />
                {creator.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-black-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white truncate">{creator.displayName}</h3>
                  <span className="text-xs text-gray-500">11:18 AM</span>
                </div>
                <p className="text-xs text-gray-400 truncate">It's going to be epic! I'll send...</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Chat */}
      <div className="hidden md:flex flex-1 flex-col glass-card rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <img src={activeChat.avatar} alt={activeChat.displayName} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="text-sm font-bold text-white">{activeChat.displayName}</h3>
              <p className="text-xs text-gray-400">@{activeChat.username}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'me'
                    ? 'gradient-purple text-white rounded-br-sm'
                    : 'bg-black-surface text-gray-200 border border-white/5 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <span>{msg.time}</span>
                {msg.sender === 'me' && <CheckCheck className="w-3.5 h-3.5 text-purple-neon" />}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/5 bg-black-surface/50">
          <div className="flex items-end gap-2">
            <button className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
              <ImageIcon className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-black-surface border border-black-border text-sm text-white placeholder:text-gray-500 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 outline-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button className="p-3 gradient-purple text-white rounded-xl hover:opacity-90 transition-all glow-purple">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
