# ⚠️ MYRA — Known Limitations & Roadmap

> **Honest documentation of what MYRA can and cannot do.**

**Created by**: [Sudhir Singh](https://github.com/SudhirDevOps1)

---

## 🚫 Current Limitations

### 1. Browser-Based App (Not Native)
**Issue**: MYRA is a web/PWA app, not a native Android/iOS app.
**Impact**:
- Can't actually make phone calls (just opens `tel:` URL)
- Can't access native contacts
- Can't truly control hardware (flashlight, WiFi, Bluetooth)
- Can't open native apps (only web URLs)
**Workaround**: Voice commands work — they show feedback messages. For full native control, use the Android/Kotlin master spec from the original prompt.

### 2. Gemini Native Audio Not Supported (Yet)
**Issue**: Browser SDK doesn't expose Gemini Live WebSocket (`BidiGenerateContent`) for native human-like audio.
**Impact**: Gemini responses come as text → converted via Web Speech API.
**Workaround**: Voice quality is still excellent thanks to scoring + voice profile system.

### 3. CORS with Some Providers
**Issue**: Direct browser calls to some providers may be blocked.
**Impact**: 
- Anthropic Claude: requires `anthropic-dangerous-direct-browser-access` header (added)
- xAI Grok: may block from browser origin
- Some Cohere endpoints
**Workaround**: 
- Use OpenRouter as universal gateway
- Deploy a CORS proxy server in production
- Use Vercel/Netlify Edge Functions as proxy

### 4. Firefox — No Speech Recognition
**Issue**: Firefox doesn't implement `webkitSpeechRecognition`.
**Impact**: Voice input won't work in Firefox.
**Workaround**: Use Chrome/Edge/Safari. Text input always works.

### 5. Mobile Speech Recognition Timeout
**Issue**: Android/iOS Web Speech stops after ~60 seconds of silence.
**Impact**: Continuous listening pauses.
**Workaround**: MYRA auto-restarts. Tap mic to re-activate.

### 6. Token Counting is Approximate
**Issue**: Browser can't access real token counts from API responses.
**Impact**: Cost estimates in TokenTracker are approximations (chars / 4).
**Note**: Actual costs may vary by ±20%.

### 7. No Concurrent Provider Calls
**Issue**: Only one provider at a time.
**Impact**: No A/B testing UI yet.
**Future**: Compare Mode planned for v3.0.

### 8. API Keys in LocalStorage (Plaintext)
**Issue**: Keys stored without encryption.
**Impact**: Anyone with device access can extract keys via DevTools.
**Note**: Keys never leave your browser. This is by design for a client-only app.
**Mitigation**: Use environment-specific keys; rotate regularly.

### 9. Speech Synthesis Voice Quality Varies
**Issue**: TTS quality depends on OS/browser.
**Impact**:
- Chrome on Mac/Windows: ✅ Excellent (Google voices)
- Safari on Mac: ✅ Excellent (Apple voices)
- Chrome on Android: ✅ Good (Google TTS)
- Linux: ⚠️ Often robotic (eSpeak fallback)
**Workaround**: Voice picker lets you select the best available voice.

### 10. LocalStorage Quota (~5-10 MB)
**Issue**: Browser storage has limits.
**Impact**: 
- 50+ chat sessions may hit limits
- 200+ memories trim oldest
- Very long conversations get truncated
**Workaround**: Auto-trimming + Backup feature (download JSON).

### 11. Multi-Tab Behavior
**Issue**: Multiple MYRA tabs may conflict on `isConnected` state.
**Impact**: Unexpected reconnection/disconnection.
**Workaround**: Use one tab at a time.

### 12. No Dark/Light Mode Auto-Switch
**Issue**: All 6 themes are dark-mode (by design).
**Impact**: No system-preference auto-switching.
**Note**: This is intentional — dark mode is the design language.

### 13. Wake Word False Positives
**Issue**: Browser STT can misinterpret similar-sounding words.
**Impact**: May trigger on "hey Maya", "hi Mira", etc.
**Workaround**: Customize wake word in settings (e.g., "MYRA assistant activate").

### 14. Demo Mode Limited Responses
**Issue**: Without API key, only ~10 pattern-matched replies.
**Impact**: Limited conversation in demo mode.
**Workaround**: Add any free API key (Gemini has generous free tier).

### 15. No Offline AI
**Issue**: All AI providers need internet.
**Impact**: No responses when offline.
**Note**: Demo mode + UI features work offline.

### 16. Sports API Limited
**Issue**: RapidAPI football endpoint requires key (currently uses fallback).
**Impact**: Live sports show simulated data when API fails.
**Workaround**: Add your RapidAPI key in code, or use the included fallback.

### 17. News API Free Tier Limits
**Issue**: GNews free tier = 100 requests/day.
**Impact**: After limit, falls back to BBC RSS.
**Note**: BBC RSS works perfectly as backup.

### 18. Calculator Currently Has 35+ Formulas (Not Yet 500)
**Issue**: Building toward 500+ formula library.
**Status**: 35+ working perfectly across 6 categories.
**Roadmap**: Adding more formulas every release.

---

## 🔮 Planned Improvements (Roadmap)

### Q1 2026
| Feature | Priority | ETA |
|---------|----------|-----|
| Compare Mode (side-by-side providers) | High | v2.6 |
| API Proxy server option | High | v2.6 |
| 100+ more calculator formulas | Medium | v2.6 |
| Pin/bookmark messages | Medium | v2.7 |

### Q2 2026
| Feature | Priority | ETA |
|---------|----------|-----|
| Dark/Light auto-switch | Medium | v2.8 |
| Real wake word model (Porcupine) | High | v3.0 |
| Native Tauri app | High | v3.0 |
| End-to-end encryption for keys | Medium | v3.0 |
| Multi-language UI (not just voice) | Low | v3.0 |

### Q3 2026
| Feature | Priority | ETA |
|---------|----------|-----|
| Native Android app (Kotlin) | High | v3.5 |
| Gemini Live WebSocket support | High | v3.5 |
| Local LLM support (Ollama) | Medium | v3.5 |

---

## 🐛 Known Bugs (Minor)

| Bug | Severity | Status |
|-----|----------|--------|
| `xs:` breakpoint defined but minor display quirks on 360px screens | Low | Fixed |
| Wake word may stop briefly on tab focus change | Low | Acknowledged |
| Tools Dashboard scrolls in tabs on very small screens | Low | Acceptable |

---

## 💡 If Something Doesn't Work

### Mic Not Working
1. Check Chrome browser
2. Allow mic permission in URL bar
3. Page must be HTTPS or localhost
4. Try refresh (F5)

### API Key Not Connecting
1. Verify key copy/paste (no whitespace)
2. Check browser console for CORS errors
3. Try OpenRouter as fallback gateway
4. Check provider's API status page

### Voice Sounds Robotic
1. Open Customize → Voice
2. Pick a voice profile (Aoede recommended)
3. Try different system voice from picker
4. Adjust speed (0.95) and pitch (1.05)

### App Won't Load
1. Clear browser cache
2. Open in incognito mode
3. Check internet connection
4. Try different browser

---

## 📞 Support

Issues? Open a GitHub issue at:
[https://github.com/SudhirDevOps1](https://github.com/SudhirDevOps1)

---

**Built with ❤️ by [Sudhir Singh](https://github.com/SudhirDevOps1)** • [@SudhirDevOps1](https://github.com/SudhirDevOps1)

*This document is updated as limitations are resolved.*
