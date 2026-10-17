'use client';

import { useSyncExternalStore, useCallback } from 'react';
import {
  SanctuarySettings,
  DEFAULT_SETTINGS,
  getSanctuarySettings,
  updateSanctuarySettings,
  STORAGE_KEYS,
  STORAGE_EVENTS,
  safeGetItem,
} from './storageManager';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(STORAGE_EVENTS.SETTINGS_CHANGE, callback);
  window.addEventListener(STORAGE_EVENTS.STORAGE_CLEARED, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(STORAGE_EVENTS.SETTINGS_CHANGE, callback);
    window.removeEventListener(STORAGE_EVENTS.STORAGE_CLEARED, callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRaw = '';
let cachedSettings: SanctuarySettings = DEFAULT_SETTINGS;

function getSettingsSnapshot(): SanctuarySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = safeGetItem(STORAGE_KEYS.SETTINGS) || '';
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSettings = getSanctuarySettings();
    }
  } catch {
    return cachedSettings;
  }
  return cachedSettings;
}

function getServerSnapshot(): SanctuarySettings {
  return DEFAULT_SETTINGS;
}

export function useSanctuarySettings() {
  const settings = useSyncExternalStore(subscribe, getSettingsSnapshot, getServerSnapshot);

  const updateSettings = useCallback((patch: Partial<SanctuarySettings>) => {
    return updateSanctuarySettings(patch);
  }, []);

  const toggleAmbientSound = useCallback(() => {
    return updateSanctuarySettings({ ambientSound: !settings.ambientSound });
  }, [settings.ambientSound]);

  return {
    settings,
    updateSettings,
    toggleAmbientSound,
  };
}
