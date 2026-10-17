'use client';

import { useSyncExternalStore, useCallback } from 'react';
import {
  StoredReflection,
  getStoredReflections,
  saveReflectionEntry,
  deleteReflectionEntry,
  STORAGE_KEYS,
  STORAGE_EVENTS,
  safeGetItem,
} from './storageManager';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(STORAGE_EVENTS.REFLECTION_CHANGE, callback);
  window.addEventListener(STORAGE_EVENTS.STORAGE_CLEARED, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(STORAGE_EVENTS.REFLECTION_CHANGE, callback);
    window.removeEventListener(STORAGE_EVENTS.STORAGE_CLEARED, callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRawStorage = '';
let cachedReflections: StoredReflection[] = [];

function getReflectionsSnapshot(): StoredReflection[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = safeGetItem(STORAGE_KEYS.REFLECTIONS) || '';
    if (raw !== cachedRawStorage) {
      cachedRawStorage = raw;
      cachedReflections = getStoredReflections();
    }
  } catch {
    return cachedReflections;
  }
  return cachedReflections;
}

const SERVER_SNAPSHOT: StoredReflection[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function getClientLoaded() {
  return true;
}
function getServerLoaded() {
  return false;
}

export function useReflectionTracker() {
  const reflections = useSyncExternalStore(subscribe, getReflectionsSnapshot, getServerSnapshot);
  const isLoaded = useSyncExternalStore(subscribe, getClientLoaded, getServerLoaded);

  const saveReflection = useCallback((prompt: string, text: string) => {
    return saveReflectionEntry({ prompt, text });
  }, []);

  const removeReflection = useCallback((id: string) => {
    return deleteReflectionEntry(id);
  }, []);

  return {
    reflections,
    isLoaded,
    saveReflection,
    removeReflection,
  };
}
