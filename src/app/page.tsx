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
  GuestMigrationPrompt,
} from '@/components/wellness';
import { useMoodTracker } from '@/lib/useMoodTracker';
import { useReflectionTracker } from '@/lib/useReflectionTracker';
import { useSanctuarySettings } from '@/lib/useSanctuarySettings';
import { clearRenewYouData } from '@/lib/storageManager';
import { useAuth } from '@/context/AuthContext';
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
  Lock,
  ExternalLink,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export default function RenewYouHomepage() {
  const { user, profile, signOut } = useAuth();
  const displayName = profile?.display_name || user?.email?.split('@')[0] || '';
  const firstName = displayName ? displayName.trim().split(/\s+/)[0] : '';
  const userInitials = (displayName || 'Guest')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Navigation State
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  const avatarMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCurrentDateFormatted(
      new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    );
  }, []);

  // Close avatar dropdown on outside click or Escape
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAvatarMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF9FD]/95 backdrop-blur-md border-b border-sanctuary-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center">
              <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />
            </Link>
          </div>

          {/* Primary Nav Links (Desktop) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1.5">
            <Link
              href="/"
              aria-current="page"
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-purple-100/90 text-purple-900 border border-brand-purple/20 shadow-xs whitespace-nowrap"
            >
              Sanctuary Home
            </Link>
            <Link
              href="/breathe"
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathe</span>
            </Link>
            <Link
              href="/history"
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>
            <Link
              href="/questionnaire"
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Questionnaire</span>
            </Link>
          </nav>

          {/* User Avatar Dropdown & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Avatar Dropdown */}
            <div className="relative" ref={avatarMenuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isAvatarMenuOpen}
                aria-label="User account menu"
                onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-brand-purple-light transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
              >
                <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {userInitials}
                </div>
                <ChevronDown size={14} className="text-sanctuary-text-secondary hidden sm:block" />
              </button>

              {isAvatarMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 bg-white border border-sanctuary-border rounded-2xl shadow-sanctuary-floating py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-4 py-2 border-b border-sanctuary-border/60">
                    <p className="text-xs font-bold text-sanctuary-text-primary truncate">
                      {displayName || 'Sanctuary Guest'}
                    </p>
                    <p className="text-[11px] text-sanctuary-text-secondary truncate">
                      {user?.email || 'Local private profile'}
                    </p>
                  </div>

                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setIsAvatarMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-sanctuary-text-primary hover:bg-sanctuary-muted transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-sanctuary-text-secondary" />
                    <span>Settings &amp; Privacy</span>
                  </Link>

                  {user ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsAvatarMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <div className="border-t border-sanctuary-border/60 pt-1 mt-1">
                      <Link
                        href="/auth/login"
                        role="menuitem"
                        onClick={() => setIsAvatarMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-brand-purple hover:bg-sanctuary-muted"
                      >
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/auth/register"
                        role="menuitem"
                        onClick={() => setIsAvatarMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-purple hover:bg-sanctuary-muted"
                      >
                        <span>Create Account</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 text-sanctuary-text-secondary hover:text-sanctuary-text-primary hover:bg-sanctuary-muted rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Sheet */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="lg:hidden px-4 py-3 border-t border-sanctuary-border bg-white/95 backdrop-blur-md flex flex-col gap-1.5 animate-in slide-in-from-top-2"
          >
            <Link
              href="/"
              aria-current="page"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-100/90 text-purple-900 border border-brand-purple/20"
            >
              Sanctuary Home
            </Link>
            <Link
              href="/breathe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-sanctuary-text-secondary hover:bg-sanctuary-muted flex items-center gap-2"
            >
              <Wind className="w-4 h-4 text-brand-purple" />
              <span>Breathe</span>
            </Link>
            <Link
              href="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-sanctuary-text-secondary hover:bg-sanctuary-muted flex items-center gap-2"
            >
              <Feather className="w-4 h-4 text-brand-purple" />
              <span>History</span>
            </Link>
            <Link
              href="/questionnaire"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-sanctuary-text-secondary hover:bg-sanctuary-muted flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-brand-purple" />
              <span>Questionnaire</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-sanctuary-text-secondary hover:bg-sanctuary-muted flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4 text-brand-purple" />
              <span>Settings</span>
            </Link>
          </nav>
        )}
      </header>

      {/* Main Dashboard Layout */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex flex-col gap-6">
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

        {/* Guest Data Migration Prompt if user is authenticated and has local records */}
        <GuestMigrationPrompt />

        {/* Welcome Greeting Banner (Refined without redundant eyebrow) */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div className="flex flex-col">
            {currentDateFormatted && (
              <p className="text-xs font-bold text-brand-purple">
                {currentDateFormatted}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-normal mt-0.5">
              {firstName ? `Welcome back to peace, ${firstName}.` : 'Welcome back to peace.'}
            </h1>
            <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-1 max-w-xl">
              Check in with your emotions, explore guided reflections, and take a gentle breath in your personal sanctuary.
            </p>
          </div>

          {/* Accessible Silent Sanctuary Toggle Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              role="button"
              aria-pressed={!settings.ambientSound}
              title="Mute all sounds and ambient audio"
              onClick={toggleAmbientSound}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-purple ${
                !settings.ambientSound
                  ? 'bg-brand-purple text-white border border-brand-purple-hover'
                  : 'bg-white text-sanctuary-text-secondary border border-sanctuary-border hover:bg-sanctuary-muted'
              }`}
            >
              {!settings.ambientSound ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>Silent: On</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-brand-mint" />
                  <span>Silent: Off</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 2-Column Responsive Layout - Equal Height Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Daily Mood Check-In */}
          <section id="mood-check-in" aria-labelledby="check-in-heading" className="h-full flex flex-col">
            <DailyMoodCheckIn
              todayEntry={moodsLoaded ? todayEntry : null}
              onSave={(level, note) => saveMood(level, note)}
              className="h-full"
            />
          </section>

          {/* Right Column: Guided Breathing Exercise */}
          <section id="breathe-card" aria-labelledby="breathe-heading" className="h-full flex flex-col">
            <BreathingExercise
              initialPattern="gentle"
              targetCycles={4}
              className="h-full"
            />
          </section>
        </div>

        {/* Secondary Dashboard Row: 7-Day Overview & Daily Reflection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Simple 7-Day Overview Card & Mood History List */}
          <section className="flex flex-col gap-6 w-full">
            <div id="overview" className="scroll-mt-24">
              <SevenDayOverview days={moodsLoaded ? sevenDayOverview : []} />
            </div>

            <div id="history" className="scroll-mt-24">
              <MoodHistoryList
                entries={moodsLoaded ? entries : []}
                onDelete={(id) => removeMood(id)}
              />
            </div>
          </section>

          {/* Right Column: Guided Breathing Exercise & Daily Reflection */}
          <div className="flex flex-col gap-6 w-full">
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
                    id="daily-reflection-input"
                    aria-label="Write your mindful reflection response"
                    rows={3}
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="Write a few mindful words..."
                    className="w-full bg-transparent text-xs sm:text-sm text-sanctuary-text-primary placeholder:text-sanctuary-text-muted outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sanctuary-text-muted" suppressHydrationWarning>
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
                  <span>Personal Wellness Sanctuary</span>
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
                Renew You keeps your moods and reflections secure and private to your account. You can review or clear your data at any time in Settings.
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
              Private &amp; Secure
            </span>
          </div>
        </div>

        {/* Wellness & Emergency Care Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-sanctuary-border/40 text-[11px] text-sanctuary-text-muted text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Renew You is a mindful self-reflection companion, not a provider of clinical diagnosis, treatment, or emergency care.</span>
          <span>If you are in distress or crisis, please contact local health services or dial/text <strong>988</strong> (US/Canada).</span>
        </div>
      </footer>
    </div>
  );
}
