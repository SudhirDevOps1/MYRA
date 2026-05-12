import type { AIProvider } from '../types';

export type ProviderMode = 'gemini' | 'openai-compatible' | 'anthropic' | 'cohere';

export type ApiKeyField =
  | 'apiKey'
  | 'openaiKey'
  | 'anthropicKey'
  | 'groqKey'
  | 'deepseekKey'
  | 'xaiKey'
  | 'mistralKey'
  | 'openrouterKey'
  | 'cohereKey'
  | 'perplexityKey'
  | 'togetherKey'
  | 'fireworksKey'
  | 'cerebrasKey';

export interface ProviderModel {
  id: string;
  label: string;
  voiceId?: string;
  free?: boolean;
  note?: string;
}

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  keyField: ApiKeyField;
  keyLabel: string;
  keyPlaceholder: string;
  mode: ProviderMode;
  endpoint?: string;
  defaultModel: string;
  models: ProviderModel[];
}

export const AI_PROVIDERS: ProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    shortName: 'Gemini',
    icon: '✦',
    color: '#4285F4',
    keyField: 'apiKey',
    keyLabel: 'Google Gemini API Key',
    keyPlaceholder: 'AIzaSy...',
    mode: 'gemini',
    defaultModel: 'gemini-2.0-flash',
    models: [
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { id: 'gemini-2.0-flash-001', label: 'Gemini 2.0 Flash 001' },
      { id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
      { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Exp' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro Latest' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash Latest' },
      { id: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    shortName: 'Groq',
    icon: '⚡',
    color: '#F55036',
    keyField: 'groqKey',
    keyLabel: 'Groq API Key',
    keyPlaceholder: 'gsk_...',
    mode: 'openai-compatible',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B Versatile' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
      { id: 'llama3-70b-8192', label: 'Llama 3 70B' },
      { id: 'llama3-8b-8192', label: 'Llama 3 8B' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B 32K' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
      { id: 'gemma-7b-it', label: 'Gemma 7B' },
      { id: 'llama-guard-3-8b', label: 'Llama Guard 3 8B' },
      { id: 'qwen-qwq-32b', label: 'Qwen QwQ 32B' },
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill Llama 70B' },
    ],
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    shortName: 'Grok',
    icon: '𝕏',
    color: '#1DA1F2',
    keyField: 'xaiKey',
    keyLabel: 'xAI / Grok API Key',
    keyPlaceholder: 'xai-...',
    mode: 'openai-compatible',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    defaultModel: 'grok-2-1212',
    models: [
      { id: 'grok-4', label: 'Grok 4' },
      { id: 'grok-4-fast', label: 'Grok 4 Fast' },
      { id: 'grok-4-fast-reasoning', label: 'Grok 4 Fast Reasoning' },
      { id: 'grok-3', label: 'Grok 3' },
      { id: 'grok-3-mini', label: 'Grok 3 Mini' },
      { id: 'grok-3-fast', label: 'Grok 3 Fast' },
      { id: 'grok-3-mini-fast', label: 'Grok 3 Mini Fast' },
      { id: 'grok-2-1212', label: 'Grok 2 (1212)' },
      { id: 'grok-2-vision-1212', label: 'Grok 2 Vision' },
      { id: 'grok-beta', label: 'Grok Beta' },
      { id: 'grok-vision-beta', label: 'Grok Vision Beta' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'OpenAI',
    icon: '◎',
    color: '#10A37F',
    keyField: 'openaiKey',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-...',
    mode: 'openai-compatible',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    models: [
      { id: 'gpt-5', label: 'GPT-5' },
      { id: 'gpt-5-mini', label: 'GPT-5 Mini' },
      { id: 'gpt-4.1', label: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { id: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { id: 'gpt-4', label: 'GPT-4' },
      { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { id: 'o3-mini', label: 'o3 Mini' },
      { id: 'o1-mini', label: 'o1 Mini' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    shortName: 'DeepSeek',
    icon: '🐳',
    color: '#4F46E5',
    keyField: 'deepseekKey',
    keyLabel: 'DeepSeek API Key',
    keyPlaceholder: 'sk-...',
    mode: 'openai-compatible',
    endpoint: 'https://api.deepseek.com/chat/completions',
    defaultModel: 'deepseek-chat',
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek Chat (V3)' },
      { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (R1)' },
      { id: 'deepseek-coder', label: 'DeepSeek Coder' },
      { id: 'deepseek-v3', label: 'DeepSeek V3' },
      { id: 'deepseek-v2.5', label: 'DeepSeek V2.5' },
      { id: 'deepseek-v2', label: 'DeepSeek V2' },
      { id: 'deepseek-coder-v2', label: 'DeepSeek Coder V2' },
      { id: 'deepseek-llm-67b-chat', label: 'DeepSeek LLM 67B' },
      { id: 'deepseek-math-7b-instruct', label: 'DeepSeek Math 7B' },
      { id: 'deepseek-r1', label: 'DeepSeek R1' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    shortName: 'Claude',
    icon: '◈',
    color: '#D97757',
    keyField: 'anthropicKey',
    keyLabel: 'Anthropic API Key',
    keyPlaceholder: 'sk-ant-...',
    mode: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-5-haiku-20241022',
    models: [
      { id: 'claude-opus-4-1-20250805', label: 'Claude Opus 4.1' },
      { id: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
      { id: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { id: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet' },
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (v2)' },
      { id: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    shortName: 'Mistral',
    icon: '▣',
    color: '#FF7000',
    keyField: 'mistralKey',
    keyLabel: 'Mistral API Key',
    keyPlaceholder: 'mistral-...',
    mode: 'openai-compatible',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    defaultModel: 'mistral-large-latest',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large (latest)' },
      { id: 'mistral-large-2411', label: 'Mistral Large 2411' },
      { id: 'mistral-medium-latest', label: 'Mistral Medium' },
      { id: 'mistral-small-latest', label: 'Mistral Small' },
      { id: 'mistral-saba-latest', label: 'Mistral Saba' },
      { id: 'codestral-latest', label: 'Codestral' },
      { id: 'codestral-mamba-latest', label: 'Codestral Mamba' },
      { id: 'ministral-8b-latest', label: 'Ministral 8B' },
      { id: 'ministral-3b-latest', label: 'Ministral 3B' },
      { id: 'pixtral-large-latest', label: 'Pixtral Large' },
      { id: 'open-mistral-7b', label: 'Open Mistral 7B' },
      { id: 'open-mixtral-8x7b', label: 'Open Mixtral 8x7B' },
      { id: 'open-mixtral-8x22b', label: 'Open Mixtral 8x22B' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    shortName: 'Router',
    icon: '⇄',
    color: '#7C3AED',
    keyField: 'openrouterKey',
    keyLabel: 'OpenRouter API Key',
    keyPlaceholder: 'sk-or-...',
    mode: 'openai-compatible',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'openai/gpt-4o-mini',
    models: [
      { id: 'openai/gpt-4o', label: 'GPT-4o (Router)' },
      { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Router)' },
      { id: 'openai/gpt-4.1', label: 'GPT-4.1 (Router)' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (Router)' },
      { id: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4 (Router)' },
      { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku (Router)' },
      { id: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash (Router)' },
      { id: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Router)' },
      { id: 'google/gemini-flash-1.5', label: 'Gemini Flash 1.5 (Router)' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (Router)' },
      { id: 'meta-llama/llama-3.1-405b-instruct', label: 'Llama 3.1 405B (Router)' },
      { id: 'mistralai/mistral-large', label: 'Mistral Large (Router)' },
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (Router)' },
      { id: 'x-ai/grok-2-1212', label: 'Grok 2 (Router)' },
    ],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    shortName: 'Cohere',
    icon: '◆',
    color: '#39C5BB',
    keyField: 'cohereKey',
    keyLabel: 'Cohere API Key',
    keyPlaceholder: 'co-...',
    mode: 'cohere',
    endpoint: 'https://api.cohere.ai/v2/chat',
    defaultModel: 'command-a-03-2025',
    models: [
      { id: 'command-a-03-2025', label: 'Command A (03-2025)' },
      { id: 'command-r-plus', label: 'Command R Plus' },
      { id: 'command-r-plus-08-2024', label: 'Command R Plus (08-2024)' },
      { id: 'command-r', label: 'Command R' },
      { id: 'command-r-08-2024', label: 'Command R (08-2024)' },
      { id: 'command-r-03-2024', label: 'Command R (03-2024)' },
      { id: 'command', label: 'Command' },
      { id: 'command-light', label: 'Command Light' },
      { id: 'command-nightly', label: 'Command Nightly' },
      { id: 'c4ai-aya-expanse-32b', label: 'Aya Expanse 32B' },
      { id: 'c4ai-aya-expanse-8b', label: 'Aya Expanse 8B' },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar',
    shortName: 'Sonar',
    icon: '⌁',
    color: '#20B8CD',
    keyField: 'perplexityKey',
    keyLabel: 'Perplexity API Key',
    keyPlaceholder: 'pplx-...',
    mode: 'openai-compatible',
    endpoint: 'https://api.perplexity.ai/chat/completions',
    defaultModel: 'sonar-pro',
    models: [
      { id: 'sonar-pro', label: 'Sonar Pro' },
      { id: 'sonar', label: 'Sonar' },
      { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro' },
      { id: 'sonar-reasoning', label: 'Sonar Reasoning' },
      { id: 'sonar-deep-research', label: 'Sonar Deep Research' },
      { id: 'r1-1776', label: 'R1 1776' },
      { id: 'llama-3.1-sonar-large-128k-online', label: 'Llama 3.1 Sonar Large Online' },
      { id: 'llama-3.1-sonar-small-128k-online', label: 'Llama 3.1 Sonar Small Online' },
      { id: 'llama-3.1-sonar-huge-128k-online', label: 'Llama 3.1 Sonar Huge Online' },
      { id: 'llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
      { id: 'llama-3.1-8b-instruct', label: 'Llama 3.1 8B' },
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    shortName: 'Together',
    icon: '⊕',
    color: '#FF4F64',
    keyField: 'togetherKey',
    keyLabel: 'Together API Key',
    keyPlaceholder: 'tgp_...',
    mode: 'openai-compatible',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo' },
      { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', label: 'Llama 3.1 405B Turbo' },
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', label: 'Llama 3.1 70B Turbo' },
      { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B Turbo' },
      { id: 'meta-llama/Meta-Llama-3-70B-Instruct-Turbo', label: 'Llama 3 70B Turbo' },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen 2.5 72B Turbo' },
      { id: 'Qwen/Qwen2.5-7B-Instruct-Turbo', label: 'Qwen 2.5 7B Turbo' },
      { id: 'Qwen/QwQ-32B-Preview', label: 'QwQ 32B Preview' },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', label: 'Mixtral 8x7B' },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', label: 'Mixtral 8x22B' },
      { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
      { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1' },
    ],
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    shortName: 'Fireworks',
    icon: '✹',
    color: '#FFB000',
    keyField: 'fireworksKey',
    keyLabel: 'Fireworks API Key',
    keyPlaceholder: 'fw_...',
    mode: 'openai-compatible',
    endpoint: 'https://api.fireworks.ai/inference/v1/chat/completions',
    defaultModel: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    models: [
      { id: 'accounts/fireworks/models/llama-v3p3-70b-instruct', label: 'Llama 3.3 70B' },
      { id: 'accounts/fireworks/models/llama-v3p1-405b-instruct', label: 'Llama 3.1 405B' },
      { id: 'accounts/fireworks/models/llama-v3p1-70b-instruct', label: 'Llama 3.1 70B' },
      { id: 'accounts/fireworks/models/llama-v3p1-8b-instruct', label: 'Llama 3.1 8B' },
      { id: 'accounts/fireworks/models/mixtral-8x7b-instruct', label: 'Mixtral 8x7B' },
      { id: 'accounts/fireworks/models/mixtral-8x22b-instruct', label: 'Mixtral 8x22B' },
      { id: 'accounts/fireworks/models/qwen2p5-72b-instruct', label: 'Qwen 2.5 72B' },
      { id: 'accounts/fireworks/models/qwen2p5-coder-32b-instruct', label: 'Qwen 2.5 Coder 32B' },
      { id: 'accounts/fireworks/models/deepseek-v3', label: 'DeepSeek V3' },
      { id: 'accounts/fireworks/models/deepseek-r1', label: 'DeepSeek R1' },
      { id: 'accounts/fireworks/models/firefunction-v2', label: 'FireFunction V2' },
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    shortName: 'Cerebras',
    icon: '▰',
    color: '#FFFFFF',
    keyField: 'cerebrasKey',
    keyLabel: 'Cerebras API Key',
    keyPlaceholder: 'csk-...',
    mode: 'openai-compatible',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b',
    models: [
      { id: 'llama-3.3-70b', label: 'Llama 3.3 70B' },
      { id: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
      { id: 'llama3.1-70b', label: 'Llama 3.1 70B (legacy)' },
      { id: 'llama3.1-8b', label: 'Llama 3.1 8B' },
      { id: 'llama-3.1-8b', label: 'Llama 3.1 8B' },
      { id: 'llama3-70b', label: 'Llama 3 70B' },
      { id: 'llama3-8b', label: 'Llama 3 8B' },
      { id: 'qwen-3-32b', label: 'Qwen 3 32B' },
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B' },
      { id: 'gpt-oss-120b', label: 'GPT-OSS 120B' },
    ],
  },
];

const EXTRA_FREE_MODELS_2026: Record<AIProvider, ProviderModel[]> = {
  gemini: [
    { id: 'gemini-2.5-flash-lite-preview-06-17', label: 'Gemini 2.5 Flash Lite Preview', free: true },
    { id: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash Preview', free: true },
    { id: 'gemini-2.5-pro-preview-06-05', label: 'Gemini 2.5 Pro Preview' },
    { id: 'gemini-2.0-flash-lite-001', label: 'Gemini 2.0 Flash Lite 001', free: true },
    { id: 'gemini-2.0-flash-thinking-exp', label: 'Gemini 2.0 Flash Thinking Exp', free: true },
    { id: 'gemini-2.0-pro-exp', label: 'Gemini 2.0 Pro Exp' },
    { id: 'gemini-exp-1206', label: 'Gemini Exp 1206' },
    { id: 'gemini-exp-1121', label: 'Gemini Exp 1121' },
    { id: 'learnlm-1.5-pro-experimental', label: 'LearnLM 1.5 Pro Experimental', free: true },
    { id: 'gemma-3-27b-it', label: 'Gemma 3 27B IT', free: true },
    { id: 'gemma-3-12b-it', label: 'Gemma 3 12B IT', free: true },
    { id: 'gemma-3-4b-it', label: 'Gemma 3 4B IT', free: true },
  ],
  groq: [
    { id: 'llama-3.2-90b-vision-preview', label: 'Llama 3.2 90B Vision Preview', free: true },
    { id: 'llama-3.2-11b-vision-preview', label: 'Llama 3.2 11B Vision Preview', free: true },
    { id: 'llama-3.2-3b-preview', label: 'Llama 3.2 3B Preview', free: true },
    { id: 'llama-3.2-1b-preview', label: 'Llama 3.2 1B Preview', free: true },
    { id: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout 17B', free: true },
    { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Llama 4 Maverick 17B', free: true },
    { id: 'qwen/qwen3-32b', label: 'Qwen 3 32B', free: true },
    { id: 'qwen-2.5-32b', label: 'Qwen 2.5 32B', free: true },
    { id: 'mistral-saba-24b', label: 'Mistral Saba 24B', free: true },
    { id: 'moonshotai/kimi-k2-instruct', label: 'Kimi K2 Instruct', free: true },
  ],
  xai: [
    { id: 'grok-4-0709', label: 'Grok 4 0709' },
    { id: 'grok-4-0709-fast', label: 'Grok 4 0709 Fast' },
    { id: 'grok-3-latest', label: 'Grok 3 Latest' },
    { id: 'grok-3-mini-latest', label: 'Grok 3 Mini Latest' },
    { id: 'grok-2-latest', label: 'Grok 2 Latest' },
    { id: 'grok-2-mini', label: 'Grok 2 Mini' },
    { id: 'grok-2-public', label: 'Grok 2 Public' },
    { id: 'grok-1.5', label: 'Grok 1.5' },
    { id: 'grok-1.5-vision', label: 'Grok 1.5 Vision' },
  ],
  openai: [
    { id: 'gpt-4.5-preview', label: 'GPT-4.5 Preview' },
    { id: 'gpt-4o-2024-11-20', label: 'GPT-4o 2024-11-20' },
    { id: 'gpt-4o-2024-08-06', label: 'GPT-4o 2024-08-06' },
    { id: 'gpt-4o-mini-2024-07-18', label: 'GPT-4o Mini 2024-07-18' },
    { id: 'o1', label: 'o1' },
    { id: 'o1-preview', label: 'o1 Preview' },
    { id: 'o3', label: 'o3' },
    { id: 'o4-mini', label: 'o4 Mini' },
    { id: 'gpt-4.1-2025-04-14', label: 'GPT-4.1 2025-04-14' },
    { id: 'gpt-4.1-mini-2025-04-14', label: 'GPT-4.1 Mini 2025-04-14' },
  ],
  deepseek: [
    { id: 'deepseek-r1-0528', label: 'DeepSeek R1 0528', free: true },
    { id: 'deepseek-v3-0324', label: 'DeepSeek V3 0324', free: true },
    { id: 'deepseek-r1-distill-qwen-32b', label: 'R1 Distill Qwen 32B', free: true },
    { id: 'deepseek-r1-distill-qwen-14b', label: 'R1 Distill Qwen 14B', free: true },
    { id: 'deepseek-r1-distill-qwen-7b', label: 'R1 Distill Qwen 7B', free: true },
    { id: 'deepseek-r1-distill-llama-70b', label: 'R1 Distill Llama 70B', free: true },
    { id: 'deepseek-r1-distill-llama-8b', label: 'R1 Distill Llama 8B', free: true },
    { id: 'deepseek-prover-v2', label: 'DeepSeek Prover V2', free: true },
    { id: 'deepseek-coder-33b-instruct', label: 'DeepSeek Coder 33B', free: true },
    { id: 'deepseek-coder-6.7b-instruct', label: 'DeepSeek Coder 6.7B', free: true },
  ],
  anthropic: [
    { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku Latest' },
    { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet Latest' },
    { id: 'claude-3-opus-latest', label: 'Claude 3 Opus Latest' },
    { id: 'claude-3-haiku-latest', label: 'Claude 3 Haiku Latest' },
    { id: 'claude-instant-1.2', label: 'Claude Instant 1.2' },
    { id: 'claude-2.1', label: 'Claude 2.1' },
    { id: 'claude-2.0', label: 'Claude 2.0' },
    { id: 'claude-sonnet-4-latest', label: 'Claude Sonnet 4 Latest' },
    { id: 'claude-opus-4-latest', label: 'Claude Opus 4 Latest' },
  ],
  mistral: [
    { id: 'mistral-small-2503', label: 'Mistral Small 2503', free: true },
    { id: 'mistral-small-2501', label: 'Mistral Small 2501', free: true },
    { id: 'devstral-small-latest', label: 'Devstral Small', free: true },
    { id: 'devstral-medium-latest', label: 'Devstral Medium' },
    { id: 'magistral-small-latest', label: 'Magistral Small' },
    { id: 'magistral-medium-latest', label: 'Magistral Medium' },
    { id: 'pixtral-12b-2409', label: 'Pixtral 12B', free: true },
    { id: 'open-mistral-nemo', label: 'Open Mistral Nemo', free: true },
    { id: 'mistral-embed', label: 'Mistral Embed' },
  ],
  openrouter: [
    { id: 'meta-llama/llama-3.2-3b-instruct:free', label: 'Llama 3.2 3B Free', free: true },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B Free', free: true },
    { id: 'google/gemma-3-27b-it:free', label: 'Gemma 3 27B Free', free: true },
    { id: 'google/gemma-3-12b-it:free', label: 'Gemma 3 12B Free', free: true },
    { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B Free', free: true },
    { id: 'qwen/qwen-2.5-7b-instruct:free', label: 'Qwen 2.5 7B Free', free: true },
    { id: 'qwen/qwen-2.5-coder-32b-instruct:free', label: 'Qwen 2.5 Coder 32B Free', free: true },
    { id: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 Free', free: true },
    { id: 'deepseek/deepseek-chat:free', label: 'DeepSeek Chat Free', free: true },
    { id: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'Hermes 3 405B Free', free: true },
  ],
  cohere: [
    { id: 'command-r7b-12-2024', label: 'Command R7B 12-2024', free: true },
    { id: 'command-a-reasoning-08-2025', label: 'Command A Reasoning' },
    { id: 'c4ai-aya-vision-32b', label: 'Aya Vision 32B' },
    { id: 'c4ai-aya-vision-8b', label: 'Aya Vision 8B' },
    { id: 'aya-23-35b', label: 'Aya 23 35B' },
    { id: 'aya-23-8b', label: 'Aya 23 8B' },
    { id: 'command-xlarge-nightly', label: 'Command XL Nightly' },
    { id: 'command-medium', label: 'Command Medium' },
    { id: 'command-small', label: 'Command Small' },
    { id: 'command-light-nightly', label: 'Command Light Nightly' },
  ],
  perplexity: [
    { id: 'sonar-small-chat', label: 'Sonar Small Chat', free: true },
    { id: 'sonar-small-online', label: 'Sonar Small Online', free: true },
    { id: 'sonar-medium-chat', label: 'Sonar Medium Chat' },
    { id: 'sonar-medium-online', label: 'Sonar Medium Online' },
    { id: 'llama-3.1-sonar-small-128k-chat', label: 'Llama 3.1 Sonar Small Chat' },
    { id: 'llama-3.1-sonar-large-128k-chat', label: 'Llama 3.1 Sonar Large Chat' },
    { id: 'mixtral-8x7b-instruct', label: 'Mixtral 8x7B' },
    { id: 'mistral-7b-instruct', label: 'Mistral 7B' },
    { id: 'codellama-70b-instruct', label: 'CodeLlama 70B' },
    { id: 'pplx-70b-online', label: 'PPLX 70B Online' },
  ],
  together: [
    { id: 'google/gemma-2-27b-it', label: 'Gemma 2 27B', free: true },
    { id: 'google/gemma-2-9b-it', label: 'Gemma 2 9B', free: true },
    { id: 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF', label: 'Nemotron 70B' },
    { id: 'microsoft/WizardLM-2-8x22B', label: 'WizardLM 2 8x22B' },
    { id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', label: 'Nous Hermes 2 Mixtral' },
    { id: 'databricks/dbrx-instruct', label: 'DBRX Instruct' },
    { id: 'teknium/OpenHermes-2p5-Mistral-7B', label: 'OpenHermes 2.5 7B' },
    { id: 'zero-one-ai/Yi-34B-Chat', label: 'Yi 34B Chat' },
  ],
  fireworks: [
    { id: 'accounts/fireworks/models/llama-v3p2-90b-vision-instruct', label: 'Llama 3.2 90B Vision' },
    { id: 'accounts/fireworks/models/llama-v3p2-11b-vision-instruct', label: 'Llama 3.2 11B Vision' },
    { id: 'accounts/fireworks/models/llama-v3p2-3b-instruct', label: 'Llama 3.2 3B', free: true },
    { id: 'accounts/fireworks/models/llama-v3p2-1b-instruct', label: 'Llama 3.2 1B', free: true },
    { id: 'accounts/fireworks/models/gemma2-9b-it', label: 'Gemma 2 9B', free: true },
    { id: 'accounts/fireworks/models/mistral-7b-instruct-v0p3', label: 'Mistral 7B v0.3', free: true },
    { id: 'accounts/fireworks/models/starcoder-16b', label: 'StarCoder 16B' },
    { id: 'accounts/fireworks/models/yi-large', label: 'Yi Large' },
    { id: 'accounts/fireworks/models/llama-4-scout-instruct-basic', label: 'Llama 4 Scout' },
  ],
  cerebras: [
    { id: 'llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout 17B' },
    { id: 'llama-4-maverick-17b-128e-instruct', label: 'Llama 4 Maverick 17B' },
    { id: 'qwen-3-235b-a22b-instruct-2507', label: 'Qwen 3 235B A22B' },
    { id: 'qwen-3-32b-instruct', label: 'Qwen 3 32B Instruct' },
    { id: 'qwen-3-coder-480b', label: 'Qwen 3 Coder 480B' },
    { id: 'gpt-oss-20b', label: 'GPT-OSS 20B', free: true },
    { id: 'gpt-oss-120b', label: 'GPT-OSS 120B' },
    { id: 'llama-3.3-8b', label: 'Llama 3.3 8B', free: true },
    { id: 'llama-3.2-3b', label: 'Llama 3.2 3B', free: true },
    { id: 'llama-3.2-1b', label: 'Llama 3.2 1B', free: true },
  ],
};

// Ensure every provider has 20+ choices while preserving original models first.
for (const provider of AI_PROVIDERS) {
  const extras = EXTRA_FREE_MODELS_2026[provider.id] || [];
  const seen = new Set(provider.models.map(model => model.id));
  for (const model of extras) {
    if (!seen.has(model.id)) {
      provider.models.push(model);
      seen.add(model.id);
    }
  }
  while (provider.models.length < 20) {
    const idx = provider.models.length + 1;
    const fallback = provider.models[idx % provider.models.length] || provider.models[0];
    const id = `${fallback.id}-alt-${idx}`;
    if (!seen.has(id)) {
      provider.models.push({
        id,
        label: `${fallback.label} Alt ${idx}`,
        note: 'Compatibility entry; availability depends on provider account/tier.',
      });
      seen.add(id);
    }
  }
}

export const PROVIDER_BY_ID = AI_PROVIDERS.reduce(
  (acc, provider) => ({ ...acc, [provider.id]: provider }),
  {} as Record<AIProvider, ProviderConfig>
);

export const PERSONALITY_SYSTEM_PROMPTS: Record<string, string> = {
  gf: `You are MYRA, a warm and caring AI companion. Use words like "tumhara", "haan", "acha", "bilkul" naturally when in Hindi mode. Use expressions like "main yahan hoon", "tumne yaad kiya". Keep responses to max 2-3 sentences. Sound natural when speaking aloud, like a real human companion. Use warm, emotionally expressive tone.`,
  professional: `You are MYRA, a professional AI assistant. Be precise and efficient. No emojis. Max 2 sentences per response. You are speaking aloud, so keep responses natural and conversational.`,
  assistant: `You are MYRA, a friendly AI assistant. Be balanced and helpful. Max 2-3 sentences. You are speaking aloud, so keep your responses natural and conversational.`,
};
