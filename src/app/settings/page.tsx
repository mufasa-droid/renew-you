'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Logo, LotusMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ClearDataConfirmationModal } from '@/components/wellness/ClearDataConfirmationModal';
import { useMoodTracker } from '@/lib/useMoodTracker';
import { useReflectionTracker } from '@/lib/useReflectionTracker';
import { useSanctuarySettings } from '@/lib/useSanctuarySettings';
import {
  clearRenewYouData,
  STORAGE_KEYS,
  isStorageAvailable,
} from '@/lib/storageManager';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  ArrowLeft,
  Database,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Lock,
  HardDrive,
  Info,
  Volume2,
  Heart,
  Feather,
} from 'lucide-react';

export default function SettingsPage() {
  const { entries, isLoaded: moodsLoaded } = useMoodTracker();
  const { reflections, isLoaded: reflectionsLoaded } = useReflectionTracker();
  const { settings, toggleAmbientSound } = useSanctuarySettings();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearedNotice, setClearedNotice] = useState<{
    show: boolean;
    count: number;
    keys: string[];
  }>({
    show: false,
    count: 0,
    keys: [],
  });

  const totalBytesEstimate = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const moodsBytes = entries.length > 0 ? JSON.stringify(entries).length * 2 : 0;
    const reflectionsBytes = reflections.length > 0 ? JSON.stringify(reflections).length * 2 : 0;
    return moodsBytes + reflectionsBytes;
  }, [entries, reflections]);

  const storageAvailable = useMemo(() => {
    return isStorageAvailable();
  }, []);

  const handleConfirmClear = () => {
    setIsClearing(true);
    try {
      const result = clearRenewYouData();
      setConfirmModalOpen(false);
      setIsClearing(false);
      setClearedNotice({
        show: true,
        count: result.count,
        keys: result.clearedKeys,
      });
    } catch {
      setIsClearing(false);
      setConfirmModalOpen(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col selection:bg-brand-purple-light selection:text-brand-purple">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF9FD]/95 backdrop-blur-md border-b border-sanctuary-border transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-xl text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Sanctuary</span>
            </Link>

            <div className="h-5 w-px bg-sanctuary-border hidden sm:block" />

            <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-light text-brand-mint text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guest Session</span>
            </span>

            <Link href="/">
              <Button variant="secondary" size="sm">
                Sanctuary Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* Page Title & Breadcrumb */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple">
            <SettingsIcon className="w-4 h-4" />
            <span>Preferences &amp; Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-sanctuary-text-primary tracking-tight">
            Settings &amp; Local Data Management
          </h1>
          <p className="text-xs sm:text-sm text-sanctuary-text-secondary max-w-2xl leading-relaxed">
            Renew You is designed around respectful, guest-first wellness. Review your local storage footprint, configure sanctuary ambiance, and manage your stored records.
          </p>
        </section>

        {/* Success Confirmation Alert when data is cleared */}
        {clearedNotice.show && (
          <div
            role="status"
            aria-live="polite"
            className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-bold text-emerald-900">
                  Renew You Data Cleared Successfully
                </h4>
                <p className="text-xs text-emerald-800/90 leading-relaxed">
                  All local mood entries, reflections, and preferences have been permanently removed from this browser. No other website data was touched.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {clearedNotice.keys.map((k) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-[10px] font-mono text-emerald-800"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Link href="/">
                <Button variant="primary" size="sm">
                  Return to Sanctuary
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setClearedNotice({ show: false, count: 0, keys: [] })}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* 1. Storage Transparency & Privacy Architecture Card */}
        <Card variant="white" className="p-6 sm:p-8 flex flex-col gap-6 border border-sanctuary-border shadow-sanctuary-sm">
          <div className="flex items-start justify-between gap-4 border-b border-sanctuary-border pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-purple-light text-brand-purple flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-sanctuary-text-primary">
                  How Renew You Stores Your Data
                </h2>
                <p className="text-xs text-sanctuary-text-secondary">
                  Transparent architectural disclosure for our V1 prototype
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
                storageAvailable
                  ? 'bg-brand-mint-light text-brand-mint'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${storageAvailable ? 'bg-brand-mint' : 'bg-amber-600'}`} />
              <span>{storageAvailable ? 'Browser Storage Active' : 'Storage Unavailable'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-sanctuary-text-secondary leading-relaxed">
            <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-sanctuary-bg border border-sanctuary-border">
              <div className="flex items-center gap-2 text-sanctuary-text-primary font-bold">
                <Lock className="w-4 h-4 text-brand-purple" />
                <span>On-Device Storage Only</span>
              </div>
              <p>
                The Renew You V1 prototype stores all mood entries and reflection responses solely within your local browser&apos;s <code className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] text-brand-purple">localStorage</code>.
              </p>
              <p>
                There is <strong>no account system, no cloud database, and no server transmission</strong>. Your personal entries never leave this device.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Data Loss &amp; Device Boundaries</span>
              </div>
              <p className="text-amber-900/90">
                Because data exists only inside this specific browser profile:
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-900/90">
                <li>Clearing site data or cookies will permanently delete your entries.</li>
                <li>Switching browsers (e.g. Chrome to Safari) will not transfer your records.</li>
                <li>Using Private / Incognito mode clears records once the window closes.</li>
              </ul>
            </div>
          </div>

          {/* Privacy Disclaimer on Clinical suitability & lack of encryption */}
          <div className="p-4 rounded-xl bg-sanctuary-muted/60 border border-sanctuary-border/80 flex items-start gap-3 text-xs text-sanctuary-text-secondary">
            <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <strong className="text-sanctuary-text-primary">
                Unencrypted Storage Notice &amp; Scope
              </strong>
              <p className="leading-relaxed">
                Browser localStorage is standard web storage and is <strong>not encrypted at rest</strong>. It is designed for gentle personal mindfulness and self-reflection, and is <strong>not suitable for clinical medical records, crisis logs, or highly sensitive private information</strong>. Anyone with physical access to your device could inspect browser storage.
              </p>
            </div>
          </div>
        </Card>

        {/* 2. Current Wellness Data Summary Card */}
        <Card variant="white" className="p-6 sm:p-8 flex flex-col gap-6 border border-sanctuary-border shadow-sanctuary-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAE4F8] text-brand-purple flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-sanctuary-text-primary">
                  Stored Wellness Footprint
                </h2>
                <p className="text-xs text-sanctuary-text-secondary">
                  Active entries currently stored in your browser
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-brand-purple px-2.5 py-1 rounded-lg bg-brand-purple-light">
              {formatBytes(totalBytesEstimate)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-sanctuary-bg border border-sanctuary-border flex flex-col gap-1">
              <span className="text-[11px] font-bold text-sanctuary-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-brand-purple" />
                Mood Entries
              </span>
              <span className="text-2xl font-extrabold text-sanctuary-text-primary">
                {moodsLoaded ? entries.length : 0}
              </span>
              <span className="text-[11px] text-sanctuary-text-muted">
                1 check-in per calendar day
              </span>
            </div>

            <div className="p-4 rounded-xl bg-sanctuary-bg border border-sanctuary-border flex flex-col gap-1">
              <span className="text-[11px] font-bold text-sanctuary-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-brand-purple" />
                Reflections
              </span>
              <span className="text-2xl font-extrabold text-sanctuary-text-primary">
                {reflectionsLoaded ? reflections.length : 0}
              </span>
              <span className="text-[11px] text-sanctuary-text-muted">
                Prompt responses logged
              </span>
            </div>

            <div className="p-4 rounded-xl bg-sanctuary-bg border border-sanctuary-border flex flex-col gap-1">
              <span className="text-[11px] font-bold text-sanctuary-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-brand-purple" />
                Ambiance Preference
              </span>
              <span className="text-base font-bold text-sanctuary-text-primary capitalize mt-1">
                {settings.ambientSound ? 'Soundscape On' : 'Silent Mode'}
              </span>
              <span className="text-[11px] text-sanctuary-text-muted">
                Stored in preferences
              </span>
            </div>
          </div>

          {/* Transparent Storage Keys Table */}
          <div className="flex flex-col gap-2 pt-2 border-t border-sanctuary-border">
            <span className="text-xs font-bold text-sanctuary-text-secondary uppercase tracking-wider">
              Exact Local Storage Keys Used
            </span>
            <div className="rounded-xl border border-sanctuary-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-sanctuary-muted text-sanctuary-text-primary font-bold border-b border-sanctuary-border">
                  <tr>
                    <th className="py-2.5 px-3.5">Storage Key</th>
                    <th className="py-2.5 px-3.5">Purpose</th>
                    <th className="py-2.5 px-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sanctuary-border/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3.5 font-bold text-brand-purple">
                      {STORAGE_KEYS.MOOD_ENTRIES}
                    </td>
                    <td className="py-2 px-3.5 font-sans text-sanctuary-text-secondary">
                      Daily mood rating, emotion label, and optional note
                    </td>
                    <td className="py-2 px-3.5 text-right">
                      {entries.length > 0 ? (
                        <span className="text-emerald-700 font-sans font-semibold">Active</span>
                      ) : (
                        <span className="text-sanctuary-text-muted font-sans">Empty</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-bold text-brand-purple">
                      {STORAGE_KEYS.REFLECTIONS}
                    </td>
                    <td className="py-2 px-3.5 font-sans text-sanctuary-text-secondary">
                      Prompt reflection thoughts, timestamp, and date
                    </td>
                    <td className="py-2 px-3.5 text-right">
                      {reflections.length > 0 ? (
                        <span className="text-emerald-700 font-sans font-semibold">Active</span>
                      ) : (
                        <span className="text-sanctuary-text-muted font-sans">Empty</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 font-bold text-brand-purple">
                      {STORAGE_KEYS.SETTINGS}
                    </td>
                    <td className="py-2 px-3.5 font-sans text-sanctuary-text-secondary">
                      Sound preference and motion preferences
                    </td>
                    <td className="py-2 px-3.5 text-right">
                      <span className="text-emerald-700 font-sans font-semibold">Configured</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* 3. Sanctuary Preferences Card */}
        <Card variant="white" className="p-6 sm:p-8 flex flex-col gap-6 border border-sanctuary-border shadow-sanctuary-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-sanctuary-text-primary">
                Sanctuary Preferences
              </h2>
              <p className="text-xs text-sanctuary-text-secondary">
                Tailor your local mindfulness environment
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-sanctuary-bg border border-sanctuary-border">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-sanctuary-text-primary">
                Ambient Soundscape
              </span>
              <span className="text-[11px] text-sanctuary-text-secondary">
                Soft mindfulness chimes and peaceful background tones
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.ambientSound}
              aria-label="Toggle ambient soundscape"
              onClick={toggleAmbientSound}
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple ${
                settings.ambientSound ? 'bg-brand-purple' : 'bg-sanctuary-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.ambientSound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* 4. Danger Zone: Explicit Data Clearing */}
        <Card variant="white" className="p-6 sm:p-8 flex flex-col gap-6 border border-rose-200/80 shadow-sanctuary-sm bg-gradient-to-b from-white to-rose-50/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-rose-950">
                  Data Management &amp; Danger Zone
                </h2>
                <p className="text-xs text-rose-800/80">
                  Permanently delete all Renew You wellness data stored on this browser
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider shrink-0">
              Irreversible
            </span>
          </div>

          <p className="text-xs text-sanctuary-text-secondary leading-relaxed">
            Clicking below opens an explicit confirmation dialog. When confirmed, all your mood check-in records, reflection entries, and customized settings will be permanently erased.
          </p>

          <div className="p-3.5 rounded-xl bg-white border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-sanctuary-text-primary">
                Clear All Local Records
              </span>
              <span className="text-[11px] text-sanctuary-text-secondary">
                Removes {entries.length} mood entries and {reflections.length} reflections.
              </span>
            </div>

            <Button
              variant="danger"
              size="md"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setConfirmModalOpen(true)}
              disabled={entries.length === 0 && reflections.length === 0}
            >
              {entries.length === 0 && reflections.length === 0
                ? 'No Stored Records'
                : 'Clear Stored Data'}
            </Button>
          </div>
        </Card>
      </main>

      {/* Confirmation Modal */}
      <ClearDataConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmClear}
        moodCount={entries.length}
        reflectionCount={reflections.length}
        isClearing={isClearing}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-sanctuary-border py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sanctuary-text-secondary">
          <div className="flex items-center gap-2">
            <LotusMark size={20} />
            <span className="font-bold text-sanctuary-text-primary">Renew You</span>
            <span className="text-sanctuary-text-muted">&bull; Pause. Reflect. Renew.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sanctuary-text-muted">&copy; 2026 Renew You</span>
            <span className="flex items-center gap-1 text-brand-mint font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Guest-First &amp; Confidential
            </span>
          </div>
        </div>

        {/* Wellness & Emergency Care Disclaimer */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-sanctuary-border/40 text-[11px] text-sanctuary-text-muted text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Renew You is a mindful self-reflection companion, not a provider of clinical diagnosis, treatment, or emergency care.</span>
          <span>If you are in distress or crisis, please contact local health services or dial/text <strong>988</strong> (US/Canada).</span>
        </div>
      </footer>
    </div>
  );
}
