'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MoodChip, MoodCategorySelector } from '@/components/ui/MoodOption';
import { EmotionCategory } from '@/types/wellness';
import {
  Heart,
  Feather,
  Wind,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface SavedReflection {
  id: string;
  category: EmotionCategory;
  mood: string;
  prompt: string;
  text: string;
  time: string;
}

export function InteractiveSanctuary() {
  const [activeTab, setActiveTab] = useState<'mood' | 'reflect' | 'breathe'>('mood');
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory>('pleasant');
  const [selectedMood, setSelectedMood] = useState<string>('Calm');
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([
    {
      id: 'demo-1',
      category: 'pleasant',
      mood: 'Calm',
      prompt: 'What brought a gentle sense of peace to your day?',
      text: 'Taking a 5-minute quiet walk outside without my phone. The afternoon breeze felt refreshing.',
      time: 'Today at 2:15 PM',
    },
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Breathing pacer state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold';
            if (currentPhase === 'Hold') return 'Exhale';
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

  const moodPresets: Record<EmotionCategory, string[]> = {
    pleasant: ['Calm', 'Grateful', 'Balanced', 'Content', 'Hopeful', 'Joyful'],
    neutral: ['Reflective', 'Quiet', 'Observing', 'Still', 'Uncertain', 'Pensive'],
    heavy: ['Overwhelmed', 'Pressured', 'Unsettled', 'Fatigued', 'Anxious', 'Tired'],
  };

  const reflectionPrompts: Record<EmotionCategory, string> = {
    pleasant: 'What helped cultivate this feeling of peace or gratitude today?',
    neutral: 'What thoughts are gently passing through your mind in this quiet moment?',
    heavy: 'What does your heart and mind need right now to feel supported?',
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    const newEntry: SavedReflection = {
      id: Date.now().toString(),
      category: selectedCategory,
      mood: selectedMood,
      prompt: reflectionPrompts[selectedCategory],
      text: reflectionInput,
      time: 'Just now',
    };

    setSavedReflections([newEntry, ...savedReflections]);
    setReflectionInput('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="sanctuary" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
      {/* Sanctuary Heading */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
        <Badge variant="purple" size="md" className="mb-3">
          Interactive Sanctuary Experience
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-sanctuary-text-primary tracking-tight">
          Understand what you feel. Discover your next step.
        </h2>
        <p className="text-sm sm:text-base text-sanctuary-text-secondary mt-3 leading-relaxed">
          Test the core wellness features directly in your browser. All reflections remain strictly private and client-side on your device.
        </p>

        {/* Feature Navigation Tabs */}
        <div className="inline-flex items-center p-1 rounded-full bg-sanctuary-muted border border-sanctuary-border mt-8 max-w-md w-full">
          <button
            type="button"
            onClick={() => setActiveTab('mood')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'mood'
                ? 'bg-white text-brand-purple shadow-sanctuary-sm'
                : 'text-sanctuary-text-secondary hover:text-sanctuary-text-primary'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>1. Emotion Wheel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reflect')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'reflect'
                ? 'bg-white text-brand-purple shadow-sanctuary-sm'
                : 'text-sanctuary-text-secondary hover:text-sanctuary-text-primary'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>2. Reflection</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breathe')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'breathe'
                ? 'bg-white text-brand-purple shadow-sanctuary-sm'
                : 'text-sanctuary-text-secondary hover:text-sanctuary-text-primary'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>3. Mindful Pause</span>
          </button>
        </div>
      </div>

      {/* Main Sanctuary Card Container */}
      <div className="bg-white rounded-3xl border border-sanctuary-border shadow-sanctuary-floating p-6 sm:p-10 lg:p-12">
        {activeTab === 'mood' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive Radial Wheel SVG */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-sanctuary-bg/70 rounded-2xl border border-sanctuary-border">
              <span className="text-xs font-semibold text-sanctuary-text-muted uppercase tracking-wider mb-2">
                Emotion Wheel Visualization
              </span>

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
                {/* SVG Radial Wheel */}
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {/* Pleasant Sector (Mint) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#38B289"
                    strokeWidth={selectedCategory === 'pleasant' ? '28' : '20'}
                    strokeDasharray="157 314"
                    strokeDashoffset="0"
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    onClick={() => setSelectedCategory('pleasant')}
                  />
                  {/* Neutral Sector (Lavender) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#7E67CA"
                    strokeWidth={selectedCategory === 'neutral' ? '28' : '20'}
                    strokeDasharray="157 314"
                    strokeDashoffset="-157"
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    onClick={() => setSelectedCategory('neutral')}
                  />
                  {/* Heavy Sector (Deep Purple) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#5E44B3"
                    strokeWidth={selectedCategory === 'heavy' ? '28' : '20'}
                    strokeDasharray="157 314"
                    strokeDashoffset="-314"
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    onClick={() => setSelectedCategory('heavy')}
                  />
                </svg>

                {/* Center Badge */}
                <div className="absolute w-28 h-28 rounded-full bg-white shadow-sanctuary-md flex flex-col items-center justify-center p-2 text-center border border-sanctuary-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sanctuary-text-muted">
                    Active
                  </span>
                  <span className="text-sm font-bold text-sanctuary-text-primary capitalize mt-0.5">
                    {selectedMood}
                  </span>
                  <span className="text-[10px] text-brand-purple font-medium capitalize">
                    {selectedCategory}
                  </span>
                </div>
              </div>

              <p className="text-xs text-sanctuary-text-secondary mt-3">
                Click a wheel segment or tier below to explore emotion spectrums.
              </p>
            </div>

            {/* Right: Category and Mood Options */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                  Step 1: Choose Emotion Tier
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-sanctuary-text-primary mt-1">
                  What feels most true right now?
                </h3>
              </div>

              <MoodCategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedMood(moodPresets[cat][0]);
                }}
              />

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold text-sanctuary-text-secondary">
                  Choose specific feeling tone:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {moodPresets[selectedCategory].map((mood) => (
                    <MoodChip
                      key={mood}
                      label={mood}
                      category={selectedCategory}
                      selected={selectedMood === mood}
                      onClick={() => setSelectedMood(mood)}
                      size="md"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-sanctuary-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-sanctuary-text-muted">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                  <span>Feeling identified: <strong>{selectedMood}</strong></span>
                </div>

                <Button
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setActiveTab('reflect')}
                >
                  Continue to Reflection
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reflect' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Reflection Form */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="purple" size="sm">
                    {selectedMood} ({selectedCategory})
                  </Badge>
                  <span className="text-xs text-sanctuary-text-muted">Private Thought Journal</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-sanctuary-text-primary">
                  {reflectionPrompts[selectedCategory]}
                </h3>
                <p className="text-xs text-sanctuary-text-secondary mt-1">
                  Write freely without censoring. Your reflection stays securely in your browser.
                </p>
              </div>

              <form onSubmit={handleSaveReflection} className="flex flex-col gap-4">
                <div className="relative rounded-2xl border border-sanctuary-border bg-sanctuary-bg/40 focus-within:bg-white focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/20 transition-all p-4">
                  <textarea
                    rows={5}
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="Type your reflection here... take a slow breath as words come to mind."
                    className="w-full bg-transparent text-sm text-sanctuary-text-primary placeholder:text-sanctuary-text-muted outline-none resize-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-sanctuary-border/60 text-xs text-sanctuary-text-muted">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-brand-mint" />
                      Client-side encryption simulation
                    </span>
                    <span>{reflectionInput.length} characters</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={() => setActiveTab('mood')}
                  >
                    Change Emotion
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!reflectionInput.trim()}
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Save Reflection
                  </Button>
                </div>

                {savedSuccess && (
                  <div className="p-3 rounded-xl bg-brand-mint-light text-brand-mint text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Your reflection has been safely recorded in your sanctuary.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Saved Reflections Preview */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-sanctuary-bg/70 p-6 rounded-2xl border border-sanctuary-border">
              <div className="flex items-center justify-between pb-3 border-b border-sanctuary-border">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-purple" />
                  <h4 className="text-sm font-bold text-sanctuary-text-primary">
                    Sanctuary History ({savedReflections.length})
                  </h4>
                </div>
                <span className="text-[11px] text-brand-mint font-semibold">Local Storage</span>
              </div>

              <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                {savedReflections.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-sanctuary-border shadow-sanctuary-sm flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="purple" size="sm">
                        {item.mood}
                      </Badge>
                      <span className="text-[10px] text-sanctuary-text-muted">{item.time}</span>
                    </div>
                    <p className="text-xs text-sanctuary-text-secondary italic">
                      &quot;{item.prompt}&quot;
                    </p>
                    <p className="text-xs text-sanctuary-text-primary font-medium leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'breathe' && (
          <div className="flex flex-col items-center text-center max-w-xl mx-auto py-6">
            <Badge variant="mint" size="md" className="mb-2">
              Mindful Exercise
            </Badge>
            <h3 className="text-2xl font-bold text-sanctuary-text-primary">
              Pause: Slow down & notice
            </h3>
            <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-1.5 max-w-md leading-relaxed">
              Box breathing activates the parasympathetic nervous system, easing tension and bringing gentle clarity.
            </p>

            {/* Interactive Breathing Visualizer Circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-10 flex items-center justify-center">
              {/* Pulsing Outer Glow */}
              <div
                className={`absolute inset-0 rounded-full bg-brand-purple/10 blur-xl transition-all duration-1000 ${
                  isBreathing && breathPhase === 'Inhale'
                    ? 'scale-125 opacity-70'
                    : isBreathing && breathPhase === 'Hold'
                    ? 'scale-120 opacity-90'
                    : 'scale-90 opacity-30'
                }`}
              />

              {/* Animated Core Ring */}
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-brand-purple-light flex flex-col items-center justify-center transition-all duration-1000 shadow-sanctuary-floating ${
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
                <span className="text-[11px] text-sanctuary-text-muted">
                  {isBreathing ? 'seconds' : 'Seconds Box'}
                </span>
              </div>
            </div>

            {/* Exercise Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant={isBreathing ? 'secondary' : 'primary'}
                size="lg"
                onClick={toggleBreathing}
                leftIcon={isBreathing ? <RotateCcw className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
              >
                {isBreathing ? 'Pause Practice' : 'Start 60-Sec Breathing'}
              </Button>
            </div>

            <p className="text-xs text-sanctuary-text-muted mt-6 max-w-sm">
              Tip: Allow your shoulders to drop gently away from your ears as you breathe out.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
