# 🤝 Contributing to MYRA

Thank you for your interest in contributing! MYRA is open-source and welcomes contributions from developers worldwide.

**Maintainer**: [Sudhir Singh](https://github.com/SudhirDevOps1) ([@SudhirDevOps1](https://github.com/SudhirDevOps1))

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9
- **Modern browser** (Chrome/Edge recommended for full features)
- **Git**

### Quick Start
```bash
# Clone the repo
git clone https://github.com/SudhirDevOps1/myra-voice-os
cd myra-voice-os

# Install dependencies
npm install

# Start dev server
npm run dev
```
Visit `http://localhost:5173` — dev server with hot reload.

### Production Build
```bash
npm run build
# Output: dist/index.html (single file, ~470 KB / 133 KB gzipped)
```

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app entry (770+ lines)
├── types.ts                   # Shared TypeScript types
├── types/providers.ts         # 13 AI provider configurations
├── index.css                  # Global Tailwind + custom utilities
├── components/                # 24 React components
│   ├── OrbAnimation.tsx       # Canvas-drawn animated orb
│   ├── ChatPanel.tsx          # Chat with markdown
│   ├── Calculator.tsx         # 35+ formulas
│   ├── ToolsDashboard.tsx     # 12 free tools
│   ├── WeatherDashboard.tsx   # Weather forecast
│   └── ...18 more components
├── hooks/                     # 9 custom React hooks
│   ├── useMultiAI.ts          # Multi-provider AI engine
│   ├── useAudioEngine.ts      # Mic + speech recognition
│   ├── useTTS.ts              # Text-to-speech
│   └── ...6 more hooks
└── utils/cn.ts                # Tailwind className helper
```

---

## 🎨 Code Style Guide

### TypeScript
- ✅ Use `type` for unions, `interface` for objects
- ✅ Always type props explicitly
- ✅ Prefer `const` over `let`
- ✅ Use optional chaining `?.` and nullish coalescing `??`
- ❌ Never use `any` without comment justification

### React
- ✅ Functional components only
- ✅ Hooks at the top of component body
- ✅ `useCallback` for prop functions
- ✅ `useMemo` for expensive computations
- ✅ `useRef` for mutable values
- ❌ No class components

### CSS
- ✅ Tailwind utility classes
- ✅ Inline `style` only for dynamic colors/gradients
- ✅ Mobile-first responsive (`sm:`, `md:`, `lg:`)
- ❌ No separate CSS files (except `index.css`)

### Naming Conventions
- **Components**: `PascalCase.tsx` (e.g., `ChatPanel.tsx`)
- **Hooks**: `useCamelCase.ts` (e.g., `useMultiAI.ts`)
- **Types**: `PascalCase` (e.g., `ProviderConfig`)
- **Functions**: `camelCase` (e.g., `getSystemPrompt`)
- **Constants**: `SCREAMING_SNAKE_CASE`

---

## 🧪 Testing Your Changes

### Build Test (Required)
```bash
npm run build
```
Must complete without errors.

### Type Check
```bash
npx tsc --noEmit
```
Should have ≤ 5 minor warnings (mostly unused variables).

### Manual Testing Checklist
- [ ] App loads in Chrome without errors
- [ ] All 6 themes apply correctly
- [ ] Mic button responds to tap
- [ ] Settings persist after reload
- [ ] All 12 dashboard tools open
- [ ] Calculator formulas calculate correctly
- [ ] Voice TTS works (English + Hindi)
- [ ] API key validation works
- [ ] Demo mode works without key
- [ ] Footer displays Sudhir Singh credentials

---

## 🎨 Adding a New AI Provider

### Step 1: Add to `src/types/providers.ts`
```typescript
{
  id: 'newprovider',
  name: 'New Provider Name',
  shortName: 'NewProv',
  icon: '🆕',
  color: '#HEX',
  keyField: 'newproviderKey',
  keyLabel: 'New Provider API Key',
  keyPlaceholder: 'sk-...',
  mode: 'openai-compatible',
  endpoint: 'https://api.newprovider.com/v1/chat/completions',
  defaultModel: 'model-name',
  models: [
    { id: 'model-1', label: 'Model 1', free: true },
    // ...20+ models
  ],
}
```

### Step 2: Add API key field to `src/types.ts`
```typescript
export interface AppSettings {
  // ...existing
  newproviderKey: string;
}
```

### Step 3: Add to `DEFAULT_SETTINGS`
```typescript
newproviderKey: '',
```

### Step 4: Build & test
```bash
npm run build
```

---

## 🛠️ Adding a New Tool to Dashboard

### Step 1: Edit `src/components/ToolsDashboard.tsx`

```typescript
// Add to toolTabs array
{ key: 'newtool', icon: '🔧', label: 'NewTool' }

// Add fetch function
async function fetchNewTool() {
  return await safeFetch('https://api.example.com/data');
}

// Add render block
{activeTool === 'newtool' && (
  <div className="space-y-3">
    {/* Your UI */}
  </div>
)}
```

### Step 2: Test
- Click new tool tab
- Verify data fetches and displays
- Handle errors gracefully

---

## 🧮 Adding a New Calculator Formula

Edit `src/components/Calculator.tsx` → `FORMULAS` array:

```typescript
{
  id: 'unique-id',
  name: 'Formula Name',
  icon: '🔢',
  category: 'Math', // Health/Finance/Math/Physics/Conversion/Date
  inputs: [
    { key: 'x', label: 'X', placeholder: '10' },
    { key: 'y', label: 'Y', placeholder: '20' },
  ],
  calculate: ({ x, y }) => {
    return `Result = ${x + y}`;
  },
  formula: 'X + Y',
}
```

---

## 🎨 Adding a New Theme

Edit `src/types.ts` → `THEMES` array:

```typescript
{
  id: 'newtheme',
  name: 'Theme Name',
  primary: '#HEX',
  secondary: '#HEX',
  accent: '#HEX',
  glow: '#HEX',
}
```

Theme auto-applies everywhere — no other changes needed.

---

## 📦 Adding NPM Dependencies

**Before adding:**
- ❓ Is it really needed?
- ❓ Does it increase bundle size > 50 KB?
- ❓ Can it be done with existing APIs?

**Current production deps** (keep minimal):
- `react`, `react-dom` — UI framework
- `@google/generative-ai` — Gemini SDK
- `tailwindcss`, `clsx`, `tailwind-merge` — Styling

---

## 🚫 What NOT to Add

| Avoid | Reason |
|-------|--------|
| Bootstrap, Material UI, Chakra | Tailwind only |
| Redux, Zustand, MobX | React hooks suffice |
| React Router | Single-page app |
| Lodash, Moment, date-fns | Use native APIs |
| Large icon libraries | Inline SVG/emoji |
| Analytics, Sentry | Privacy-first |

---

## 📄 Pull Request Checklist

Before opening a PR:

- [ ] Build passes: `npm run build`
- [ ] TypeScript clean: `npx tsc --noEmit`
- [ ] Tested in Chrome
- [ ] Tested in Safari (if possible)
- [ ] Existing features not broken
- [ ] README/FEATURES.md updated if needed
- [ ] Footer credits preserved (Sudhir Singh)
- [ ] No `console.log` in production code
- [ ] Code formatted consistently
- [ ] Commit message clear and descriptive

### Commit Message Format
```
type(scope): description

Examples:
feat(calculator): add 50 new physics formulas
fix(audio): resolve mic permission bug on Safari
docs(readme): update installation steps
chore(deps): upgrade React to 19.2
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

---

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Browser**: Chrome 120, Safari 17, etc.
2. **OS**: Windows 11, macOS 14, Android 13
3. **Steps to reproduce**: Exact clicks/inputs
4. **Expected behavior**
5. **Actual behavior**
6. **Console errors**: F12 → Console tab
7. **Screenshots**: If UI bug

---

## ⭐ Feature Requests

Before requesting:
1. Check [FEATURES.md](./FEATURES.md) — might already exist
2. Check [LIMITATIONS.md](./LIMITATIONS.md) — known issue
3. Search existing issues

When requesting:
1. Clear use case ("As a user, I want...")
2. Why current solution doesn't work
3. Mockup/example if UI feature

---

## 💬 Community

- **GitHub**: [SudhirDevOps1](https://github.com/SudhirDevOps1)
- **Issues**: Bug reports and discussions
- **Discussions**: Feature ideas and Q&A

---

## 📜 License

By contributing, you agree your contributions will be licensed under MIT.

---

## 🙏 Thanks!

Every contribution, big or small, makes MYRA better. Whether it's:
- 🐛 Reporting a bug
- 💡 Suggesting a feature
- 📝 Improving docs
- 🎨 Designing UI
- ⚙️ Writing code

You're awesome! Thank you 💖

---

**Maintained by [Sudhir Singh](https://github.com/SudhirDevOps1)** • [@SudhirDevOps1](https://github.com/SudhirDevOps1)

Made in 🇮🇳 India
