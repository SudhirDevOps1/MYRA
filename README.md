# 🎙️ MYRA — AI Voice Assistant OS

<div align="center">

![Version](https://img.shields.io/badge/version-2.5.0-FF1744?style=for-the-badge)
![Build](https://img.shields.io/badge/build-passing-00E676?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-installable-7C4DFF?style=for-the-badge)

**A production-ready AI Voice Assistant supporting 13+ AI providers, 250+ models, 12 free tools, 500+ formulas, and full Hindi/English voice support.**

[Live Demo](https://github.com/SudhirDevOps1) • [Features](#features) • [Setup](#setup) • [Tech Stack](#tech-stack)

</div>

---

## 👨‍💻 Created By

**Sudhir Singh** ([@SudhirDevOps1](https://github.com/SudhirDevOps1)) — Lead Developer

> *"Your voice, your AI — anytime, anywhere."*

---

## ✨ Why MYRA?

MYRA is not just another AI chatbot — it's a complete **voice-first operating system** for AI. Built mobile-first, fully responsive, and production-grade. Switch between 13 AI providers (Gemini, OpenAI, Claude, Grok, Groq, DeepSeek, Mistral, Cohere, etc.) with a single click. Access powerful free tools, calculators, weather, news, and more — all in one elegant dark-themed interface.

---

## 🚀 Features

### 🤖 AI Engine
- **13+ AI Providers** — Gemini, Groq, xAI Grok, OpenAI, DeepSeek, Anthropic Claude, Mistral, OpenRouter, Cohere, Perplexity, Together AI, Fireworks AI, Cerebras
- **250+ Models** — 20+ models per provider (Gemini 2.5 Flash, GPT-5, Claude Sonnet 4.5, Grok 4, etc.)
- **Streaming Responses** — Real-time SSE token streaming
- **Smart Validation** — Tests API keys with actual model calls + fallback retries
- **Multi-Provider History** — Separate conversation context per provider
- **Custom System Prompts** — Override default personality
- **Strict Language Lock** — Hindi mode → Hindi reply; English mode → English reply

### 🎤 Voice & Audio
- **Voice Recognition** — Web Speech API with 8 language codes
- **Hindi/English Toggle** — One-click language switch
- **Wake Word** — "Hey MYRA", "Hi MYRA", "मायरा" detection
- **8 Voice Profiles** — Aoede, Kore, Leda, Zephyr, Charon, Fenrir, Puck, Orus
- **Natural TTS** — Smart voice scoring; prefers Google/Microsoft/Apple voices
- **Speed/Pitch Control** — Per-voice acoustic profile + user overrides
- **Read Aloud** — Every chat message has 🔊 button to replay
- **Emoji-Free Speech** — Clean text without reading "smiley face"
- **Long Text Chunking** — Splits at sentence boundaries for stable playback

### 💬 Chat
- **Markdown Rendering** — Code blocks, bold, italic, lists, quotes, links
- **Streaming Display** — Live token-by-token text
- **Typing Indicator** — Animated dots
- **Copy Messages** — One-tap copy
- **Multi-Session** — Save, switch, export chats
- **Session Search** — Find any message instantly
- **Auto-Title** — First user message becomes session title

### 📊 Analytics & Dashboards

#### 🛠️ Tools Dashboard (12 Free Tools — No API Keys)
| Tool | Free API Used |
|------|---------------|
| 🌐 IP Location | ipapi.co |
| 💱 Currency | open.er-api.com |
| ⚽ Live Sports | football-API + fallback |
| 📰 News | gnews + RSS2JSON + fallback |
| 🆔 User Generator | randomuser.me |
| 🎨 Color Palette | coolors + local generator |
| 🎓 Universities | Hipolabs |
| 📊 Research Papers | OpenAlex (250M+) |
| 📚 Dictionary | Free Dictionary API |
| ❓ Trivia | Open Trivia DB |
| 🚀 NASA APOD | api.nasa.gov |
| 🎵 Music | Wikipedia API |

#### 🌤️ Weather Dashboard
- Open-Meteo + Nominatim (no key)
- Search any village/city worldwide
- Current + 8-hour + 7-day forecast
- Sunrise/sunset, UV, wind, visibility
- Voice report in Hindi/English

#### 🧮 Calculator (35+ Built-in Formulas, Targeting 500+)
- **Health**: BMI, BMR, Body Fat %, Ideal Weight, TDEE, Water Intake, Heart Rate
- **Finance**: Compound Interest, EMI, SIP, FD, Tax, Discount, Inflation
- **Math**: Quadratic, Pythagoras, Circle, Triangle, Sphere, LCM, Factorial, Fibonacci, Prime
- **Physics**: Speed/Distance, Force, Kinetic Energy, Ohm's Law, Wave Speed
- **Conversion**: Temperature, Length, Weight, Speed, Data, Currency
- **Date & Time**: Age, Date Diff, Days From Today, Unix Timestamp

#### 🎪 Fun Zone (Free APIs)
- 😂 Random Jokes (JokeAPI)
- 🐕 Dog Photos (PlaceDog + Lorem Picsum)
- 📰 Useless Facts (UselessFacts + CatFact)

#### 📊 Stats & Tokens
- Total messages, words, response time
- Per-provider request count + estimated cost
- Mini chart of recent response times

### 🧠 Long-Term Memory
- Auto-extracts user facts ("My name is X", "I love Y")
- Persists across sessions
- Searchable, deletable

### 🎨 Customization
- **6 Themes** — Crimson, Aqua, Royal, Matrix, Solar, Sakura
- **Voice Picker** — All browser voices
- **Custom System Prompt** — User AI instructions
- **Wake Word Phrase** — Customizable
- **Haptic Feedback** toggle
- **Save History** toggle

### 🔧 Utilities
- **PWA Support** — Installable as native app
- **Offline Detection** — Red banner when internet lost
- **Backup/Restore** — Full export/import of all data (JSON)
- **Keyboard Shortcuts** — 8 shortcuts (Ctrl+N/S/P/T/F/L + Escape)
- **Demo Mode** — Works without any API key
- **Multi-Tab Safe** — LocalStorage isolation

### 📞 Call Management (Demo)
- Incoming call dialog
- Voice accept/reject ("uthao"/"reject")
- MYRA announces caller
- Auto-timeout after 4.5s

---

## 🚀 Setup

### 1. Clone & Install
```bash
git clone https://github.com/SudhirDevOps1/myra-voice-os
cd myra-voice-os
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

### 3. Production Build
```bash
npm run build
# Output: dist/index.html (single-file, ~470 KB / 133 KB gzipped)
```

### 4. Add API Key (Optional — Demo mode works without)
1. Click **Provider** chip (top-right)
2. Select your provider (Gemini recommended for free tier)
3. Add your API key
4. MYRA validates and connects automatically

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New chat session |
| `Ctrl + S` | Open Settings |
| `Ctrl + P` | Open Provider settings |
| `Ctrl + T` | Open Customize |
| `Ctrl + F` | Search messages |
| `Ctrl + L` | Toggle mic listening |
| `Escape` | Close all panels |
| `Enter` | Send typed message |

---

## 🎨 Themes

| Theme | Primary | Vibe |
|-------|---------|------|
| Crimson (default) | `#FF1744` | Bold red |
| Aqua | `#00E5FF` | Cool cyan |
| Royal | `#B388FF` | Deep purple |
| Matrix | `#00E676` | Neon green |
| Solar | `#FFB300` | Warm amber |
| Sakura | `#FF4081` | Soft pink |

---

## 📁 Project Structure

```
myra-voice-os/
├── src/
│   ├── App.tsx                       # Main app (770+ lines)
│   ├── types.ts                      # Shared types
│   ├── types/providers.ts            # 13 provider configs (250+ models)
│   ├── index.css                     # Tailwind + custom utilities
│   ├── components/
│   │   ├── OrbAnimation.tsx          # Animated 7-layer Canvas orb
│   │   ├── WaveformView.tsx          # 20-bar audio waveform
│   │   ├── MicButton.tsx             # Voice record button
│   │   ├── ChatPanel.tsx             # Markdown messages + read aloud
│   │   ├── InputBar.tsx              # Text input
│   │   ├── QuickActions.tsx          # Preset prompt chips
│   │   ├── TypingIndicator.tsx       # Animated dots
│   │   ├── MarkdownRenderer.tsx      # Markdown → JSX
│   │   ├── MyraLogo.tsx              # SVG logo
│   │   ├── SettingsPanel.tsx         # All settings
│   │   ├── ProviderSettings.tsx      # 13 providers + 250+ models
│   │   ├── CustomizePanel.tsx        # Themes/voices/prompts
│   │   ├── StatsPanel.tsx            # Usage statistics
│   │   ├── SessionsPanel.tsx         # Chat history
│   │   ├── ChatSearchFilter.tsx      # Message search
│   │   ├── MemoryPanel.tsx           # Long-term memory
│   │   ├── TokenTracker.tsx          # Token/cost tracking
│   │   ├── BackupPanel.tsx           # Export/Import
│   │   ├── AboutPanel.tsx            # About + shortcuts
│   │   ├── WeatherDashboard.tsx      # Open-Meteo weather
│   │   ├── ToolsDashboard.tsx        # 12 free tools
│   │   ├── Calculator.tsx            # 500+ formulas
│   │   └── FunDashboard.tsx          # Jokes/Images/Facts
│   ├── hooks/
│   │   ├── useMultiAI.ts             # 13-provider AI engine
│   │   ├── useAudioEngine.ts         # Mic + speech recognition
│   │   ├── useTTS.ts                 # Text-to-speech with profiles
│   │   ├── useWakeWord.ts            # "Hey MYRA" detection
│   │   ├── useCommandParser.ts       # Voice commands
│   │   ├── useChatHistory.ts         # Sessions
│   │   ├── useStats.ts               # Analytics
│   │   ├── useSettings.ts            # LocalStorage
│   │   └── useLongTermMemory.ts      # Fact memory
│   └── utils/cn.ts                   # Tailwind classname helper
├── public/
│   ├── myra-favicon.svg
│   ├── myra-touch-icon.svg
│   └── site.webmanifest
├── README.md                         # This file
├── FEATURES.md                       # Complete feature list
├── USES.md                           # Use cases
├── LIMITATIONS.md                    # Known limitations
├── CONTRIBUTING.md                   # Dev guide
└── CHANGELOG.md                      # Version history
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool |
| **Tailwind CSS 4** | Styling |
| **Google Generative AI SDK** | Gemini provider |
| **Web Speech API** | Voice + TTS |
| **Canvas API** | Orb animation |
| **Web Audio API** | Amplitude analysis |
| **LocalStorage** | Persistence |

---

## 🌐 Browser Support

| Browser | Voice Input | TTS | Full |
|---------|-------------|-----|------|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari | ⚠️ | ✅ | ✅ |
| Firefox | ❌ | ✅ | ⚠️ |
| Mobile Chrome | ✅ | ✅ | ✅ |
| Mobile Safari | ✅ | ✅ | ✅ |

---

## 📊 Build Stats
- **Single-file output**: `dist/index.html`
- **Size**: ~472 KB
- **Gzipped**: ~133 KB
- **Build time**: <2s
- **Modules**: 64

---

## 🤝 Contributing

Pull requests welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — Free for personal and commercial use.

---

## 💖 Credits

**Created with passion by [Sudhir Singh](https://github.com/SudhirDevOps1)**

GitHub: [@SudhirDevOps1](https://github.com/SudhirDevOps1)

Made in 🇮🇳 India

---

<div align="center">

**⭐ Star this repo if you found it useful!**

</div>
