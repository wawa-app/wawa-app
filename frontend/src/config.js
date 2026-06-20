import { EXPO_PUBLIC_OPENAI_API_KEY as ENV_OPENAI_API_KEY, WAWA_OPENAI_API_KEY } from '@env';

export const OPENAI_API_KEY = (
  WAWA_OPENAI_API_KEY ||
  ENV_OPENAI_API_KEY ||
  EXPO_PUBLIC_OPENAI_API_KEY ||
  ''
).trim();
export const OPENAI_MODEL = 'gpt-4o-mini';
