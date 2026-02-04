
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole, HoneyPotSession } from '../types';

interface ChatInterfaceProps {
  session: HoneyPotSession;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ session, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d10] border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div>
            <h3 className="font-semibold text-sm">Suspicious Interaction - {session.id.slice(0, 8)}</h3>
            <p className="text-xs text-zinc-500">Persona: {session.persona || 'Detecting...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 uppercase font-bold tracking-widest">
            {session.status}
           </span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm"
      >
        {session.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <p>Waiting for incoming scam message...</p>
            <p className="text-xs">(Mock Scammer API active)</p>
          </div>
        )}
        
        {session.messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex ${m.role === MessageRole.SCAMMER ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              m.role === MessageRole.SCAMMER 
                ? 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none' 
                : 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-tr-none'
            }`}>
              <div className="text-[10px] mb-1 opacity-50 uppercase tracking-tighter">
                {m.role === MessageRole.SCAMMER ? 'Incoming Message' : 'Honey-Pot Agent'}
              </div>
              <p className="leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-2xl rounded-tr-none animate-pulse">
              Agent is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/30 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Simulate Scammer message..."
            className="flex-1 bg-[#16161a] border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
