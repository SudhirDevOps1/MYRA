import { useState, useCallback, useRef, useEffect } from 'react';

interface MicButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onPress: () => void;
  onLongPress: () => void;
  className?: string;
  accentColor?: string;
}

export default function MicButton({
  isListening,
  isSpeaking,
  isMuted,
  onPress,
  onLongPress,
  className = '',
  accentColor = '#FF1744',
}: MicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);
  const pressStartRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);
    longPressFiredRef.current = false;
    pressStartRef.current = Date.now();

    pressTimerRef.current = window.setTimeout(() => {
      longPressFiredRef.current = true;
      onLongPress();
      setIsPressed(false);
    }, 600);
  }, [onLongPress]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const wasLongPress = longPressFiredRef.current;

    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    setIsPressed(false);

    // Only trigger short tap if long press did NOT fire
    if (!wasLongPress) {
      const elapsed = Date.now() - pressStartRef.current;
      if (elapsed < 600) {
        onPress();
      }
    }
  }, [onPress]);

  const handlePointerLeave = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressed(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Fallback: if pointer events didn't fire (some accessibility tools), use click
    if (!longPressFiredRef.current && Date.now() - pressStartRef.current > 800) {
      onPress();
    }
  }, [onPress]);

  const getIcon = () => {
    if (isMuted) {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    }
    if (isSpeaking) {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D500F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
    if (isListening) {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={accentColor} stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    }
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  };

  const getStyles = () => {
    if (isMuted) return { borderColor: '#333', boxShadow: 'none' };
    if (isSpeaking) return { borderColor: '#D500F9', boxShadow: '0 0 24px rgba(213,0,249,0.5)' };
    if (isListening) return { borderColor: accentColor, boxShadow: `0 0 28px ${accentColor}80` };
    return { borderColor: `${accentColor}66`, boxShadow: `0 0 12px ${accentColor}30` };
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        onClick={handleClick}
        className={`
          w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full
          bg-[#0A0A0A] border-2
          flex items-center justify-center
          transition-all duration-150
          touch-manipulation
          ${isListening ? 'animate-pulse' : ''}
          ${isPressed ? 'scale-90' : 'active:scale-95 hover:scale-105'}
        `}
        style={{
          ...getStyles(),
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label={isMuted ? 'Unmute microphone' : isListening ? 'Stop listening' : 'Start listening'}
      >
        {getIcon()}
      </button>
      <span className="text-[10px] sm:text-[11px] text-[#666] font-mono text-center">
        {isMuted
          ? '🔇 Tap to unmute'
          : isSpeaking
          ? '💜 Bol rahi hoon...'
          : isListening
          ? '🔴 Sun rahi hoon... (long press = mute)'
          : 'Tap to speak · Long press = mute'}
      </span>
    </div>
  );
}
