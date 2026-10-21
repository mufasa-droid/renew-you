'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  StoredReflection,
  getStoredReflections,
  saveReflectionEntry,
  deleteReflectionEntry,
  STORAGE_EVENTS,
} from './storageManager';
import { useAuth } from '@/context/AuthContext';
import { createClient, isSupabaseConfigured } from './supabase/client';

export function useReflectionTracker() {
  const { user, isLoading: authLoading } = useAuth();
  const [reflections, setReflections] = useState<StoredReflection[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadReflections = useCallback(async () => {
    if (user && isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('reflections')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const cloudReflections: StoredReflection[] = data.map((row) => ({
            id: row.id,
            prompt: row.prompt,
            text: row.text,
            dateKey: row.date_key,
            createdAt: row.created_at,
            displayTime: new Date(row.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setReflections(cloudReflections);
          setIsLoaded(true);
          return;
        }
      } catch {
        // Fall back to local records
      }
    }

    // Guest or fallback mode: load asynchronously to avoid cascading effect renders
    await Promise.resolve();
    setReflections(getStoredReflections());
    setIsLoaded(true);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      queueMicrotask(() => {
        void loadReflections();
      });
    }
  }, [authLoading, loadReflections]);

  useEffect(() => {
    const handleStorageChange = () => {
      loadReflections();
    };

    window.addEventListener(STORAGE_EVENTS.REFLECTION_CHANGE, handleStorageChange);
    window.addEventListener(STORAGE_EVENTS.STORAGE_CLEARED, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(STORAGE_EVENTS.REFLECTION_CHANGE, handleStorageChange);
      window.removeEventListener(STORAGE_EVENTS.STORAGE_CLEARED, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadReflections]);

  const saveReflection = useCallback(
    async (prompt: string, text: string): Promise<StoredReflection> => {
      const trimmedText = text.trim();
      const todayKey = new Date().toISOString().split('T')[0];
      const nowIso = new Date().toISOString();

      if (user && isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('reflections')
            .insert({
              user_id: user.id,
              prompt,
              text: trimmedText,
              date_key: todayKey,
              created_at: nowIso,
            })
            .select()
            .single();

          if (!error && data) {
            const saved: StoredReflection = {
              id: data.id,
              prompt: data.prompt,
              text: data.text,
              dateKey: data.date_key,
              createdAt: data.created_at,
              displayTime: new Date(data.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            };
            setReflections((prev) => [saved, ...prev]);
            return saved;
          }
        } catch {
          // Fall back to local save on network error
        }
      }

      const saved = saveReflectionEntry({ prompt, text });
      setReflections(getStoredReflections());
      return saved;
    },
    [user]
  );

  const removeReflection = useCallback(
    async (id: string): Promise<boolean> => {
      if (user && isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { error } = await supabase.from('reflections').delete().eq('id', id);
          if (!error) {
            setReflections((prev) => prev.filter((r) => r.id !== id));
            return true;
          }
        } catch {
          // Fall back to local delete
        }
      }

      const success = deleteReflectionEntry(id);
      setReflections(getStoredReflections());
      return success;
    },
    [user]
  );

  return {
    reflections,
    isLoaded,
    saveReflection,
    removeReflection,
    reload: loadReflections,
  };
}
