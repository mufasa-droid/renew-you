import { MoodConfig, MoodLevel } from '@/types/mood';

export const MOOD_CONFIGS: Record<MoodLevel, MoodConfig> = {
  'very-low': {
    level: 'very-low',
    label: 'Very low',
    description: 'Heavy, overwhelmed, or deeply drained',
    color: '#4B3696',
    bgColor: '#F0ECFA',
    borderColor: '#D4CBEF',
    score: 1,
  },
  'low': {
    level: 'low',
    label: 'Low',
    description: 'A bit strained, unsettled, or subdued',
    color: '#7E67CA',
    bgColor: '#F5F2FC',
    borderColor: '#E2DBF5',
    score: 2,
  },
  'okay': {
    level: 'okay',
    label: 'Okay',
    description: 'Steady, neutral, or managing quietly',
    color: '#736B84',
    bgColor: '#F8F6FD',
    borderColor: '#ECE7F6',
    score: 3,
  },
  'good': {
    level: 'good',
    label: 'Good',
    description: 'Content, peaceful, and grounded',
    color: '#3DB88F',
    bgColor: '#EEF9F5',
    borderColor: '#C7EDDF',
    score: 4,
  },
  'excellent': {
    level: 'excellent',
    label: 'Excellent',
    description: 'Joyful, vibrant, and deeply renewed',
    color: '#289E75',
    bgColor: '#E5F6F0',
    borderColor: '#A8E3CF',
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
