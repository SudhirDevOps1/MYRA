# 🤝 Contributing to MYRA

Thank you for your interest in contributing! MYRA is open-source and welcomes contributions.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9
- **Modern browser** (Chrome/Edge recommended for full features)

### Setup
```bash
git clone <repo-url>
cd myra
npm install
npm run dev
```

Visit `http://localhost:5173` — dev server with hot reload.

---

## 📁 Project Structure

```
src/
├── App.tsx                  # Main app entry
├── types.ts                 # Shared TypeScript types
├── types/providers.ts       # AI provider configurations
├── components/              # React components
│   ├── OrbAnimation.tsx     # Animated orb
│   ├── ChatPanel.tsx        # Chat display
│   └── ...                  # 15+ components
├── hooks/                   # React hooks (business logic)
│   ├── useMultiAI.ts        # Multi-provider AI engine
│   ├── useAudioEngine.ts    # Mic + speech recognition
│   └── ...                  # 8+ hooks
└── index.css                # Global styles (Tailwind)
```

---

## 🧪 Testing Changes

### Build Check
```bash
npm run build
```
Must complete without errors. Build output goes to `dist/index.html`.

### Lint Check
```bash
npx tsc --noEmit
```
Should have minimal warnings (unused variables only).

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] Theme switching works on all 6 themes
- [ ] Settings save and persist across reload
- [ ] Mic button starts/stops listening
- [ ] Wake word triggers listening
- [ ] Quick actions send correct prompts
- [ ] Chat messages display (user + AI bubbles)
- [ ] Markdown renders (bold, code, lists)
- [ ] Sessions save and switch
- [ ] Export works (JSON and TXT)
- [ ] API key validation works
- [ ] Demo mode works without key
- [ ] All panels open and close
- [ ] Keyboard shortcuts work

---

## 🎨 Adding a New AI Provider

### Step 1: Add to `src/types/providers.ts`
```typescript
// Add to AIProvider type
export type AIProvider = '...' | 'newprovider';

// Add provider config
{
  id: 'newprovider',
  name: 'New Provider',
  shortName: 'New',
  icon: 'NP',
  color: '#HEXCODE',
  keyField: 'newproviderKey',
  keyLabel: 'New Provider API Key',
  keyPlaceholder: 'key-...',
  mode: 'openai-compatible', // or 'gemini' | 'anthropic' | 'cohere'
  endpoint: 'https://api.newprovider.com/v1/chat/completions',
  defaultModel: 'model-name',
  models: [
    { id: 'model-1', label: 'Model 1' },
  ],
}
```

### Step 2: Add key field to `src/types.ts` (AppSettings)
```typescript
export interface AppSettings {
  // ... existing fields
  newproviderKey: string;
}
```

### Step 3: Add key to DEFAULT_SETTINGS
```typescript
export const DEFAULT_SETTINGS = {
  // ...
  newproviderKey: '',
};
```

### Step 4: Add key input in `src/components/ProviderSettings.tsx`
The provider grid and API keys list are auto-generated from `AI_PROVIDERS`. If your provider uses `openai-compatible` mode, no additional hook changes needed.

### Step 5: For custom API modes
If your provider has a non-standard API, add a handler in `src/hooks/useMultiAI.ts` following the pattern of `sendAnthropic` or `sendCohere`.

### Step 6: Build & test
```bash
npm run build
```

---

## 🎨 Adding a New Theme

### Step 1: Add to `src/types.ts`
```typescript
export type ThemeId = 'red' | 'cyan' | 'purple' | 'green' | 'amber' | 'rose' | 'newtheme';

export const THEMES: ThemeConfig[] = [
  // ... existing themes
  {
    id: 'newtheme',
    name: 'Theme Name',
    primary: '#HEX',
    secondary: '#HEX',
    accent: '#HEX',
    glow: '#HEX',
  },
];
```

The theme auto-applies to orb, buttons, badges, scrollbars, and chat bubbles. No component changes needed.

---

## 📝 Code Style

### TypeScript
- Use `type` for unions, `interface` for objects
- Use `const` by default, `let` only if reassigned
- Use async/await, not Promise chains
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### React
- Functional components only (no classes)
- Hooks at top of component
- `useCallback` for functions passed as props
- `useMemo` for expensive computations
- `useRef` for mutable values that shouldn't trigger re-renders

### CSS
- Use Tailwind utility classes
- Custom styles via `style={{}}` only for dynamic colors
- No separate CSS files (except index.css for globals)
- Dark theme only (background: `#050505`)

### Naming
- Components: `PascalCase` (e.g., `ChatPanel.tsx`)
- Hooks: `useCamelCase` (e.g., `useMultiAI.ts`)
- Types: `PascalCase` (e.g., `ProviderConfig`)
- Functions: `camelCase` (e.g., `getSystemPrompt`)

---

## 📦 Dependencies

### Adding a new NPM package
```bash
npm install package-name
```
**Before adding:**
- Is it really needed? MYRA aims to be lightweight.
- Does it increase bundle size significantly?
- Can the feature be implemented with existing APIs?

### Current production dependencies
- `react`, `react-dom` — UI framework
- `@google/generative-ai` — Gemini SDK
- `tailwindcss`, `clsx`, `tailwind-merge` — Styling

---

## 🚫 What NOT to Add

- **CSS frameworks** (Bootstrap, Material UI) — Tailwind only
- **State management libraries** (Redux, Zustand) — React hooks only
- **Router libraries** (React Router) — Single page app
- **Large icon libraries** — SVG inline only
- **Analytics/Sentry** — Privacy-first, no tracking

---

## 📄 Pull Request Checklist

- [ ] Build passes (`npm run build`)
- [ ] No new TypeScript errors
- [ ] Feature works in Chrome
- [ ] Feature works in Safari (if using standard APIs)
- [ ] Existing features not broken
- [ ] README updated if needed
- [ ] Relevant .md files updated

---

## 💬 Questions?

Open an issue or discussion. Happy coding! 🚀
