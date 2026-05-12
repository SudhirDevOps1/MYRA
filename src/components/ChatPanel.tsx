import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatPanelProps {
  messages: ChatMessage[];
  className?: string;
  accentColor?: string;
  streamingText?: string;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPanel({ messages, className = '', accentColor = '#FF1744', streamingText }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  const read = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      ref={scrollRef}
      className={`overflow-y-auto space-y-3 px-3 py-2 ${className}`}
      style={{ height: 'clamp(180px, 28vh, 340px)', scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 && !streamingText && (
        <div className="flex items-center justify-center h-full">
          <p className="text-[#555555] text-sm font-mono">Tap karke bolo 💬</p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} group`}
        >
          {!msg.isUser && (
            <div
              className="w-3 h-3 rounded-full mr-2 mt-1.5 flex-shrink-0"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}80` }}
            />
          )}
          <div
            className={`max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed relative shadow-sm ${
              msg.isUser
                ? 'border text-[#EEEEEE] rounded-br-sm'
                : 'bg-[#101010] border border-[#1C1C1C] text-[#DDDDDD] rounded-bl-sm'
            }`}
            style={
              msg.isUser
                ? {
                    backgroundColor: `${accentColor}11`,
                    borderColor: `${accentColor}44`,
                  }
                : undefined
            }
          >
            {msg.isUser ? (
              <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
            ) : (
              <MarkdownRenderer text={msg.text} accentColor={accentColor} />
            )}
            <div className="flex items-center gap-2 mt-1.5 justify-end">
              <span className="text-[9px] text-[#555] font-mono mr-auto">{formatTime(msg.timestamp)}</span>
              <button
                onClick={() => copy(msg.text)}
                className="text-[10px] text-[#777] hover:text-white active:scale-90 transition-all sm:opacity-0 sm:group-hover:opacity-100 px-1"
                title="Copy message"
              >
                📋
              </button>
              <button
                onClick={() => read(msg.text)}
                className="text-[10px] text-[#777] hover:text-white active:scale-90 transition-all sm:opacity-0 sm:group-hover:opacity-100 px-1"
                title="Read aloud"
              >
                🔊
              </button>
            </div>
          </div>
        </div>
      ))}

      {streamingText && (
        <div className="flex justify-start">
          <div
            className="w-3 h-3 rounded-full mr-2 mt-1.5 flex-shrink-0 animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl bg-[#111111] border border-[#222] text-[#DDDDDD] text-sm">
            <MarkdownRenderer text={streamingText} accentColor={accentColor} />
            <span className="inline-block w-1.5 h-3 ml-1 align-middle animate-pulse" style={{ backgroundColor: accentColor }} />
          </div>
        </div>
      )}
    </div>
  );
}
