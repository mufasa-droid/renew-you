export type MoodLevel = 'very-low' | 'low' | 'okay' | 'good' | 'excellent';

export interface MoodConfig {
  level: MoodLevel;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  score: number; // 1 to 5
}

export interface MoodEntry {
  id: string;
  dateKey: string; // Internal representation: 'YYYY-MM-DD' in local time
  displayDate: string; // User-facing formatted date, e.g. "Saturday, Oct 17, 2026"
  level: MoodLevel;
  label: string;
  note?: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface SevenDayOverviewDay {
  dateKey: string;
  dayName: string; // e.g. "Mon", "Tue"
  dayNumber: number; // e.g. 17
  isToday: boolean;
  entry?: MoodEntry;
}
