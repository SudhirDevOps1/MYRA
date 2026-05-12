import { useCallback, useEffect, useState } from 'react';
import type { VoicePrefs } from '../types';

function normalizeSpeechText(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' code block ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreVoice(voice: SpeechSynthesisVoice, preferredLang: string) {
  const name = `${voice.name} ${voice.lang}`.toLowerCase();
  let score = 0;

  // Language match is highest priority
  const langLower = voice.lang.toLowerCase();
  if (preferredLang === 'hi') {
    if (langLower.startsWith('hi')) score += 100;
    else if (langLower.includes('hi')) score += 50;
  } else {
    if (langLower.startsWith('en')) score += 100;
    else if (langLower.includes('en')) score += 50;
  }

  // Quality scoring
  if (name.includes('google')) score += 15;
  if (name.includes('microsoft')) score += 15;
  if (name.includes('apple')) score += 15;
  if (name.includes('natural')) score += 12;
  if (name.includes('premium')) score += 10;
  if (name.includes('enhanced')) score += 8;
  if (name.includes('female')) score += 4;
  if (name.includes('male')) score += 2;

  // Hindi-specific good voices
  if (preferredLang === 'hi') {
    if (name.includes('lekha')) score += 20;
    if (name.includes('swara')) score += 20;
    if (name.includes('madhur')) score += 15;
    if (name.includes('hindi')) score += 10;
  }

  // English-specific good voices
  if (preferredLang === 'en') {
    if (name.includes('aria')) score += 20;
    if (name.includes('jenny')) score += 18;
    if (name.includes('samantha')) score += 16;
    if (name.includes('zira')) score += 14;
    if (name.includes('daniel')) score += 12;
    if (name.includes('fred')) score += 10;
  }

  // Penalize robotic voices
  if (name.includes('android')) score -= 25;
  if (name.includes('synthesizer')) score -= 20;
  if (name.includes('espeak')) score -= 30;
  if (name.includes('robot')) score -= 30;
  if (name.includes('default')) score -= 10;
  if (name.includes('generic')) score -= 15;

  return score;
}

export interface TTSResult {
  voices: SpeechSynthesisVoice[];
  activeVoice: SpeechSynthesisVoice | null;
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
}

export function useTTS(prefs: VoicePrefs, ttsLanguage: 'en' | 'hi' = 'en'): TTSResult {
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const update = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) setAllVoices(list);
    };
    update();
    window.speechSynthesis.onvoiceschanged = update;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Filter voices by language preference
  const filteredVoices = allVoices.filter(v => {
    const lang = v.lang.toLowerCase();
    if (ttsLanguage === 'hi') {
      return lang.startsWith('hi') || lang.includes('hi');
    }
    return lang.startsWith('en') || lang.includes('en');
  });

  // Sort by quality score
  const sortedVoices = [...filteredVoices].sort((a, b) =>
    scoreVoice(b, ttsLanguage) - scoreVoice(a, ttsLanguage)
  );

  // Pick best voice
  const activeVoice = sortedVoices[0] || allVoices[0] || null;

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!('speechSynthesis' in window)) {
        setTimeout(() => onEnd?.(), Math.max(800, text.length * 30));
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = normalizeSpeechText(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Pick voice: user-selected > best for language > any
      let voice: SpeechSynthesisVoice | undefined;
      if (prefs.voiceURI) {
        voice = allVoices.find(v => v.voiceURI === prefs.voiceURI);
      }
      if (!voice || !voice.lang.toLowerCase().includes(ttsLanguage === 'hi' ? 'hi' : 'en')) {
        voice = activeVoice || undefined;
      }
      if (!voice) {
        voice = allVoices[0];
      }

      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || (ttsLanguage === 'hi' ? 'hi-IN' : 'en-US');
      utterance.rate = Math.min(1.05, Math.max(0.75, prefs.rate));
      utterance.pitch = Math.min(1.2, Math.max(0.85, prefs.pitch));
      utterance.volume = prefs.volume;

      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();
      window.speechSynthesis.speak(utterance);
    },
    [prefs, activeVoice, allVoices, ttsLanguage]
  );

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  return { voices: sortedVoices, activeVoice, speak, cancel };
}
