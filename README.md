# MYRA — AI Voice Assistant

> **🤖 13 AI Providers · 🎤 Voice Control · 💬 Streaming Chat · 🧠 Long-Term Memory · 🎨 6 Themes**

MYRA is a production-ready **AI Voice Assistant** web app that connects to **13+ AI providers** (Gemini, Groq, OpenAI, DeepSeek, Anthropic, xAI Grok, Mistral, Cohere, Perplexity, OpenRouter, Together, Fireworks, Cerebras), understands **Hinglish + English** voice commands, responds in **natural speech**, and can **open apps, manage contacts, control settings** — all through voice.

---

## 📸 Screenshots

| Main Screen | Provider Settings | Customize Panel |
|-------------|-------------------|-----------------|
| *Dark orb UI with waveform, chat, quick actions* | *13 AI providers grid + API keys* | *6 themes, voice picker, speeds* |

---

## ✨ Features

### 🧠 AI Engine
- **13 AI Providers** — Gemini, Groq, xAI Grok, OpenAI, DeepSeek, Anthropic, Mistral, OpenRouter, Cohere, Perplexity, Together, Fireworks, Cerebras
- **Streaming responses** — Real-time token-by-token display
- **Multi-provider history** — Separate conversation context per provider
- **Custom system prompt** — Override AI personality
- **3 Personality modes** — GF (Hinglish), Professional (English), Assistant (balanced)

### 🎤 Voice & Audio
- **Voice recognition** — Web Speech API (English, Hindi, 8 languages)
- **Text-to-Speech** — Natural voices with speed/pitch/volume control
- **Voice picker** — Choose from all browser voices
- **Wake word detection** — "Hey MYRA" background listener
- **Waveform visualization** — Real-time amplitude bars

### 💬 Chat
- **Markdown rendering** — Code blocks, bold, italic, lists, links
- **Multi-session history** — Save, switch, export chats
- **Chat search & filter** — Find any message instantly
- **Quick actions** — 8 preset prompts (jokes, motivation, facts, etc.)
- **Typing indicator** — Animated dots during thinking
- **Copy messages** — Hover to copy any message

### 📊 Analytics
- **Stats panel** — Messages, words, response times, mini chart
- **Token/cost tracker** — Per-provider request count + estimated cost

### 🧠 Memory
- **Long-term memory** — MYRA remembers facts across sessions
- **Memory panel** — Search, view, delete memories

### 🎨 Customization
- **6 Themes** — Crimson, Aqua, Royal, Matrix, Solar, Sakura
- **Voice preferences** — Speed, pitch, volume sliders
- **Language** — 8 language codes for STT
- **Haptic feedback** toggle
- **Wake word phrase** customizable

### 🔧 Utilities
- **Backup/Restore** — Export/import all data as JSON
- **Keyboard shortcuts** — Ctrl+N/S/P/T/F/L + Escape
- **PWA support** — Install as native app
- **Offline detection** — Connection status indicator
- **Demo mode** — Works without any API key

### 📞 Call Management
- **Incoming call simulation** — MYRA announces caller name
- **Voice accept/reject** — "uthao" / "reject"
- **Prime contacts** — Quick call/message shortcuts

### 📱 Phone Commands (Voice)
| Command | Action |
|---------|--------|
| "YouTube kholo" | Opens YouTube |
| "Priya ko call karo" | Dials Priya |
| "WhatsApp band karo" | Closes WhatsApp |
| "volume badhao" | Volume up |
| "torch on karo" | Flashlight |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:5173
```

### 4. Add API Key
Click **Provider** button → Select a provider → Add API key → Click DONE

MYRA will automatically validate your key and connect!

---

## 🔑 Supported API Providers

| Provider | Key Field | Default Model | Type |
|----------|-----------|---------------|------|
| **Google Gemini** | `apiKey` | gemini-2.0-flash | Gemini SDK |
| **Groq** | `groqKey` | llama-3.3-70b-versatile | OpenAI-compatible |
| **xAI Grok** | `xaiKey` | grok-4 | OpenAI-compatible |
| **OpenAI** | `openaiKey` | gpt-4o-mini | OpenAI-compatible |
| **DeepSeek** | `deepseekKey` | deepseek-chat | OpenAI-compatible |
| **Anthropic Claude** | `anthropicKey` | claude-sonnet-4 | Anthropic API |
| **Mistral AI** | `mistralKey` | mistral-large-latest | OpenAI-compatible |
| **OpenRouter** | `openrouterKey` | openai/gpt-4o-mini | OpenAI-compatible |
| **Cohere** | `cohereKey` | command-a-03-2025 | Cohere API |
| **Perplexity Sonar** | `perplexityKey` | sonar-pro | OpenAI-compatible |
| **Together AI** | `togetherKey` | Llama 3.3 70B Turbo | OpenAI-compatible |
| **Fireworks AI** | `fireworksKey` | Llama 3.1 70B | OpenAI-compatible |
| **Cerebras** | `cerebrasKey` | llama3.1-70b | OpenAI-compatible |

### API Key Validation
When you add an API key, MYRA makes a **real validation call** to the provider:

- ✅ **Valid key** → "✓ Connected" shows → Greeting plays
- ❌ **Invalid key** → "❌ Retry" button → Exact error shown

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New chat session |
| `Ctrl + S` | Open Settings |
| `Ctrl + P` | Open Provider settings |
| `Ctrl + T` | Open Theme/Customize |
| `Ctrl + F` | Search messages |
| `Ctrl + L` | Toggle mic listening |
| `Escape` | Close all panels |
| `Enter` | Send typed message |

---

## 🎨 Themes

| Theme | Primary Color | Vibe |
|-------|--------------|------|
| **Crimson** | `#FF1744` | Default — bold red |
| **Aqua** | `#00E5FF` | Cool cyan |
| **Royal** | `#B388FF` | Deep purple |
| **Matrix** | `#00E676` | Neon green |
| **Solar** | `#FFB300` | Warm amber |
| **Sakura** | `#FF4081` | Soft rose pink |

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application
├── types.ts                   # TypeScript types & constants
├── index.css                  # Global styles
├── components/
│   ├── OrbAnimation.tsx       # Animated orb (Canvas)
│   ├── WaveformView.tsx       # 20-bar audio waveform
│   ├── ChatPanel.tsx          # Chat with markdown
│   ├── MarkdownRenderer.tsx   # Markdown → JSX
│   ├── MicButton.tsx          # Voice record button
│   ├── InputBar.tsx           # Text input + send
│   ├── QuickActions.tsx       # 8 prompt chips
│   ├── TypingIndicator.tsx    # Animated dots
│   ├── MyraLogo.tsx           # SVG logo component
│   ├── SettingsPanel.tsx      # All settings
│   ├── ProviderSettings.tsx   # AI provider grid + keys
│   ├── CustomizePanel.tsx     # Theme, voice, prompt
│   ├── StatsPanel.tsx         # Usage statistics
│   ├── SessionsPanel.tsx      # Chat history
│   ├── ChatSearchFilter.tsx   # Message search
│   ├── MemoryPanel.tsx        # Long-term memory
│   ├── TokenTracker.tsx       # Cost tracking
│   ├── BackupPanel.tsx        # Export/Import
│   └── AboutPanel.tsx         # About + shortcuts
├── hooks/
│   ├── useMultiAI.ts          # Multi-provider AI engine
│   ├── useAudioEngine.ts      # Mic + speech recognition
│   ├── useTTS.ts              # Text-to-speech
│   ├── useSettings.ts         # LocalStorage settings
│   ├── useCommandParser.ts    # Voice → Command parser
│   ├── useChatHistory.ts      # Session management
│   ├── useStats.ts            # Usage statistics
│   ├── useWakeWord.ts         # "Hey MYRA" detector
│   └── useLongTermMemory.ts   # User fact memory
├── types/
│   └── providers.ts           # 13 provider configurations
└── utils/
    └── cn.ts                  # Tailwind classname helper
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
| **Web Speech API** | Voice recognition + TTS |
| **Canvas API** | Orb animation |
| **Web Audio API** | Amplitude analysis |
| **LocalStorage** | Settings + history persistence |

---

## 🌐 Browser Support

| Browser | Voice | TTS | Full Support |
|---------|-------|-----|-------------|
| **Chrome** | ✅ | ✅ | ✅ |
| **Edge** | ✅ | ✅ | ✅ |
| **Safari** | ⚠️ | ✅ | ✅ |
| **Firefox** | ❌ | ✅ | ⚠️ (no STT) |
| **Mobile Chrome** | ✅ | ✅ | ✅ |
| **Mobile Safari** | ✅ | ✅ | ✅ |

---

## 📦 Build

```bash
npm run build
# → dist/index.html (single file, ~350 KB / 101 KB gzipped)
```

---

## ⚠️ Known Limitations

- **CORS**: Some providers block browser requests. Use a production proxy.
- **Firefox**: Web Speech API not supported — voice input won't work.
- **Android engine limits**: Web Speech API stops after ~60s of silence.
- **Token tracking**: Estimated costs based on word counting, not actual tokens.

---

## 📄 License

MIT — Free for personal and commercial use.

---

*Built with ❤️ for voice-first AI interaction.*
