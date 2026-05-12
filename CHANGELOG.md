# 📋 MYRA — Changelog

## v2.5 — Current (March 2026)

### ✨ New Features
- **API Key Validation** — Real validation calls with ✅/❌ status badges
- **Connection States** — Connecting, Connected, Failed with retry button
- **Real SVG Logo** — `MyraLogo.tsx` component + external icon files
- **Favicon Fix** — Proper `myra-favicon.svg` + `myra-touch-icon.svg`
- **Voice Quality Improvement** — `useTTS.ts` now scores voices to prefer natural ones
- **Speech Text Cleaner** — Strips markdown/emoji before speaking
- **Voice lang/rate/pitch** — Better defaults for natural sound

### 🐛 Bug Fixes
- Fixed: `isConnected` was `true` even with invalid API key → now validates
- Fixed: Greeting only fires once per successful connection
- Fixed: Response time graph had fake zero entries from transcript callback
- Fixed: SVG gradient ID conflicts when logo rendered multiple times

### 🎨 UI Improvements
- Logo in main header, Settings panel, Provider panel, About panel
- Connection status dot on provider button (green/red)
- Improved status messages during connection flow

---

## v2.0 — February 2026

### ✨ Major Features
- **12 New AI Providers** — Groq, xAI Grok, Mistral, OpenRouter, Cohere, Perplexity, Together, Fireworks, Cerebras added
- **Streaming Responses** — Real-time SSE token streaming
- **Multi-Session Chat History** — Save, switch, export, delete sessions
- **Stats Panel** — Messages, words, response times, mini chart
- **Token/Cost Tracker** — Per-provider request count + cost estimates
- **6 Theme Switcher** — Crimson, Aqua, Royal, Matrix, Solar, Sakura
- **Voice Picker** — All browser voices + speed/pitch/volume sliders
- **Quick Actions** — 8 preset prompt chips
- **Markdown Rendering** — Code blocks, bold, italic, lists, quotes
- **Custom System Prompt** — User AI instructions
- **Wake Word Detection** — "Hey MYRA" background listener
- **Export Chats** — JSON and TXT download
- **Typing Indicator** — Animated dots during thinking
- **Text Input Bar** — Keyboard typing support
- **Long-Term Memory** — MYRA remembers user facts
- **Backup/Restore** — Full data export/import
- **Chat Search** — Search & filter messages
- **Copy Messages** — Hover to copy
- **Keyboard Shortcuts** — 8 shortcuts
- **PWA Support** — Installable + manifest
- **Offline Detection** — Connection status
- **About Panel** — Feature list + shortcuts

---

## v1.0 — January 2026

### Initial Release
- **Google Gemini** AI provider
- **3 Personality Modes** — GF, Professional, Assistant
- **Hinglish + English** natural conversation
- **Voice Recognition** — Web Speech API
- **Text-to-Speech** — Web Speech Synthesis
- **Orb Animation** — Canvas-drawn animated orb
- **Waveform** — 20-bar amplitude visualization
- **Chat** — Message bubbles with timestamps
- **Command Parser** — Hinglish/English voice commands
- **Prime Contacts** — Multi-contact management
- **Settings** — API key, name, model, voice, personality
- **Demo Mode** — Works without API key
- **Incoming Call Demo** — Simulated call handling
- **Mic Button** — Long press to interrupt
- **Mute Toggle** — Quick mic control
- **Red Overlay Effect** — Visual active state
- **Dark Theme** — `#050505` base with red accents
