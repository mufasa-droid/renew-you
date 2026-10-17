'use client';

import React, { useState } from 'react';
import { Logo, LotusMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  DailyMoodCheckIn,
  SevenDayOverview,
  MoodHistoryList,
} from '@/components/wellness';
import { useMoodTracker } from '@/lib/useMoodTracker';
import {
  Heart,
  Feather,
  Wind,
  Settings as SettingsIcon,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  VolumeX,
  Shuffle,
  Trash2,
  Sun,
  Calendar,
  Lock,
} from 'lucide-react';

export default function RenewYouHomepage() {
  // Navigation State
  const [activeNav, setActiveNav] = useState<'home' | 'checkin' | 'overview' | 'history' | 'settings'>('home');
  const [modalOpen, setModalOpen] = useState<'settings' | 'breathe' | 'reflect' | null>(null);

  // Persistent Client-Side Mood Storage Hook
  const {
    entries,
    todayEntry,
    sevenDayOverview,
    isLoaded,
    saveMood,
    removeMood,
  } = useMoodTracker();

  // In-Memory Reflection State
  const curatedPrompts = [
    'What is one gentle boundary or quiet moment you can gift yourself today?',
    'What thoughts or tensions are you ready to soften your grip on right now?',
    'What brought a subtle, quiet feeling of gratitude to your day?',
    'If you were speaking to a dear friend feeling what you feel, what would you say?',
    'What does your physical body need most in this moment?',
  ];
  const [promptIndex, setPromptIndex] = useState(0);
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflections, setReflections] = useState<{ id: string; prompt: string; text: string; time: string }[]>([]);
  const [reflectionSuccess, setReflectionSuccess] = useState(false);

  // Guided Breathing Pacer State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Settings State
  const [ambientSound, setAmbientSound] = useState(false);

  // Breathing timer interval
  React.useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          setBreathPhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const toggleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathPhase('Inhale');
      setBreathTimer(4);
    } else {
      setIsBreathing(true);
    }
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    const newReflection = {
      id: Date.now().toString(),
      prompt: curatedPrompts[promptIndex],
      text: reflectionInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setReflections([newReflection, ...reflections]);
    setReflectionInput('');
    setReflectionSuccess(true);
    setTimeout(() => setReflectionSuccess(false), 3000);
  };

  const handleShufflePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % curatedPrompts.length);
  };

  const handleClearAllStorage = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('renew_you_mood_entries_v1');
      window.location.reload();
    }
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
            <button
              type="button"
              onClick={() => setModalOpen('breathe')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathe</span>
            </button>
          </nav>

          {/* Guest Status & Settings */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-light text-brand-mint text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guest Session</span>
            </span>

            <button
              type="button"
              aria-label="Settings & Privacy"
              onClick={() => setModalOpen('settings')}
              className="p-2.5 rounded-full bg-white border border-sanctuary-border hover:bg-sanctuary-muted text-sanctuary-text-secondary hover:text-brand-purple shadow-sanctuary-sm transition-all cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
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
          <button
            type="button"
            onClick={() => setModalOpen('breathe')}
            className="py-1 px-3 text-sanctuary-text-secondary hover:text-brand-purple"
          >
            Breathe
          </button>
          <button
            type="button"
            onClick={() => setModalOpen('settings')}
            className="py-1 px-3 text-sanctuary-text-secondary hover:text-brand-purple"
          >
            Settings
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
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
              Check in with your emotions without signing up. Your entries and notes are confidential, kept safely on your device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={ambientSound ? <Volume2 className="w-4 h-4 text-brand-mint" /> : <VolumeX className="w-4 h-4" />}
              onClick={() => setAmbientSound(!ambientSound)}
            >
              {ambientSound ? 'Ambiance On' : 'Silent Sanctuary'}
            </Button>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Daily Mood Check-In & 7-Day Overview (lg:col-span-7) */}
          <section className="lg:col-span-7 flex flex-col gap-8">
            {/* Prominent Daily Mood Check-In Card */}
            <div id="check-in" className="scroll-mt-24">
              <DailyMoodCheckIn
                todayEntry={isLoaded ? todayEntry : null}
                onSave={(level, note) => saveMood(level, note)}
              />
            </div>

            {/* Simple 7-Day Overview Card */}
            <div id="overview" className="scroll-mt-24">
              <SevenDayOverview days={isLoaded ? sevenDayOverview : []} />
            </div>

            {/* Chronological Mood History List */}
            <div id="history" className="scroll-mt-24">
              <MoodHistoryList
                entries={isLoaded ? entries : []}
                onDelete={(id) => removeMood(id)}
              />
            </div>
          </section>

          {/* Right Column: Mindful Breathing Shortcut & Daily Reflection (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Shortcut to Guided Breathing Exercise */}
            <Card variant="tinted-purple" className="p-6 sm:p-7 flex flex-col gap-5 border border-brand-purple/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white text-brand-purple flex items-center justify-center shadow-sanctuary-sm">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-sanctuary-text-primary">
                      Pause: Slow Down & Notice
                    </h3>
                    <span className="text-[11px] text-sanctuary-text-secondary">
                      Guided 4-4-4 Box Breathing
                    </span>
                  </div>
                </div>

                <Badge variant="mint" size="sm">
                  3 Mins
                </Badge>
              </div>

              {/* Animated Pacer Visualizer */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-sanctuary-border text-center">
                <div
                  className={`w-28 h-28 rounded-full border-4 border-brand-purple-light flex flex-col items-center justify-center transition-all duration-1000 ${
                    isBreathing && breathPhase === 'Inhale'
                      ? 'scale-110 bg-[#EFEBFA]'
                      : isBreathing && breathPhase === 'Hold'
                      ? 'scale-105 bg-brand-mint-light border-brand-mint'
                      : isBreathing && breathPhase === 'Exhale'
                      ? 'scale-90 bg-white'
                      : 'bg-white'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sanctuary-text-secondary">
                    {isBreathing ? breathPhase : 'Ready'}
                  </span>
                  <span className="text-2xl font-extrabold text-brand-purple my-0.5">
                    {isBreathing ? breathTimer : '4s'}
                  </span>
                  <span className="text-[9px] text-sanctuary-text-muted">
                    {isBreathing ? 'rhythm' : 'Box Pacer'}
                  </span>
                </div>

                <p className="text-xs text-sanctuary-text-secondary mt-3 max-w-xs">
                  {isBreathing
                    ? breathPhase === 'Inhale'
                      ? 'Inhale gently through your nose...'
                      : breathPhase === 'Hold'
                      ? 'Hold and soften your shoulders...'
                      : 'Slow, steady exhale through mouth...'
                    : 'A gentle rhythm to calm nervous system agitation.'}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isBreathing ? 'secondary' : 'primary'}
                  size="md"
                  fullWidth
                  onClick={toggleBreathing}
                  leftIcon={isBreathing ? <RotateCcw className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
                >
                  {isBreathing ? 'Pause Breathing' : 'Start 1-Min Breathwork'}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen('breathe')}
                >
                  Full
                </Button>
              </div>
            </Card>

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
                    {reflections.length} {reflections.length === 1 ? 'reflection' : 'reflections'} saved
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
              {reflections.length > 0 && (
                <div className="pt-3 border-t border-sanctuary-border flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-text-secondary">
                    Today&apos;s Reflections
                  </span>
                  <div className="max-h-36 overflow-y-auto flex flex-col gap-2 pr-1">
                    {reflections.map((ref) => (
                      <div
                        key={ref.id}
                        className="p-2.5 rounded-lg bg-sanctuary-bg border border-sanctuary-border/80 text-xs flex flex-col gap-1"
                      >
                        <span className="text-[10px] text-sanctuary-text-muted self-end">
                          {ref.time}
                        </span>
                        <p className="text-sanctuary-text-primary leading-snug">{ref.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Privacy Reassurance Card */}
            <Card variant="muted" className="p-5 border border-sanctuary-border flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-text-primary">
                <Lock className="w-4 h-4 text-brand-mint" />
                <span>Confidential Guest Sanctuary</span>
              </div>
              <p className="text-[11px] text-sanctuary-text-secondary leading-relaxed">
                Renew You is built for personal well-being. Moods and notes are never transmitted to external servers, analyzed by algorithms, or used to make mental health diagnoses.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Modal: Full Breathing Exercise */}
      <Modal
        isOpen={modalOpen === 'breathe'}
        onClose={() => setModalOpen(null)}
        title="Mindful Pause — Full Screen Visualizer"
        description="Relax your jaw and eyes. Allow yourself this gentle pause."
        maxWidth="md"
      >
        <div className="flex flex-col items-center text-center py-4">
          <div
            className={`w-44 h-44 rounded-full border-4 border-brand-purple-light flex flex-col items-center justify-center transition-all duration-1000 shadow-sanctuary-floating my-6 ${
              isBreathing && breathPhase === 'Inhale'
                ? 'scale-110 bg-[#EFEBFA]'
                : isBreathing && breathPhase === 'Hold'
                ? 'scale-105 bg-brand-mint-light border-brand-mint'
                : isBreathing && breathPhase === 'Exhale'
                ? 'scale-90 bg-white'
                : 'bg-white'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-sanctuary-text-secondary">
              {isBreathing ? breathPhase : 'Ready'}
            </span>
            <span className="text-4xl font-extrabold text-brand-purple my-1">
              {isBreathing ? breathTimer : '4'}
            </span>
            <span className="text-[10px] text-sanctuary-text-muted">
              {isBreathing ? 'seconds' : 'Start Below'}
            </span>
          </div>

          <Button
            variant={isBreathing ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={toggleBreathing}
            leftIcon={isBreathing ? <RotateCcw className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
          >
            {isBreathing ? 'Stop Exercise' : 'Begin 4-4-4 Breathing'}
          </Button>
        </div>
      </Modal>

      {/* Modal: Settings & Guest Preferences */}
      <Modal
        isOpen={modalOpen === 'settings'}
        onClose={() => setModalOpen(null)}
        title="Sanctuary Settings & Privacy"
        description="Manage your guest preferences and session data."
        maxWidth="md"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-sanctuary-bg border border-sanctuary-border">
            <div>
              <span className="text-xs font-bold text-sanctuary-text-primary block">
                Ambient Soundscape
              </span>
              <span className="text-[11px] text-sanctuary-text-secondary">
                Soft mindfulness chimes during reflections
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={ambientSound}
              onClick={() => setAmbientSound(!ambientSound)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                ambientSound ? 'bg-brand-purple' : 'bg-sanctuary-border'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  ambientSound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-sanctuary-bg border border-sanctuary-border flex flex-col gap-1.5">
            <span className="text-xs font-bold text-sanctuary-text-primary">
              Session Privacy Status
            </span>
            <p className="text-[11px] text-sanctuary-text-secondary leading-relaxed">
              You are browsing as an anonymous guest. All logged moods ({entries.length} stored entries) exist securely on your local device.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-sanctuary-error" />}
              onClick={() => {
                if (window.confirm('Are you sure you want to erase all stored moods from this device?')) {
                  handleClearAllStorage();
                }
              }}
            >
              Clear Stored Data
            </Button>

            <Button variant="primary" size="sm" onClick={() => setModalOpen(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-sanctuary-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sanctuary-text-secondary">
          <div className="flex items-center gap-2">
            <LotusMark size={20} />
            <span className="font-bold text-sanctuary-text-primary">Renew You</span>
            <span className="text-sanctuary-text-muted">&bull; Pause. Reflect. Renew.</span>
          </div>
          <div className="flex items-center gap-4">
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
