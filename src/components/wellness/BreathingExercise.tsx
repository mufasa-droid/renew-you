'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Square,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

export type BreathingPatternId = 'gentle' | 'calm-flow' | 'box';

interface PhaseConfig {
  name: 'Breathe in' | 'Hold' | 'Breathe out';
  duration: number; // in seconds
  scale: string; // Tailwind scale or transform state
  colorClass: string;
}

interface PatternConfig {
  id: BreathingPatternId;
  name: string;
  description: string;
  phases: PhaseConfig[];
  totalCycleDuration: number;
}

const PATTERNS: PatternConfig[] = [
  {
    id: 'gentle',
    name: 'Gentle 4-4 (Natural Flow)',
    description: 'Steady 4-second in, 4-second out. No breath holding.',
    phases: [
      { name: 'Breathe in', duration: 4, scale: 'scale-125', colorClass: 'bg-[#EFEBFA] border-[#5E44B3]' },
      { name: 'Breathe out', duration: 4, scale: 'scale-90', colorClass: 'bg-white border-[#38B289]' },
    ],
    totalCycleDuration: 8,
  },
  {
    id: 'calm-flow',
    name: 'Calming 4-6 (Elongated Exhale)',
    description: '4-second inhale with an extended 6-second exhale to ease nervous tension.',
    phases: [
      { name: 'Breathe in', duration: 4, scale: 'scale-125', colorClass: 'bg-[#EFEBFA] border-[#5E44B3]' },
      { name: 'Breathe out', duration: 6, scale: 'scale-90', colorClass: 'bg-white border-[#38B289]' },
    ],
    totalCycleDuration: 10,
  },
  {
    id: 'box',
    name: 'Box 4-4-4 (Gently Centered)',
    description: 'Balanced 4-second inhale, gentle 4-second hold, and 4-second exhale.',
    phases: [
      { name: 'Breathe in', duration: 4, scale: 'scale-125', colorClass: 'bg-[#EFEBFA] border-[#5E44B3]' },
      { name: 'Hold', duration: 4, scale: 'scale-115', colorClass: 'bg-brand-mint-light border-brand-mint' },
      { name: 'Breathe out', duration: 4, scale: 'scale-90', colorClass: 'bg-white border-[#5E44B3]' },
    ],
    totalCycleDuration: 12,
  },
];

export interface BreathingExerciseProps {
  initialPattern?: BreathingPatternId;
  targetCycles?: number;
  onComplete?: () => void;
  className?: string;
}

export function BreathingExercise({
  initialPattern = 'gentle',
  targetCycles = 5,
  onComplete,
  className = '',
}: BreathingExerciseProps) {
  // Exercise State: 'idle' | 'running' | 'paused' | 'completed'
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [selectedPatternId, setSelectedPatternId] = useState<BreathingPatternId>(initialPattern);

  // Active Cycle State
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer Ref to guarantee exactly one timer instance
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePattern = PATTERNS.find((p) => p.id === selectedPatternId) || PATTERNS[0];
  const currentPhase = activePattern.phases[phaseIndex] || activePattern.phases[0];

  // Helper to safely clear timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Handle countdown tick
  const handleTick = useCallback(() => {
    setElapsedSeconds((prev) => prev + 1);

    setPhaseSecondsLeft((prev) => {
      if (prev <= 1) {
        // Phase complete -> move to next phase or next cycle
        setPhaseIndex((currentPhaseIdx) => {
          const nextIdx = currentPhaseIdx + 1;
          if (nextIdx < activePattern.phases.length) {
            // Next phase in current cycle
            return nextIdx;
          } else {
            // Cycle finished -> check if target reached
            setCurrentCycle((prevCycle) => {
              if (prevCycle >= targetCycles) {
                // Completed all cycles
                stopTimer();
                setStatus('completed');
                onComplete?.();
                return prevCycle;
              }
              return prevCycle + 1;
            });
            return 0; // Reset to first phase (Breathe in)
          }
        });

        // Set duration for the upcoming phase
        const nextPhaseIdx = (phaseIndex + 1) % activePattern.phases.length;
        return activePattern.phases[nextPhaseIdx].duration;
      }
      return prev - 1;
    });
  }, [activePattern, phaseIndex, targetCycles, onComplete, stopTimer]);

  // Start Exercise
  const handleStart = () => {
    stopTimer();
    setStatus('running');
    setPhaseIndex(0);
    setPhaseSecondsLeft(activePattern.phases[0].duration);
    setCurrentCycle(1);
    setElapsedSeconds(0);

    timerRef.current = setInterval(handleTick, 1000);
  };

  // Pause Exercise
  const handlePause = () => {
    stopTimer();
    setStatus('paused');
  };

  // Resume Exercise
  const handleResume = () => {
    stopTimer();
    setStatus('running');
    timerRef.current = setInterval(handleTick, 1000);
  };

  // Stop / Reset to consistent initial state
  const handleStop = () => {
    stopTimer();
    setStatus('idle');
    setPhaseIndex(0);
    setPhaseSecondsLeft(activePattern.phases[0].duration);
    setCurrentCycle(1);
    setElapsedSeconds(0);
  };

  // Format Elapsed Time as MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      variant="white"
      className={`p-4 sm:p-10 flex flex-col items-center border border-sanctuary-border shadow-sanctuary-sm ${className}`}
    >
      {/* Top Header & Cycle Badges */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-sanctuary-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-purple-light text-brand-purple flex items-center justify-center">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-sanctuary-text-primary tracking-tight">
              Guided Breathing Exercise
            </h3>
            <span className="text-xs text-sanctuary-text-secondary">
              Personal rhythm to center your attention
            </span>
          </div>
        </div>

        {status === 'running' || status === 'paused' ? (
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              Cycle {currentCycle} / {targetCycles}
            </Badge>
            <span className="text-xs font-mono font-semibold text-sanctuary-text-secondary">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        ) : (
          <Badge variant="mint" size="sm">
            {targetCycles} Mindful Cycles
          </Badge>
        )}
      </div>

      {/* Safety & Usability Notice (Always visible) */}
      <div className="w-full mt-4 p-3 rounded-xl bg-sanctuary-muted/80 border border-sanctuary-border/60 flex items-start gap-2.5 text-xs text-sanctuary-text-secondary">
        <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Safety note:</strong> Breathe at your own comfortable, natural pace. You are in control and can stop anytime. If you feel lightheaded, breathless, or dizzy, pause and breathe normally.
        </p>
      </div>

      {/* State 1: Idle Start Screen */}
      {status === 'idle' && (
        <div className="flex flex-col items-center text-center max-w-md w-full py-6">
          <div className="w-24 h-24 rounded-full bg-brand-purple-light flex items-center justify-center text-brand-purple my-4 shadow-sanctuary-sm">
            <Wind className="w-10 h-10 stroke-[1.75]" />
          </div>

          <h4 className="text-xl font-bold text-sanctuary-text-primary">
            Ready for a Mindful Pause?
          </h4>
          <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-1.5 leading-relaxed">
            Choose your comfortable breathing cadence below. Rest your hands gently, soften your gaze, and begin whenever you are ready.
          </p>

          {/* Pattern Selection */}
          <div className="flex flex-col gap-2 w-full mt-6 text-left">
            <span className="text-xs font-semibold text-sanctuary-text-primary px-1">
              Select cadence:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                    selectedPatternId === pattern.id
                      ? 'bg-brand-purple-light/50 border-brand-purple/40 ring-1 ring-brand-purple/20'
                      : 'bg-white border-sanctuary-border hover:bg-sanctuary-muted'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-sanctuary-text-primary block">
                      {pattern.name}
                    </span>
                    <span className="text-[11px] text-sanctuary-text-secondary mt-0.5 block leading-normal">
                      {pattern.description}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-brand-purple shrink-0 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-sanctuary-border">
                    {pattern.totalCycleDuration}s / cycle
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <div className="mt-8 w-full">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStart}
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Start Guided Breathing
            </Button>
          </div>
        </div>
      )}

      {/* State 2: Active & Paused Visualizer Screen */}
      {(status === 'running' || status === 'paused') && (
        <div className="flex flex-col items-center text-center w-full py-6">
          {/* Main Visual Breathing Orb with Motion-Reduce Support */}
          <div className="relative w-56 h-56 sm:w-80 sm:h-80 my-4 flex items-center justify-center max-w-full">
            {/* Ambient Background Glow */}
            <div
              className={`absolute inset-0 rounded-full bg-brand-purple/10 blur-2xl transition-all duration-1000 motion-reduce:transition-none ${
                currentPhase.name === 'Breathe in' ? 'scale-125 opacity-70' : 'scale-90 opacity-30'
              }`}
            />

            {/* Expanding/Contracting Core Ring */}
            <div
              className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 shadow-sanctuary-floating flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out motion-reduce:transition-none motion-reduce:scale-100 ${
                currentPhase.scale
              } ${currentPhase.colorClass}`}
            >
              {/* Instruction Label */}
              <span
                className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sanctuary-text-primary px-2 transition-colors duration-300"
                aria-live="polite"
              >
                {status === 'paused' ? 'Paused' : currentPhase.name}
              </span>

              {/* Countdown Timer */}
              <span className="text-4xl sm:text-5xl font-extrabold text-brand-purple my-1">
                {phaseSecondsLeft}
              </span>

              <span className="text-[10px] text-sanctuary-text-muted">
                {status === 'paused' ? 'Tap resume' : 'seconds remaining'}
              </span>
            </div>
          </div>

          {/* Text-Based Progress (Ideal for screen readers and reduced motion) */}
          <div className="flex items-center gap-3 text-xs text-sanctuary-text-secondary mt-2">
            <span>Phase: <strong>{currentPhase.name}</strong></span>
            <span>&bull;</span>
            <span>Cycle <strong>{currentCycle} of {targetCycles}</strong></span>
          </div>

          {/* Control Bar: Pause/Resume, Stop */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full max-w-sm">
            {status === 'running' ? (
              <Button
                variant="primary"
                size="md"
                onClick={handlePause}
                leftIcon={<Pause className="w-4 h-4 fill-current" />}
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleResume}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Resume
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={handleStop}
              leftIcon={<Square className="w-4 h-4" />}
            >
              Stop &amp; Return
            </Button>
          </div>
        </div>
      )}

      {/* State 3: Completion State */}
      {status === 'completed' && (
        <div className="flex flex-col items-center text-center max-w-md w-full py-8">
          <div className="w-16 h-16 rounded-full bg-brand-mint-light text-brand-mint flex items-center justify-center mb-4 shadow-sanctuary-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h4 className="text-xl font-bold text-sanctuary-text-primary">
            Mindful Pause Completed
          </h4>
          <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-2 leading-relaxed">
            You completed {targetCycles} full cycles ({formatTime(elapsedSeconds)} of conscious breathing). Notice the subtle feeling of presence and calmness in your body.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleStart}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Start Another Session
            </Button>

            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleStop}
            >
              Return to Sanctuary
            </Button>
          </div>
        </div>
      )}

      {/* Medical Disclaimer Footer */}
      <div className="w-full mt-6 pt-4 border-t border-sanctuary-border/60 flex items-center justify-between text-[11px] text-sanctuary-text-muted">
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80" />
          <span>Mindfulness exercise for relaxation. Not intended as medical diagnosis or treatment.</span>
        </span>
        <span className="hidden sm:inline font-mono text-[10px]">Client-side only</span>
      </div>
    </Card>
  );
}
