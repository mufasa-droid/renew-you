import { MoodEntry, MoodLevel, SevenDayOverviewDay } from '@/types/mood';
import { MOOD_CONFIGS } from './moodConstants';

const STORAGE_KEY = 'renew_you_mood_entries_v1';
export const MOOD_CHANGE_EVENT = 'renew_you_mood_change';

/**
 * Returns the current local calendar date formatted as YYYY-MM-DD.
 * Internal representation standard for all dates in Renew You.
 */
export function getLocalTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts a YYYY-MM-DD dateKey into a human-readable local date string.
 * Uses local calendar components to prevent UTC boundary shifts.
 */
export function formatDisplayDate(dateKey: string): string {
  try {
    const parts = dateKey.split('-');
    if (parts.length !== 3) return dateKey;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateKey;
  }
}

/**
 * Validates whether an unknown object adheres to the MoodEntry contract.
 */
function isValidMoodEntry(item: unknown): item is MoodEntry {
  if (!item || typeof item !== 'object') return false;
  const entry = item as Record<string, unknown>;

  const validLevels: MoodLevel[] = ['very-low', 'low', 'okay', 'good', 'excellent'];

  return (
    typeof entry.id === 'string' &&
    typeof entry.dateKey === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.dateKey) &&
    typeof entry.level === 'string' &&
    validLevels.includes(entry.level as MoodLevel) &&
    typeof entry.label === 'string' &&
    typeof entry.createdAt === 'string'
  );
}

/**
 * Safely fetches all mood entries from localStorage.
 * Filters out malformed data gracefully.
 */
export function getMoodEntries(): MoodEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validEntries = parsed.filter(isValidMoodEntry);

    // Sort descending by dateKey (newest first)
    return validEntries.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  } catch {
    // Malformed JSON handled gracefully by returning empty array
    return [];
  }
}

/**
 * Retrieves today's mood check-in if one exists for the current local calendar day.
 */
export function getTodayMoodEntry(): MoodEntry | null {
  const todayKey = getLocalTodayDateKey();
  const entries = getMoodEntries();
  return entries.find((e) => e.dateKey === todayKey) || null;
}

/**
 * Saves a mood entry for the current day.
 * If an entry already exists for today, it edits/updates it in place.
 * Ensures strict 1-entry-per-calendar-day policy.
 */
export function saveTodayMoodEntry(input: {
  level: MoodLevel;
  note?: string;
}): MoodEntry {
  if (typeof window === 'undefined') {
    throw new Error('Storage is only accessible in client-side context');
  }

  const todayKey = getLocalTodayDateKey();
  const displayDate = formatDisplayDate(todayKey);
  const config = MOOD_CONFIGS[input.level];
  const nowIso = new Date().toISOString();

  const entries = getMoodEntries();
  const existingIndex = entries.findIndex((e) => e.dateKey === todayKey);

  let savedEntry: MoodEntry;

  if (existingIndex >= 0) {
    // Edit existing entry for today
    const existing = entries[existingIndex];
    savedEntry = {
      ...existing,
      level: input.level,
      label: config.label,
      note: input.note ? input.note.trim() : undefined,
      updatedAt: nowIso,
    };
    entries[existingIndex] = savedEntry;
  } else {
    // Create new entry
    savedEntry = {
      id: `mood-${todayKey}-${Date.now()}`,
      dateKey: todayKey,
      displayDate,
      level: input.level,
      label: config.label,
      note: input.note ? input.note.trim() : undefined,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    entries.unshift(savedEntry);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    // Notify subscribers of the change
    window.dispatchEvent(new CustomEvent(MOOD_CHANGE_EVENT));
  } catch {
    // Storage quota or permission issues handled quietly
  }

  return savedEntry;
}

/**
 * Deletes a single mood entry by ID.
 */
export function deleteMoodEntry(id: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const entries = getMoodEntries();
    const filtered = entries.filter((e) => e.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(MOOD_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a 7-day chronological overview ending on today's local calendar day.
 */
export function getSevenDayOverview(): SevenDayOverviewDay[] {
  const entries = getMoodEntries();
  const entryMap = new Map<string, MoodEntry>();
  entries.forEach((e) => entryMap.set(e.dateKey, e));

  const days: SevenDayOverviewDay[] = [];
  const today = new Date();
  const todayKey = getLocalTodayDateKey();

  // Last 7 days: 6 days ago up to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${dayNum}`;

    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNumber = d.getDate();

    days.push({
      dateKey,
      dayName,
      dayNumber,
      isToday: dateKey === todayKey,
      entry: entryMap.get(dateKey),
    });
  }

  return days;
}
