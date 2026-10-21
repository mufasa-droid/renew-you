import { MoodConfig, MoodLevel } from '@/types/mood';

export const MOOD_CONFIGS: Record<MoodLevel, MoodConfig> = {
  'very-low': {
    level: 'very-low',
    label: 'Very low',
    description: 'Heavy',
    color: '#475569',
    bgColor: '#F1F5F9',
    borderColor: '#94A3B8',
    score: 1,
  },
  'low': {
    level: 'low',
    label: 'Low',
    description: 'A bit down',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    score: 2,
  },
  'okay': {
    level: 'okay',
    label: 'Okay',
    description: 'Steady',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    score: 3,
  },
  'good': {
    level: 'good',
    label: 'Good',
    description: 'Content',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    score: 4,
  },
  'excellent': {
    level: 'excellent',
    label: 'Excellent',
    description: 'Joyful',
    color: '#7C3AED',
    bgColor: '#FAF5FF',
    borderColor: '#DDD6FE',
    score: 5,
  },
};

export const MOOD_LEVELS_ORDERED: MoodLevel[] = [
  'very-low',
  'low',
  'okay',
  'good',
  'excellent',
];
