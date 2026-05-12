import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, AppSettings } from '../types';
import { PERSONALITY_SYSTEM_PROMPTS, PROVIDER_BY_ID, type ProviderConfig } from '../types/providers';

export interface MultiAICallbacks {
  onOutputTranscript: (text: string) => void;
  onInputTranscript: (text: string) => void;
  onTurnComplete: () => void;
  onStateChange: (state: string) => void;
  onError: (error: string) => void;
  onStreamChunk?: (partial: string) => void;
  onResponseTime?: (ms: number) => void;
  speakOverride?: (text: string, onEnd?: () => void) => void;
}

type ChatRole = 'system' | 'user' | 'assistant';

interface ChatMessagePayload {
  role: ChatRole;
  content: string;
}

const MAX_HISTORY_MESSAGES = 12;

function getProvider(settings: AppSettings): ProviderConfig {
  return PROVIDER_BY_ID[settings.aiProvider] || PROVIDER_BY_ID.gemini;
}

function getSelectedModel(settings: AppSettings, provider: ProviderConfig): string {
  return provider.models.some(model => model.id === settings.aiModel)
    ? settings.aiModel
    : provider.defaultModel;
}

function extractOpenAICompatibleText(data: any): string {
  const choiceText = data?.choices?.[0]?.message?.content;
  if (typeof choiceText === 'string') return choiceText;

  const outputText = data?.output?.[0]?.content?.[0]?.text;
  if (typeof outputText === 'string') return outputText;

  const directText = data?.message?.content?.text || data?.message?.content;
  if (typeof directText === 'string') return directText;

  throw new Error(data?.error?.message || 'Provider returned an unknown response format.');
}

function extractAnthropicText(data: any): string {
  const text = data?.content?.find?.((part: any) => part?.type === 'text')?.text || data?.content?.[0]?.text;
  if (typeof text === 'string') return text;
  throw new Error(data?.error?.message || 'Anthropic returned an unknown response format.');
}

function extractCohereText(data: any): string {
  const text = data?.message?.content?.find?.((part: any) => part?.type === 'text')?.text
    || data?.message?.content?.[0]?.text
    || data?.text;
  if (typeof text === 'string') return text;
  throw new Error(data?.message || 'Cohere returned an unknown response format.');
}

export function useMultiAI(settings: AppSettings, callbacks: MultiAICallbacks) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AIProvider>(settings.aiProvider || 'gemini');

  const callbacksRef = useRef(callbacks);
  const genAIRef = useRef<GoogleGenerativeAI | null>(null);
  const geminiChatRef = useRef<any>(null);
  const historiesRef = useRef<Record<string, ChatMessagePayload[]>>({});
  const validatedModelsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    setActiveProvider(settings.aiProvider);
    setIsConnected(false);
    geminiChatRef.current = null;
    genAIRef.current = null;
  }, [settings.aiProvider, settings.aiModel]);

  // Clear gemini chat when language/personality changes so new system prompt applies
  useEffect(() => {
    geminiChatRef.current = null;
    historiesRef.current = {};
  }, [settings.ttsLanguage, settings.personalityMode, settings.customSystemPrompt]);

  const getSystemPrompt = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const namePart = settings.userName
      ? `The user's name is ${settings.userName}. Address them by name occasionally.`
      : '';
    const customExtra = settings.customSystemPrompt?.trim()
      ? `\n\nAdditional instructions from user:\n${settings.customSystemPrompt.trim()}`
      : '';

    // CRITICAL LANGUAGE RULE
    const langRule = settings.ttsLanguage === 'hi'
      ? `\n\n=== LANGUAGE RULE (CRITICAL) ===\nALWAYS respond in HINDI (Devanagari script + simple Hindi words). The user's TTS is set to Hindi. Even if user asks in English, REPLY IN HINDI. Use natural conversational Hindi like "हाँ", "ज़रूर", "बिल्कुल". You may mix common English words like "phone", "battery", "WiFi" but the SENTENCE STRUCTURE MUST BE HINDI. Never reply in pure English.`
      : `\n\n=== LANGUAGE RULE (CRITICAL) ===\nALWAYS respond in ENGLISH. The user's TTS is set to English. Even if user asks in Hindi or Hinglish, REPLY IN ENGLISH. Use natural conversational English. Never reply in Hindi/Devanagari script. Never use Hinglish words like "haan", "tumhara", "acha". Always pure English.`;

    return `${PERSONALITY_SYSTEM_PROMPTS[settings.personalityMode]}${langRule}\nCurrent date: ${dateStr}\nCurrent time: ${timeStr}\n${namePart}\nYou are speaking ALOUD - keep responses natural and conversational. Remember: you are MYRA.${customExtra}`;
  }, [settings.personalityMode, settings.userName, settings.customSystemPrompt, settings.ttsLanguage]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      setTimeout(() => {
        setIsSpeaking(false);
        callbacksRef.current.onStateChange('idle');
      }, Math.max(900, text.length * 35));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.name.includes('Google') && voice.name.includes('Female') && voice.lang.includes('en'))
      || voices.find(voice => voice.lang.includes('en-US') && voice.name.includes('Female'))
      || voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => {
      setIsSpeaking(false);
      callbacksRef.current.onStateChange('idle');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      callbacksRef.current.onStateChange('idle');
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const getKey = useCallback((provider: ProviderConfig) => String(settings[provider.keyField] || '').trim(), [settings]);

  const getRuntimeModel = useCallback((provider: ProviderConfig) => {
    return validatedModelsRef.current[provider.id] || getSelectedModel(settings, provider);
  }, [settings]);

  const validateConnection = useCallback(async (provider: ProviderConfig): Promise<{ ok: boolean; error?: string; model?: string }> => {
    try {
      const selectedModel = getSelectedModel(settings, provider);
      const candidates = Array.from(new Set([selectedModel, provider.defaultModel].filter(Boolean)));

      if (provider.mode === 'gemini') {
        const key = getKey(provider);
        if (!key) return { ok: false, error: 'Gemini API key missing' };
        const genAI = new GoogleGenerativeAI(key);
        let lastError = '';
        for (const modelId of candidates) {
          try {
            const model = genAI.getGenerativeModel({ model: modelId, generationConfig: { maxOutputTokens: 1 } });
            await model.generateContent('test');
            return { ok: true, model: modelId };
          } catch (error: any) {
            lastError = error?.message || 'Gemini validation failed';
          }
        }
        return { ok: false, error: lastError };
      }

      if (provider.mode === 'anthropic') {
        const key = getKey(provider);
        if (!key) return { ok: false, error: 'Anthropic API key missing' };
        let lastError = '';
        for (const modelId of candidates) {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': key,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({ model: modelId, max_tokens: 1, messages: [{ role: 'user', content: 'p' }] }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) return { ok: true, model: modelId };
          lastError = data?.error?.message || `Status ${res.status}`;
        }
        return { ok: false, error: lastError };
      }

      if (provider.mode === 'cohere') {
        const key = getKey(provider);
        if (!key) return { ok: false, error: 'Cohere API key missing' };
        let lastError = '';
        for (const modelId of candidates) {
          const res = await fetch('https://api.cohere.ai/v2/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
            body: JSON.stringify({ model: modelId, max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) return { ok: true, model: modelId };
          lastError = data?.message || `Status ${res.status}`;
        }
        return { ok: false, error: lastError };
      }

      // OpenAI-compatible providers
      if (!provider.endpoint) return { ok: false, error: 'No endpoint configured' };
      const key = getKey(provider);
      if (!key) return { ok: false, error: `${provider.name} API key missing` };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      };
      if (provider.id === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'MYRA';
      }

      let lastError = '';
      for (const modelId of candidates) {
        const res = await fetch(provider.endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: 'p' }], max_tokens: 1, stream: false }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) return { ok: true, model: modelId };
        lastError = data?.error?.message || `Status ${res.status}`;
      }
      return { ok: false, error: lastError };
    } catch (e: any) {
      if (e?.message?.includes('Failed to fetch')) {
        return { ok: false, error: 'CORS blocked — use production proxy' };
      }
      return { ok: false, error: e?.message || 'Unknown error' };
    }
  }, [getKey, settings]);

  const ensureConnected = useCallback(() => {
    const provider = getProvider(settings);
    const key = getKey(provider);
    if (!key) {
      setIsConnected(false);
      return false;
    }
    return true;
  }, [getKey, settings]);

  const sendGemini = useCallback(async (text: string, provider: ProviderConfig) => {
    const key = getKey(provider);
    if (!key) throw new Error('Gemini API key missing.');

    if (!genAIRef.current) {
      genAIRef.current = new GoogleGenerativeAI(key);
    }

    if (!geminiChatRef.current) {
      const model = genAIRef.current.getGenerativeModel({
        model: getRuntimeModel(provider),
        systemInstruction: getSystemPrompt(),
        generationConfig: { temperature: 0.9, maxOutputTokens: 256 },
      });
      geminiChatRef.current = model.startChat({ history: [] });
    }

    const result = await geminiChatRef.current.sendMessage(text);
    return result.response.text();
  }, [getKey, getSystemPrompt, settings]);

  const sendOpenAICompatible = useCallback(async (text: string, provider: ProviderConfig) => {
    const key = getKey(provider);
    if (!key) throw new Error(`${provider.name} API key missing.`);
    if (!provider.endpoint) throw new Error(`${provider.name} endpoint missing.`);

    const historyKey = provider.id;
    const history = historiesRef.current[historyKey] || [];
    const messages: ChatMessagePayload[] = [
      { role: 'system', content: getSystemPrompt() },
      ...history.slice(-MAX_HISTORY_MESSAGES),
      { role: 'user', content: text },
    ];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    };

    if (provider.id === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin;
      headers['X-Title'] = 'MYRA Voice Assistant';
    }

    const useStreaming = settings.streamingEnabled && !!callbacksRef.current.onStreamChunk;

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: getRuntimeModel(provider),
        messages,
        max_tokens: 256,
        temperature: 0.9,
        stream: useStreaming,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `${provider.name} request failed (${response.status}).`);
    }

    let reply = '';

    if (useStreaming && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === 'string') {
              reply += delta;
              callbacksRef.current.onStreamChunk?.(reply);
            }
          } catch { /* partial chunk */ }
        }
      }

      if (!reply) {
        // Some providers return non-SSE - fallback parse
        try {
          const fallback = JSON.parse(buffer || '{}');
          reply = extractOpenAICompatibleText(fallback);
        } catch { /* ignore */ }
      }
    } else {
      const data = await response.json().catch(() => ({}));
      reply = extractOpenAICompatibleText(data);
    }

    historiesRef.current[historyKey] = [
      ...history,
      { role: 'user' as const, content: text },
      { role: 'assistant' as const, content: reply },
    ].slice(-MAX_HISTORY_MESSAGES);
    return reply;
  }, [getKey, getSystemPrompt, settings]);

  const sendAnthropic = useCallback(async (text: string, provider: ProviderConfig) => {
    const key = getKey(provider);
    if (!key) throw new Error('Anthropic API key missing.');
    if (!provider.endpoint) throw new Error('Anthropic endpoint missing.');

    const history = historiesRef.current[provider.id] || [];
    const messages = [
      ...history.filter(message => message.role !== 'system').slice(-MAX_HISTORY_MESSAGES),
      { role: 'user' as const, content: text },
    ];

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: getRuntimeModel(provider),
        max_tokens: 256,
        system: getSystemPrompt(),
        messages,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error?.message || `Anthropic request failed (${response.status}).`);
    }

    const reply = extractAnthropicText(data);
    historiesRef.current[provider.id] = [
      ...history,
      { role: 'user' as const, content: text },
      { role: 'assistant' as const, content: reply },
    ].slice(-MAX_HISTORY_MESSAGES);
    return reply;
  }, [getKey, getSystemPrompt, settings]);

  const sendCohere = useCallback(async (text: string, provider: ProviderConfig) => {
    const key = getKey(provider);
    if (!key) throw new Error('Cohere API key missing.');
    if (!provider.endpoint) throw new Error('Cohere endpoint missing.');

    const history = historiesRef.current[provider.id] || [];
    const messages = [
      { role: 'system' as const, content: getSystemPrompt() },
      ...history.slice(-MAX_HISTORY_MESSAGES),
      { role: 'user' as const, content: text },
    ];

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: getRuntimeModel(provider),
        messages,
        max_tokens: 256,
        temperature: 0.9,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message || `Cohere request failed (${response.status}).`);
    }

    const reply = extractCohereText(data);
    historiesRef.current[provider.id] = [
      ...history,
      { role: 'user' as const, content: text },
      { role: 'assistant' as const, content: reply },
    ].slice(-MAX_HISTORY_MESSAGES);
    return reply;
  }, [getKey, getSystemPrompt, settings]);

  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');
  const [lastValidationError, setLastValidationError] = useState('');

  const connect = useCallback(async () => {
    const provider = getProvider(settings);
    const key = getKey(provider);
    if (!key) {
      setConnectionState('disconnected');
      setLastValidationError(`${provider.name} API key missing. Settings mein key daalo.`);
      callbacksRef.current.onError(lastValidationError);
      setIsConnected(false);
      return;
    }

    setConnectionState('connecting');
    setLastValidationError('');
    callbacksRef.current.onStateChange('connecting');
    setIsConnected(false);

    const result = await validateConnection(provider);

    if (result.ok) {
      validatedModelsRef.current[provider.id] = result.model || getSelectedModel(settings, provider);
      setConnectionState('connected');
      setIsConnected(true);
      callbacksRef.current.onStateChange('connected');
      setLastValidationError('');
    } else {
      setConnectionState('failed');
      setIsConnected(false);
      setLastValidationError(result.error || 'Connection failed');
      callbacksRef.current.onError(`❌ ${provider.name}: ${result.error || 'Connection failed. Check API key.'}`);
      callbacksRef.current.onStateChange('idle');
    }
  }, [validateConnection, getKey, settings, getProvider]);

  const sendText = useCallback(async (text: string) => {
    const provider = getProvider(settings);
    if (!ensureConnected()) return;

    const startTime = performance.now();
    try {
      callbacksRef.current.onStateChange('thinking');
      let reply = '';

      if (provider.mode === 'gemini') {
        reply = await sendGemini(text, provider);
      } else if (provider.mode === 'anthropic') {
        reply = await sendAnthropic(text, provider);
      } else if (provider.mode === 'cohere') {
        reply = await sendCohere(text, provider);
      } else {
        reply = await sendOpenAICompatible(text, provider);
      }

      const elapsed = performance.now() - startTime;
      callbacksRef.current.onResponseTime?.(elapsed);
      callbacksRef.current.onOutputTranscript(reply);
      callbacksRef.current.onTurnComplete();
      callbacksRef.current.onStateChange('speaking');
      setIsSpeaking(true);

      // Use override (custom TTS) or fallback
      if (callbacksRef.current.speakOverride) {
        callbacksRef.current.speakOverride(reply, () => {
          setIsSpeaking(false);
          callbacksRef.current.onStateChange('idle');
        });
      } else {
        speakText(reply);
      }
    } catch (error: any) {
      const corsNote = error?.message?.includes('Failed to fetch')
        ? ' Browser CORS block ho sakta hai. Production mein secure API proxy use karein.'
        : '';
      callbacksRef.current.onError(`${provider.name} error: ${error?.message || 'Unknown error.'}${corsNote}`);
      callbacksRef.current.onStateChange('idle');
      setIsSpeaking(false);
    }
  }, [ensureConnected, sendAnthropic, sendCohere, sendGemini, sendOpenAICompatible, settings, speakText]);

  const disconnect = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    geminiChatRef.current = null;
    genAIRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    callbacksRef.current.onStateChange('idle');
  }, []);

  const interruptSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    callbacksRef.current.onStateChange('idle');
  }, []);

  const clearConversation = useCallback(() => {
    historiesRef.current = {};
    geminiChatRef.current = null;
  }, []);

  return {
    isConnected,
    isSpeaking,
    activeProvider,
    setActiveProvider,
    connect,
    disconnect,
    sendText,
    interruptSpeaking,
    clearConversation,
    connectionState,
    lastValidationError,
  };
}