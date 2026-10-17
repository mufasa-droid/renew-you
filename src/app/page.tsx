'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo, LotusMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  DailyMoodCheckIn,
  SevenDayOverview,
  MoodHistoryList,
  BreathingExercise,
  ClearDataConfirmationModal,
} from '@/components/wellness';
import { useMoodTracker } from '@/lib/useMoodTracker';
import { useReflectionTracker } from '@/lib/useReflectionTracker';
import { useSanctuarySettings } from '@/lib/useSanctuarySettings';
import { clearRenewYouData } from '@/lib/storageManager';
import {
  Heart,
  Feather,
  Wind,
  Settings as SettingsIcon,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  VolumeX,
  Shuffle,
  Trash2,
  Sun,
  Calendar,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function RenewYouHomepage() {
  // Navigation State
  const [activeNav, setActiveNav] = useState<'home' | 'checkin' | 'overview' | 'history' | 'breathe'>('home');
  const [modalOpen, setModalOpen] = useState<'settings' | 'breathe' | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearSuccessNotice, setClearSuccessNotice] = useState(false);

  // Persistent Client-Side Mood Storage Hook
  const {
    entries,
    todayEntry,
    sevenDayOverview,
    isLoaded: moodsLoaded,
    saveMood,
    removeMood,
  } = useMoodTracker();

  // Persistent Client-Side Reflection Storage Hook
  const {
    reflections,
    isLoaded: reflectionsLoaded,
    saveReflection,
    removeReflection,
  } = useReflectionTracker();

  // Persistent Settings Hook
  const { settings, toggleAmbientSound } = useSanctuarySettings();

  // Curated Prompts
  const curatedPrompts = [
    'What is one gentle boundary or quiet moment you can gift yourself today?',
    'What thoughts or tensions are you ready to soften your grip on right now?',
    'What brought a subtle, quiet feeling of gratitude to your day?',
    'If you were speaking to a dear friend feeling what you feel, what would you say?',
    'What does your physical body need most in this moment?',
  ];
  const [promptIndex, setPromptIndex] = useState(0);
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionSuccess, setReflectionSuccess] = useState(false);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    saveReflection(curatedPrompts[promptIndex], reflectionInput.trim());
    setReflectionInput('');
    setReflectionSuccess(true);
    setTimeout(() => setReflectionSuccess(false), 3000);
  };

  const handleShufflePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % curatedPrompts.length);
  };

  const handleConfirmClearData = () => {
    clearRenewYouData();
    setConfirmClearOpen(false);
    setModalOpen(null);
    setClearSuccessNotice(true);
  };

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col selection:bg-brand-purple-light selection:text-brand-purple">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF9FD]/95 backdrop-blur-md border-b border-sanctuary-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" showText={true} showTagline={true} orientation="horizontal" />
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveNav('home')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeNav === 'home'
                  ? 'bg-brand-purple text-white shadow-sanctuary-sm'
                  : 'text-sanctuary-text-secondary hover:text-sanctuary-text-primary hover:bg-sanctuary-muted'
              }`}
            >
              Sanctuary Home
            </button>
            <a
              href="#check-in"
              onClick={() => setActiveNav('checkin')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Mood Check-In</span>
            </a>
            <a
              href="#overview"
              onClick={() => setActiveNav('overview')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7-Day Overview</span>
            </a>
            <a
              href="#history"
              onClick={() => setActiveNav('history')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>History</span>
            </a>
            <a
              href="#breathe"
              onClick={() => setActiveNav('breathe')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathe</span>
            </a>
            <Link
              href="/settings"
              className="px-4 py-2 rounded-full text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-all cursor-pointer flex items-center gap-1.5"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Guest Status & Settings */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-light text-brand-mint text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guest Session</span>
            </span>

            <Link
              href="/settings"
              aria-label="Settings & Privacy"
              className="p-2.5 rounded-full bg-white border border-sanctuary-border hover:bg-sanctuary-muted text-sanctuary-text-secondary hover:text-brand-purple shadow-sanctuary-sm transition-all cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center justify-around px-3 py-2 border-t border-sanctuary-border/60 bg-white/60 text-xs font-semibold">
          <a href="#check-in" className="py-1 px-3 text-brand-purple">
            Check-In
          </a>
          <a href="#overview" className="py-1 px-3 text-sanctuary-text-secondary hover:text-brand-purple">
            Overview
          </a>
          <a href="#history" className="py-1 px-3 text-sanctuary-text-secondary hover:text-brand-purple">
            History
          </a>
          <a href="#breathe" className="py-1 px-3 text-sanctuary-text-secondary hover:text-brand-purple">
            Breathe
          </a>
          <Link
            href="/settings"
            className="py-1 px-3 text-sanctuary-text-secondary hover:text-brand-purple"
          >
            Settings
          </Link>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
        {/* Success Notice when data was cleared */}
        {clearSuccessNotice && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All Renew You local records (moods &amp; reflections) have been permanently cleared from this browser. Your sanctuary is reset.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setClearSuccessNotice(false)}
              className="font-bold text-emerald-700 hover:text-emerald-900 shrink-0 px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Welcome Greeting Banner */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-sanctuary-text-secondary">
                Renew You Sanctuary
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-sanctuary-text-primary tracking-tight">
              Welcome back to peace.
            </h1>
            <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-1 max-w-xl">
              Check in with your emotions and take a gentle guided breath without signing up. Kept confidentially on your device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={settings.ambientSound ? <Volume2 className="w-4 h-4 text-brand-mint" /> : <VolumeX className="w-4 h-4" />}
              onClick={toggleAmbientSound}
            >
              {settings.ambientSound ? 'Ambiance On' : 'Silent Sanctuary'}
            </Button>

            <Link href="/settings">
              <Button variant="secondary" size="sm" leftIcon={<SettingsIcon className="w-3.5 h-3.5" />}>
                Settings &amp; Data
              </Button>
            </Link>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Daily Mood Check-In & 7-Day Overview & History (lg:col-span-7) */}
          <section className="lg:col-span-7 flex flex-col gap-8">
            {/* Prominent Daily Mood Check-In Card */}
            <div id="check-in" className="scroll-mt-24">
              <DailyMoodCheckIn
                todayEntry={moodsLoaded ? todayEntry : null}
                onSave={(level, note) => saveMood(level, note)}
              />
            </div>

            {/* Simple 7-Day Overview Card */}
            <div id="overview" className="scroll-mt-24">
              <SevenDayOverview days={moodsLoaded ? sevenDayOverview : []} />
            </div>

            {/* Chronological Mood History List */}
            <div id="history" className="scroll-mt-24">
              <MoodHistoryList
                entries={moodsLoaded ? entries : []}
                onDelete={(id) => removeMood(id)}
              />
            </div>
          </section>

          {/* Right Column: Guided Breathing Exercise & Daily Reflection (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Phase 7 Guided Breathing Exercise Card */}
            <div id="breathe" className="scroll-mt-24">
              <BreathingExercise
                initialPattern="gentle"
                targetCycles={4}
              />
            </div>

            {/* Daily Reflection Prompt Card */}
            <Card variant="white" className="p-6 sm:p-7 flex flex-col gap-4 border border-sanctuary-border shadow-sanctuary-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F3EFFC] text-brand-purple flex items-center justify-center">
                    <Feather className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-sanctuary-text-primary">
                      Daily Reflection Prompt
                    </h3>
                    <span className="text-[11px] text-sanctuary-text-secondary">
                      Prompt {promptIndex + 1} of {curatedPrompts.length}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Shuffle prompt"
                  onClick={handleShufflePrompt}
                  className="p-1.5 rounded-lg text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors cursor-pointer flex items-center gap-1 text-xs"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Shuffle</span>
                </button>
              </div>

              {/* Prompt Text Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#F3EFFC]/60 to-white border border-brand-purple/15">
                <p className="text-xs sm:text-sm font-medium text-sanctuary-text-primary italic leading-relaxed">
                  &quot;{curatedPrompts[promptIndex]}&quot;
                </p>
              </div>

              {/* Reflection Input Form */}
              <form onSubmit={handleSaveReflection} className="flex flex-col gap-3">
                <div className="rounded-xl border border-sanctuary-border bg-sanctuary-bg/40 focus-within:bg-white focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/20 transition-all p-3">
                  <textarea
                    rows={3}
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="Write a few mindful words..."
                    className="w-full bg-transparent text-xs sm:text-sm text-sanctuary-text-primary placeholder:text-sanctuary-text-muted outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sanctuary-text-muted">
                    {reflectionsLoaded ? reflections.length : 0}{' '}
                    {reflections.length === 1 ? 'reflection' : 'reflections'} saved
                  </span>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!reflectionInput.trim()}
                    rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Save Reflection
                  </Button>
                </div>

                {reflectionSuccess && (
                  <p className="text-xs text-brand-mint font-semibold animate-in fade-in">
                    Reflection noted in your sanctuary journal.
                  </p>
                )}
              </form>

              {/* Mini List of Recorded Reflections */}
              {reflectionsLoaded && reflections.length > 0 && (
                <div className="pt-3 border-t border-sanctuary-border flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-text-secondary">
                      Your Saved Reflections
                    </span>
                    <span className="text-[10px] text-sanctuary-text-muted">
                      Stored in this browser
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-2 pr-1">
                    {reflections.map((ref) => (
                      <div
                        key={ref.id}
                        className="p-2.5 rounded-lg bg-sanctuary-bg border border-sanctuary-border/80 text-xs flex flex-col gap-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-sanctuary-text-muted italic truncate max-w-[200px]">
                            {ref.prompt}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-sanctuary-text-muted">
                              {ref.displayTime}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeReflection(ref.id)}
                              aria-label="Delete reflection"
                              className="text-sanctuary-text-muted hover:text-sanctuary-error opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sanctuary-text-primary leading-snug">{ref.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Privacy Reassurance Card */}
            <Card variant="muted" className="p-5 border border-sanctuary-border flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-text-primary">
                  <Lock className="w-4 h-4 text-brand-mint" />
                  <span>Confidential Guest Sanctuary</span>
                </div>
                <Link
                  href="/settings"
                  className="text-[11px] font-semibold text-brand-purple hover:underline flex items-center gap-1"
                >
                  <span>Data Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-[11px] text-sanctuary-text-secondary leading-relaxed">
                Renew You V1 stores your moods and reflections locally in this browser. No external cloud servers or accounts are used.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Modal: Full Breathing Exercise Focus */}
      <Modal
        isOpen={modalOpen === 'breathe'}
        onClose={() => setModalOpen(null)}
        title="Mindful Pause — Focused Breathing"
        description="Relax your jaw and eyes. Allow yourself this gentle pause."
        maxWidth="lg"
      >
        <BreathingExercise
          initialPattern="gentle"
          targetCycles={5}
          onComplete={() => setModalOpen(null)}
        />
      </Modal>

      {/* Explicit Confirmation Modal for Data Clearing */}
      <ClearDataConfirmationModal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={handleConfirmClearData}
        moodCount={entries.length}
        reflectionCount={reflections.length}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-sanctuary-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sanctuary-text-secondary">
          <div className="flex items-center gap-2">
            <LotusMark size={20} />
            <span className="font-bold text-sanctuary-text-primary">Renew You</span>
            <span className="text-sanctuary-text-muted">&bull; Pause. Reflect. Renew.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:text-brand-purple transition-colors">
              Settings &amp; Data Management
            </Link>
            <span className="text-sanctuary-text-muted">&copy; 2026 Renew You</span>
            <span className="flex items-center gap-1 text-brand-mint font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Guest-First &amp; Confidential
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
