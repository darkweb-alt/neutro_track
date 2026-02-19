
import React, { useState, useRef, useEffect } from 'react';
import { getNutritionAdvice } from '../services/geminiService';
import { UserProfile } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  profile: UserProfile;
}

const ChatBot: React.FC<ChatBotProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi ${profile.name}! I'm your NutriLens assistant. Ask me anything about calories, recipes, or nutrition advice!` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    // Format history for Gemini API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getNutritionAdvice(userMessage, profile, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm sorry, I couldn't process that. Can you ask about something food-related?" }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fadeIn">
      {/* Header */}
      <div className="p-6 pb-2 shrink-0">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Nutritionist</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Ask me about your food & calories</p>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-sm font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-br-none' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] rounded-bl-none p-4 text-slate-400">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 pb-10 bg-slate-50 dark:bg-slate-950 shrink-0">
        <form 
          onSubmit={handleSend}
          className="relative"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How many calories in a Masala Dosa?"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] pl-6 pr-14 py-4 font-bold text-slate-700 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </form>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-center mt-3">
          Powered by Gemini 3 Pro
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
