'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MoodEntry, MoodLevel, SevenDayOverviewDay } from '@/types/mood';
import {
  getMoodEntries,
  saveTodayMoodEntry,
  deleteMoodEntry,
  buildSevenDayOverview,
  getLocalTodayDateKey,
  formatDisplayDate,
} from './moodStorage';
import { MOOD_CONFIGS } from './moodConstants';
import { STORAGE_EVENTS } from './storageManager';
import { useAuth } from '@/context/AuthContext';
import { createClient, isSupabaseConfigured } from './supabase/client';

const EMPTY_OVERVIEW: SevenDayOverviewDay[] = [];

export function useMoodTracker() {
  const { user, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync entries depending on whether user is authenticated or guest
  const loadEntries = useCallback(async () => {
    if (user && isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .order('date_key', { ascending: false });

        if (!error && data) {
          const cloudEntries: MoodEntry[] = data.map((row) => ({
            id: row.id,
            dateKey: row.date_key,
            displayDate: formatDisplayDate(row.date_key),
            level: row.level as MoodLevel,
            label: MOOD_CONFIGS[row.level as MoodLevel]?.label || row.level,
            note: row.note || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
          setEntries(cloudEntries);
          setIsLoaded(true);
          return;
        }
      } catch {
        // Fall back to local storage if network query fails
      }
    }

    // Guest or fallback mode: load asynchronously to avoid cascading effect renders
    await Promise.resolve();
    setEntries(getMoodEntries());
    setIsLoaded(true);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      queueMicrotask(() => {
        void loadEntries();
      });
    }
  }, [authLoading, loadEntries]);

  // Listen for storage events (e.g. data cleared, guest migration, or local edits)
  useEffect(() => {
    const handleStorageChange = () => {
      loadEntries();
    };

    window.addEventListener(STORAGE_EVENTS.MOOD_CHANGE, handleStorageChange);
    window.addEventListener(STORAGE_EVENTS.STORAGE_CLEARED, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(STORAGE_EVENTS.MOOD_CHANGE, handleStorageChange);
      window.removeEventListener(STORAGE_EVENTS.STORAGE_CLEARED, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadEntries]);

  // Derive todayEntry with reference stability
  const todayEntry = useMemo(() => {
    if (!isLoaded || entries.length === 0) return null;
    const todayKey = getLocalTodayDateKey();
    return entries.find((e) => e.dateKey === todayKey) || null;
  }, [entries, isLoaded]);

  // Derive sevenDayOverview with reference stability
  const sevenDayOverview = useMemo(() => {
    if (!isLoaded) return EMPTY_OVERVIEW;
    return buildSevenDayOverview(entries);
  }, [entries, isLoaded]);

  const saveMood = useCallback(
    async (level: MoodLevel, note?: string): Promise<MoodEntry> => {
      const todayKey = getLocalTodayDateKey();
      const config = MOOD_CONFIGS[level];
      const nowIso = new Date().toISOString();

      // If user is authenticated and Supabase is configured, save directly to cloud
      if (user && isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const scoreMap: Record<MoodLevel, number> = {
            'very-low': 1,
            'low': 2,
            'okay': 3,
            'good': 4,
            'excellent': 5,
          };

          const payload = {
            user_id: user.id,
            date_key: todayKey,
            level,
            score: scoreMap[level],
            note: note ? note.trim().substring(0, 280) : null,
            updated_at: nowIso,
          };

          const { data, error } = await supabase
            .from('mood_entries')
            .upsert(payload, { onConflict: 'user_id,date_key' })
            .select()
            .single();

          if (!error && data) {
            const newEntry: MoodEntry = {
              id: data.id,
              dateKey: data.date_key,
              displayDate: formatDisplayDate(data.date_key),
              level: data.level as MoodLevel,
              label: config.label,
              note: data.note || undefined,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };

            setEntries((prev) => {
              const filtered = prev.filter((e) => e.dateKey !== todayKey);
              return [newEntry, ...filtered];
            });

            return newEntry;
          }
        } catch {
          // If network write fails, fall back to saving locally
        }
      }

      // Guest mode or local fallback
      const saved = saveTodayMoodEntry({ level, note });
      setEntries(getMoodEntries());
      return saved;
    },
    [user]
  );

  const removeMood = useCallback(
    async (id: string): Promise<boolean> => {
      if (user && isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { error } = await supabase.from('mood_entries').delete().eq('id', id);
          if (!error) {
            setEntries((prev) => prev.filter((e) => e.id !== id));
            return true;
          }
        } catch {
          // Fall back to local delete
        }
      }

      const success = deleteMoodEntry(id);
      setEntries(getMoodEntries());
      return success;
    },
    [user]
  );

  return {
    entries,
    todayEntry,
    sevenDayOverview,
    isLoaded,
    saveMood,
    removeMood,
    reload: loadEntries,
  };
}
