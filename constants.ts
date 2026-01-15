import { Vibe } from './types';

export const DEFAULT_STAPLES = [
  "Olive Oil",
  "Salt",
  "Pepper",
  "Garlic Powder",
  "Soy Sauce",
  "Rice",
  "Water",
  "Sugar/Honey",
  "Vinegar"
];

export const VIBE_DETAILS: Record<Vibe, { emoji: string; desc: string; color: string }> = {
  [Vibe.CLEAN_LEAN]: { emoji: '🥗', desc: 'Low cal, high volume', color: 'text-emerald-400' },
  [Vibe.BULK]: { emoji: '💪', desc: 'Max protein & cals', color: 'text-blue-400' },
  [Vibe.SPEED_RUN]: { emoji: '⚡', desc: '<15 mins, fast', color: 'text-yellow-400' },
  [Vibe.COMFORT]: { emoji: '🏠', desc: 'Warm & hearty', color: 'text-orange-400' },
  [Vibe.SCAVENGER]: { emoji: '🗑️', desc: 'Use rotting stuff', color: 'text-purple-400' },
};