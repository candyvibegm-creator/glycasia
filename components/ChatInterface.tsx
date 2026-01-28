import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Message, MessageRole } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sessionId: string;
  systemInstruction?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, sessionId, systemInstruction }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Effects state
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<{id: number, left: number, emoji: string}[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, confetti]);

  // Magic Trigger Logic
  const triggerMagic = (text: string) => {
    const clean = text.trim().toLowerCase();
    
    if (clean === 'shake') {
      setActiveEffect('shake');
      setTimeout(() => setActiveEffect(null), 500);
    } 
    else if (clean === 'party' || clean === 'confetti') {
      const emojis = ['🎉', '✨', '🚀', '💎', '🔥', '🎈'];
      const newConfetti = Array.from({ length: 20 }).map((_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      }));
      setConfetti(newConfetti);
      setTimeout(() => setConfetti([]), 1000); // Clear after animation
    }
    else if (clean === 'glitch') {
      setActiveEffect('glitch');
      setTimeout(() => setActiveEffect(null), 2000);
    }
    else if (clean === 'spin') {
      setActiveEffect('spin');
      setTimeout(() => setActiveEffect(null), 1000);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check for magic prompts
    triggerMagic(input);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await sendMessageToGemini(history, userMsg.content, systemInstruction);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        content: "I'm sorry, I encountered an error connecting to the server. Please check your connection.",
        isError: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#0f1115] text-gray-100 relative transition-transform ${activeEffect === 'shake' ? 'animate-shake' : ''}`}>
      
      {/* Glitch Overlay */}
      {activeEffect === 'glitch' && (
        <div className="absolute inset-0 z-50 pointer-events-none bg-red-500/10 mix-blend-overlay animate-pulse" />
      )}

      {/* Confetti Layer */}
      {confetti.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {confetti.map((c) => (
            <div 
              key={c.id}
              className="absolute bottom-0 text-2xl animate-float-up"
              style={{ left: `${c.left}%`, animationDelay: `${Math.random() * 0.5}s` }}
            >
              {c.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Banner for Custom Instruction */}
      {systemInstruction && systemInstruction !== "You are Glucasia, a helpful, reasoning AI assistant created by Glucasia and 206. Be concise, accurate, and helpful." && (
        <div className="bg-blue-900/20 border-b border-blue-900/50 p-2 text-center text-xs text-blue-300 flex items-center justify-center gap-2 animate-slide-up-fade">
          <AlertCircle size={12} />
          Using custom system instructions
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth ${activeEffect === 'glitch' ? 'animate-glitch' : ''}`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 px-4 animate-pop-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-900/20 animate-pulse-slow">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Welcome to Glucasia</h2>
            <p className="max-w-md text-gray-400 text-sm md:text-base">
              I'm your AI assistant powered by advanced AI. Ask me anything, request image generation, or edit photos.
              <br/>
              <span className="text-xs text-gray-600 mt-2 block">Credits: Glucasia & 206</span>
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 md:gap-4 ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-slide-up-fade`}
            >
              {msg.role === MessageRole.MODEL && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center mt-1 shadow-lg shadow-purple-900/20 hover:scale-110 transition-transform">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 md:px-5 md:py-3 shadow-sm text-sm md:text-base ${
                  msg.role === MessageRole.USER
                    ? 'bg-[#2b2d31] text-white rounded-br-none shadow-md'
                    : 'bg-transparent text-gray-100 px-0 md:px-2' // Minimal style for AI like Gemini
                } ${msg.isError ? 'border border-red-500 bg-red-900/10' : ''}`}
              >
                 {msg.role === MessageRole.USER ? (
                   <div className="whitespace-pre-wrap">{msg.content}</div>
                 ) : (
                   <MarkdownRenderer content={msg.content} />
                 )}
              </div>

              {msg.role === MessageRole.USER && (
                <div className={`w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center mt-1 hover:scale-110 transition-transform ${activeEffect === 'spin' ? 'animate-spin-once' : ''}`}>
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 justify-start animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center mt-1 shadow-lg shadow-purple-900/20">
                  <Bot size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2 text-gray-400 mt-2">
              <Loader2 className="animate-spin w-4 h-4" />
              <span className="text-sm">Glucasia is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-[#0f1115] border-t md:border-t-0 border-gray-800 md:border-transparent z-10">
        <div className={`
          max-w-4xl mx-auto relative bg-[#1e1f24] rounded-3xl border border-gray-700 
          flex items-end px-4 py-3 shadow-lg transition-all duration-300
          ${input.length > 0 ? 'input-typing' : 'focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500'}
        `}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-100 placeholder-gray-500 resize-none max-h-32 overflow-y-auto py-1 text-base"
            rows={1}
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`
              ml-2 mb-0.5 p-2 rounded-full text-white transition-all duration-200
              ${input.length > 0 && !isLoading 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-blue-500/20 hover:scale-110 active:scale-95' 
                : 'bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:scale-100'}
            `}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] md:text-xs text-gray-600 mt-3 animate-fade-in">
          Glucasia may display inaccurate info, including about people, so double-check its responses.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;