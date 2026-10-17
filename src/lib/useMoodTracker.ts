'use client';

import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { MoodEntry, MoodLevel, SevenDayOverviewDay } from '@/types/mood';
import {
  getMoodEntries,
  saveTodayMoodEntry,
  deleteMoodEntry,
  buildSevenDayOverview,
  getLocalTodayDateKey,
} from './moodStorage';
import { STORAGE_KEYS, STORAGE_EVENTS, safeGetItem } from './storageManager';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(STORAGE_EVENTS.MOOD_CHANGE, callback);
  window.addEventListener(STORAGE_EVENTS.STORAGE_CLEARED, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(STORAGE_EVENTS.MOOD_CHANGE, callback);
    window.removeEventListener(STORAGE_EVENTS.STORAGE_CLEARED, callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRawStorage = '';
let cachedEntries: MoodEntry[] = [];

function getEntriesSnapshot(): MoodEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = safeGetItem(STORAGE_KEYS.MOOD_ENTRIES) || '';
    if (raw !== cachedRawStorage) {
      cachedRawStorage = raw;
      cachedEntries = getMoodEntries();
    }
  } catch {
    return cachedEntries;
  }
  return cachedEntries;
}

const SERVER_SNAPSHOT: MoodEntry[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function getClientLoaded() {
  return true;
}
function getServerLoaded() {
  return false;
}

const EMPTY_OVERVIEW: SevenDayOverviewDay[] = [];

export function useMoodTracker() {
  const entries = useSyncExternalStore(subscribe, getEntriesSnapshot, getServerSnapshot);
  const isLoaded = useSyncExternalStore(subscribe, getClientLoaded, getServerLoaded);

  // Derive todayEntry with reference stability to prevent infinite re-render loops
  const todayEntry = useMemo(() => {
    if (!isLoaded || entries.length === 0) return null;
    const todayKey = getLocalTodayDateKey();
    return entries.find((e) => e.dateKey === todayKey) || null;
  }, [entries, isLoaded]);

  // Derive sevenDayOverview with reference stability to prevent infinite re-render loops
  const sevenDayOverview = useMemo(() => {
    if (!isLoaded) return EMPTY_OVERVIEW;
    return buildSevenDayOverview(entries);
  }, [entries, isLoaded]);

  const saveMood = useCallback((level: MoodLevel, note?: string) => {
    return saveTodayMoodEntry({ level, note });
  }, []);

  const removeMood = useCallback((id: string) => {
    return deleteMoodEntry(id);
  }, []);

  return {
    entries,
    todayEntry,
    sevenDayOverview,
    isLoaded,
    saveMood,
    removeMood,
  };
}
