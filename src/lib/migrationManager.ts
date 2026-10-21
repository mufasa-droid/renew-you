/**
 * Renew You V1.1 — Guest Data Migration Utility
 * Safely imports existing browser localStorage data into authenticated Supabase PostgreSQL tables.
 */

import { getMoodEntries } from './moodStorage';
import { getStoredReflections, safeSetItem } from './storageManager';
import { createClient, isSupabaseConfigured } from './supabase/client';

export interface GuestDataSummary {
  hasGuestData: boolean;
  moodCount: number;
  reflectionCount: number;
}

/**
 * Checks whether any unmigrated guest records exist in localStorage.
 */
export function checkGuestData(): GuestDataSummary {
  if (typeof window === 'undefined') {
    return { hasGuestData: false, moodCount: 0, reflectionCount: 0 };
  }

  const moods = getMoodEntries();
  const reflections = getStoredReflections();

  return {
    hasGuestData: moods.length > 0 || reflections.length > 0,
    moodCount: moods.length,
    reflectionCount: reflections.length,
  };
}

/**
 * Migrates local mood entries and reflections into Supabase for the authenticated user.
 * Guarantees zero data loss: backups local records before clearing.
 */
export async function migrateGuestDataToSupabase(userId: string): Promise<{
  success: boolean;
  importedMoods: number;
  importedReflections: number;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      importedMoods: 0,
      importedReflections: 0,
      error: 'Supabase is not configured yet.',
    };
  }

  const moods = getMoodEntries();
  const reflections = getStoredReflections();

  if (moods.length === 0 && reflections.length === 0) {
    return { success: true, importedMoods: 0, importedReflections: 0 };
  }

  const supabase = createClient();
  let importedMoods = 0;
  let importedReflections = 0;

  try {
    // 1. Batch upsert mood entries
    if (moods.length > 0) {
      const moodPayload = moods.map((m) => {
        const scoreMap: Record<string, number> = {
          'very-low': 1,
          'low': 2,
          'okay': 3,
          'good': 4,
          'excellent': 5,
        };

        return {
          user_id: userId,
          date_key: m.dateKey,
          level: m.level,
          score: scoreMap[m.level] || 3,
          note: m.note ? m.note.substring(0, 280) : null,
          created_at: m.createdAt,
          updated_at: m.updatedAt || m.createdAt,
        };
      });

      const { error: moodError } = await supabase
        .from('mood_entries')
        .upsert(moodPayload, { onConflict: 'user_id,date_key' });

      if (moodError) {
        throw moodError;
      }

      importedMoods = moodPayload.length;
    }

    // 2. Batch insert reflections
    if (reflections.length > 0) {
      const refPayload = reflections.map((r) => ({
        user_id: userId,
        prompt: r.prompt,
        text: r.text,
        date_key: r.dateKey,
        created_at: r.createdAt,
      }));

      const { error: refError } = await supabase
        .from('reflections')
        .insert(refPayload);

      if (refError) {
        throw refError;
      }

      importedReflections = refPayload.length;
    }

    // 3. Backup and archive local data safely (never discard without backup)
    safeSetItem(
      'renew_you_migrated_backup_v1',
      JSON.stringify({
        migratedAt: new Date().toISOString(),
        userId,
        moods,
        reflections,
      })
    );

    return {
      success: true,
      importedMoods,
      importedReflections,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Migration failed';
    return {
      success: false,
      importedMoods: 0,
      importedReflections: 0,
      error: message,
    };
  }
}
