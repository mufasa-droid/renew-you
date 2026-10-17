/**
 * Renew You - Centralized Storage Utility
 * Manages all browser-local data storage for the V1 wellness prototype.
 *
 * Technical Commitments:
 * 1. Strict key namespacing: all keys are prefixed with 'renew_you_'.
 * 2. Unrelated browser storage protection: clear operations ONLY touch 'renew_you_' keys.
 * 3. Graceful fallback: handles unavailable storage (e.g. Safari private mode) and malformed JSON.
 * 4. Zero personal data logging: user reflections and mood notes are never logged.
 * 5. Honest privacy: storage is unencrypted browser localStorage; clearly documented for personal use.
 */

// Standardized Storage Keys
export const STORAGE_KEYS = {
  MOOD_ENTRIES: 'renew_you_mood_entries_v1',
  REFLECTIONS: 'renew_you_reflection_entries_v1',
  SETTINGS: 'renew_you_settings_v1',
} as const;

export const RENEW_YOU_PREFIX = 'renew_you_';

// Reactive Custom Event Identifiers
export const STORAGE_EVENTS = {
  MOOD_CHANGE: 'renew_you_mood_change',
  REFLECTION_CHANGE: 'renew_you_reflection_change',
  SETTINGS_CHANGE: 'renew_you_settings_change',
  STORAGE_CLEARED: 'renew_you_storage_cleared',
} as const;

export interface StoredReflection {
  id: string;
  prompt: string;
  text: string;
  createdAt: string; // ISO 8601
  displayTime: string; // e.g. "10:30 AM"
  dateKey: string; // YYYY-MM-DD
}

export interface SanctuarySettings {
  ambientSound: boolean;
  reducedMotion: boolean;
  lastUpdated: string;
}

export const DEFAULT_SETTINGS: SanctuarySettings = {
  ambientSound: false,
  reducedMotion: false,
  lastUpdated: new Date(0).toISOString(),
};

export interface StorageUsageSummary {
  isAvailable: boolean;
  moodCount: number;
  reflectionCount: number;
  totalBytes: number;
  activeKeys: string[];
}

/**
 * Checks whether browser localStorage is accessible and working.
 * Returns false if cookies/storage are disabled or blocked by privacy policies.
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__renew_you_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely reads a raw string from localStorage.
 */
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely writes a raw string to localStorage.
 */
export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely removes a specific key from localStorage.
 */
export function safeRemoveItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Reflection Responses Management
// -----------------------------------------------------------------------------

function isValidReflection(item: unknown): item is StoredReflection {
  if (!item || typeof item !== 'object') return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.prompt === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.createdAt === 'string'
  );
}

/**
 * Retrieves all stored reflections, handling malformed data gracefully.
 */
export function getStoredReflections(): StoredReflection[] {
  const raw = safeGetItem(STORAGE_KEYS.REFLECTIONS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidReflection).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/**
 * Saves a new reflection response to local storage and emits change event.
 */
export function saveReflectionEntry(input: { prompt: string; text: string }): StoredReflection {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  const displayTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newEntry: StoredReflection = {
    id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    prompt: input.prompt.trim(),
    text: input.text.trim(),
    createdAt: now.toISOString(),
    displayTime,
    dateKey,
  };

  const existing = getStoredReflections();
  const updated = [newEntry, ...existing];

  safeSetItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(updated));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.REFLECTION_CHANGE));
  }

  return newEntry;
}

/**
 * Deletes a specific reflection entry by id.
 */
export function deleteReflectionEntry(id: string): boolean {
  const existing = getStoredReflections();
  const filtered = existing.filter((item) => item.id !== id);
  const success = safeSetItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.REFLECTION_CHANGE));
  }
  return success;
}

// -----------------------------------------------------------------------------
// Settings Management
// -----------------------------------------------------------------------------

export function getSanctuarySettings(): SanctuarySettings {
  const raw = safeGetItem(STORAGE_KEYS.SETTINGS);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    return {
      ambientSound: Boolean(parsed?.ambientSound),
      reducedMotion: Boolean(parsed?.reducedMotion),
      lastUpdated: typeof parsed?.lastUpdated === 'string' ? parsed.lastUpdated : new Date().toISOString(),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSanctuarySettings(patch: Partial<SanctuarySettings>): SanctuarySettings {
  const current = getSanctuarySettings();
  const updated: SanctuarySettings = {
    ...current,
    ...patch,
    lastUpdated: new Date().toISOString(),
  };
  safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.SETTINGS_CHANGE));
  }
  return updated;
}

// -----------------------------------------------------------------------------
// Storage Inspection & Safe Deletion
// -----------------------------------------------------------------------------

/**
 * Returns a summary of all Renew You data stored in the user's browser.
 */
export function getStorageUsageSummary(): StorageUsageSummary {
  if (typeof window === 'undefined') {
    return {
      isAvailable: false,
      moodCount: 0,
      reflectionCount: 0,
      totalBytes: 0,
      activeKeys: [],
    };
  }

  const isAvailable = isStorageAvailable();
  if (!isAvailable) {
    return {
      isAvailable: false,
      moodCount: 0,
      reflectionCount: 0,
      totalBytes: 0,
      activeKeys: [],
    };
  }

  let totalBytes = 0;
  const activeKeys: string[] = [];

  try {
    const knownKeys: readonly string[] = Object.values(STORAGE_KEYS);
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith(RENEW_YOU_PREFIX) || knownKeys.includes(key))) {
        activeKeys.push(key);
        const value = window.localStorage.getItem(key) || '';
        // Approx 2 bytes per character in UTF-16
        totalBytes += (key.length + value.length) * 2;
      }
    }
  } catch {
    // Return safe fallback if enumeration fails
  }

  const moodsRaw = safeGetItem(STORAGE_KEYS.MOOD_ENTRIES);
  let moodCount = 0;
  if (moodsRaw) {
    try {
      const parsed = JSON.parse(moodsRaw);
      if (Array.isArray(parsed)) moodCount = parsed.length;
    } catch {
      moodCount = 0;
    }
  }

  const reflectionCount = getStoredReflections().length;

  return {
    isAvailable: true,
    moodCount,
    reflectionCount,
    totalBytes,
    activeKeys,
  };
}

/**
 * Safely removes ONLY Renew You's own stored data keys.
 * Will NEVER delete or modify keys belonging to other applications.
 *
 * Emits reactive events to immediately synchronize all open UI screens.
 */
export function clearRenewYouData(): {
  clearedKeys: string[];
  count: number;
  success: boolean;
} {
  if (typeof window === 'undefined') {
    return { clearedKeys: [], count: 0, success: false };
  }

  const clearedKeys: string[] = [];

  try {
    // 1. Identify all keys belonging to Renew You
    const keysToRemove: string[] = [];

    // Check declared keys
    Object.values(STORAGE_KEYS).forEach((declaredKey) => {
      if (window.localStorage.getItem(declaredKey) !== null) {
        keysToRemove.push(declaredKey);
      }
    });

    // Check any dynamic key with prefix 'renew_you_'
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(RENEW_YOU_PREFIX) && !keysToRemove.includes(k)) {
        keysToRemove.push(k);
      }
    }

    // 2. Remove ONLY identified Renew You keys
    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key);
      clearedKeys.push(key);
    });

    // 3. Dispatch sync events to immediately reset UI across all active views
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.STORAGE_CLEARED));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.MOOD_CHANGE));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.REFLECTION_CHANGE));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.SETTINGS_CHANGE));

    // Also trigger standard storage event for cross-tab notification
    window.dispatchEvent(new Event('storage'));

    return {
      clearedKeys,
      count: clearedKeys.length,
      success: true,
    };
  } catch {
    return {
      clearedKeys,
      count: clearedKeys.length,
      success: false,
    };
  }
}
