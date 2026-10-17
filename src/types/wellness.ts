export type EmotionCategory = 'pleasant' | 'neutral' | 'heavy';

export interface EmotionItem {
  id: string;
  name: string;
  category: EmotionCategory;
  color: string;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  moodId?: string;
  moodName?: string;
  prompt: string;
  response: string;
  createdAt: number;
}

export interface PracticeSession {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  category: 'breathing' | 'pause' | 'grounding' | 'reflection';
  description: string;
}
