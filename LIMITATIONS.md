# ⚠️ MYRA — Known Limitations

## 🚫 Current Limitations

### 1. Gemini Native Audio Not Supported (Web)
**Issue**: MYRA uses Gemini REST API (`generateContent`) for text, not the Gemini Live WebSocket (`BidiGenerateContent`) for native audio.
**Impact**: Gemini responses come as text → converted to speech via Web Speech API instead of native human-like Gemini voices.
**Why**: Browser WebSocket support for Gemini Live's custom protocol is not available in the current Gemini SDK.
**Workaround**: Voice quality is still good via Web Speech API + voice picker. Native audio will be added when browser SDK supports it.

### 2. CORS with Some Providers
**Issue**: Browser-based API calls to some providers (e.g., Anthropic, xAI) may be blocked by CORS policies.
**Impact**: Some providers work in development but not in production browser.
**Fix**: Deploy behind a secure API proxy server or use OpenRouter as a unified gateway.
**Providers likely affected**: Direct Anthropic, xAI Grok, Cohere

### 3. Firefox — No Speech Recognition
**Issue**: Firefox does not implement the Web Speech API `SpeechRecognition`.
**Impact**: Voice input (`startListening()`) will not work in Firefox.
**Workaround**: Use text input instead. Speech synthesis (TTS) works fine.

### 4. Mobile Speech Recognition Timeout
**Issue**: Android/iOS Web Speech API stops listening after ~60 seconds of silence.
**Impact**: Continuous listening mode will stop if user pauses too long.
**Workaround**: Auto-restart is implemented. Tap mic to re-activate.

### 5. No Real Phone Integration (Web App)
**Issue**: MYRA is a web app, not a native Android/iOS app.
**Impact**: Cannot actually:
- Make real phone calls
- Open native apps (only web URLs)
- Control device hardware (flashlight, WiFi, Bluetooth)
- Read contacts from phone
- Send SMS
**Workaround**: Command parser provides feedback messages. For real phone control, the Android/Kotlin version is needed.

### 6. Token Counting is Approximate
**Issue**: Token count is estimated by dividing character length by 4.
**Impact**: Cost estimates in TokenTracker are rough approximations.
**Why**: Browsers can't access actual token counts from API responses.

### 7. No Concurrent Provider Calls
**Issue**: Can only query one AI provider at a time.
**Impact**: No A/B testing or multi-model comparison view.
**Future**: Compare Mode planned.

### 8. API Key Storage — Plaintext in LocalStorage
**Issue**: API keys stored in LocalStorage without encryption.
**Impact**: Anyone with physical access to the device can extract keys.
**Note**: Keys never leave your browser. This is a client-only app.

### 9. Speech Synthesis Voice Quality Varies
**Issue**: TTS voice quality depends on OS and browser.
**Impact**:
- **Chrome on Mac/Windows**: Good (Google voices)
- **Safari on Mac**: Excellent (Apple voices)
- **Chrome on Android**: Good (Google TTS)
- **Linux**: Often robotic (eSpeak)
**Workaround**: Voice picker lets you select the best available voice.

### 10. Browser Storage Limits
**Issue**: LocalStorage has a ~5-10 MB limit per origin.
**Impact**:
- Very long chat histories may hit storage limits
- Many sessions + large memory = potential quota errors
**Workaround**: Auto-trimming at 50 sessions, 200 memories. Export regularly.

### 11. Single Tab Only
**Issue**: MYRA uses isConnected state that doesn't sync across tabs.
**Impact**: Opening MYRA in multiple tabs may cause unexpected behavior.
**Workaround**: Use only one tab at a time.

### 12. No Dark/Light Mode Auto-Switch
**Issue**: Themes are manual, not system-preference based.
**Impact**: No automatic dark/light switching.
**Note**: All 6 themes are dark-mode. This is by design.

### 13. Wake Word Drift
**Issue**: Wake word detection uses browser STT, not a dedicated wake word model.
**Impact**: May trigger on similar-sounding words or fail in noisy environments.
**Workaround**: Custom wake word phrase can be set. Keep mic close.

### 14. Demo Mode Uses Fixed Responses
**Issue**: Without an API key, responses are from a small set of pattern-matched replies.
**Impact**: Demo mode is limited to ~10 response patterns.
**Workaround**: Add any API key for full AI responses.

### 15. No Offline AI
**Issue**: Internet required for AI responses (except demo mode).
**Impact**: No responses when offline.
**Note**: Demo mode and all UI features work offline.

---

## 🔮 Planned Improvements

| Feature | Priority | Status |
|---------|----------|--------|
| API Proxy for CORS issues | High | Planned |
| Compare Mode (side-by-side providers) | High | Planned |
| Dark/Light system preference | Medium | Planned |
| Pin/bookmark messages | Medium | Planned |
| Better voice models for Android | Medium | Planned |
| Real native app (Tauri/Capacitor) | Low | Under consideration |

---

*This file will be updated as limitations are resolved.*
