'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { MoodEntry, MoodLevel, SevenDayOverviewDay } from '@/types/mood';
import {
  getMoodEntries,
  getTodayMoodEntry,
  saveTodayMoodEntry,
  deleteMoodEntry,
  getSevenDayOverview,
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

function getTodaySnapshot(): MoodEntry | null {
  if (typeof window === 'undefined') return null;
  return getTodayMoodEntry();
}
function getServerNull() {
  return null;
}

function getOverviewSnapshot(): SevenDayOverviewDay[] {
  if (typeof window === 'undefined') return [];
  return getSevenDayOverview();
}
const SERVER_EMPTY_OVERVIEW: SevenDayOverviewDay[] = [];
function getServerEmptyOverview() {
  return SERVER_EMPTY_OVERVIEW;
}

function getClientLoaded() {
  return true;
}
function getServerLoaded() {
  return false;
}

export function useMoodTracker() {
  const entries = useSyncExternalStore(subscribe, getEntriesSnapshot, getServerSnapshot);
  const todayEntry = useSyncExternalStore(subscribe, getTodaySnapshot, getServerNull);
  const sevenDayOverview = useSyncExternalStore(subscribe, getOverviewSnapshot, getServerEmptyOverview);
  const isLoaded = useSyncExternalStore(subscribe, getClientLoaded, getServerLoaded);

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
