'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { MoodEntry, MoodLevel, SevenDayOverviewDay } from '@/types/mood';
import {
  getMoodEntries,
  getTodayMoodEntry,
  saveTodayMoodEntry,
  deleteMoodEntry,
  getSevenDayOverview,
  MOOD_CHANGE_EVENT,
} from './moodStorage';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(MOOD_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(MOOD_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRawStorage = '';
let cachedEntries: MoodEntry[] = [];

function getEntriesSnapshot(): MoodEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('renew_you_mood_entries_v1') || '';
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
