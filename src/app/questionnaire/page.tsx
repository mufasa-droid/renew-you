'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Heart,
  Wind,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface QuestionOption {
  score: number;
  label: string;
  desc: string;
}

const ENERGY_OPTIONS: QuestionOption[] = [
  { score: 1, label: 'Deeply Drained', desc: 'Running on empty, needing rest' },
  { score: 2, label: 'Low Energy', desc: 'Sluggish, moving slowly' },
  { score: 3, label: 'Steady', desc: 'Balanced, managing comfortably' },
  { score: 4, label: 'Good Energy', desc: 'Capable, clear-headed' },
  { score: 5, label: 'Vibrant', desc: 'Refreshed, buoyant, active' },
];

const EMOTIONAL_QUALITIES = [
  'Calm & Peaceful',
  'Grateful',
  'A Bit Anxious',
  'Overwhelmed',
  'Quiet & Subdued',
  'Hopeful',
  'Content',
  'Restless',
  'Reflective',
];

const GROUNDING_OPTIONS: QuestionOption[] = [
  { score: 1, label: 'High Tension', desc: 'Shoulders tight, jaw clenched' },
  { score: 2, label: 'Mild Tightness', desc: 'Some restlessness or stiffness' },
  { score: 3, label: 'Neutral', desc: 'Comfortable, neither tense nor loose' },
  { score: 4, label: 'Relaxed', desc: 'Easy breathing, softened posture' },
  { score: 5, label: 'Grounded & At Ease', desc: 'Deeply anchored, centered' },
];

export default function MindfulQuestionnairePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedGrounding, setSelectedGrounding] = useState<number | null>(null);
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleQuality = (quality: string) => {
    setSelectedQualities((prev) =>
      prev.includes(quality) ? prev.filter((q) => q !== quality) : [...prev, quality]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    const answersPayload = {
      energyScore: selectedEnergy,
      emotionalQualities: selectedQualities,
      groundingScore: selectedGrounding,
      reflectionNote: reflectionNote.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('questionnaire_responses').insert({
            user_id: user.id,
            questionnaire_id: 'mindful-checkin-v1',
            answers: answersPayload,
          });
        }
      } catch {
        // Fallback gracefully without blocking the user
      }
    }

    setIsSubmitting(false);
    setStep(5); // Show completion screen
  };

  const resetForm = () => {
    setSelectedEnergy(null);
    setSelectedQualities([]);
    setSelectedGrounding(null);
    setReflectionNote('');
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col selection:bg-brand-purple-light selection:text-brand-purple">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FBF9FD]/95 border-b border-sanctuary-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>

          <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-sanctuary-text-muted font-medium hidden sm:inline">
              Step {Math.min(step, 4)} of 4
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {step <= 4 && (
          <div className="w-full h-1 bg-sanctuary-border">
            <div
              className="h-full bg-brand-purple transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Step 1: Energy Level */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Mindful Check-In &bull; Step 1 of 4
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
                How is your energy right now?
              </h1>
              <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                Tune in to your physical and mental stamina without judging yourself.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {ENERGY_OPTIONS.map((opt) => {
                const isSelected = selectedEnergy === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => setSelectedEnergy(opt.score)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-purple bg-[#F3EFFC] shadow-sanctuary-sm ring-1 ring-brand-purple'
                        : 'border-sanctuary-border bg-white hover:border-brand-purple/40 hover:bg-sanctuary-bg'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-sanctuary-text-primary">
                        {opt.label}
                      </span>
                      <span className="text-xs text-sanctuary-text-secondary mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-brand-purple bg-brand-purple text-white'
                          : 'border-sanctuary-border bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                disabled={selectedEnergy === null}
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Emotional Qualities */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Mindful Check-In &bull; Step 2 of 4
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
                What emotions feel most present?
              </h1>
              <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                Choose any words that resonate with your inner state today.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {EMOTIONAL_QUALITIES.map((q) => {
                const isSelected = selectedQualities.includes(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => toggleQuality(q)}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-brand-purple text-white border-brand-purple shadow-sanctuary-sm'
                        : 'bg-white text-sanctuary-text-secondary border-sanctuary-border hover:border-brand-purple/40 hover:text-brand-purple'
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-sanctuary-border">
              <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Tension & Grounding */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Mindful Check-In &bull; Step 3 of 4
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
                How does your body feel?
              </h1>
              <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                Notice physical tension in your jaw, neck, chest, or hands.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {GROUNDING_OPTIONS.map((opt) => {
                const isSelected = selectedGrounding === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => setSelectedGrounding(opt.score)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-purple bg-[#F3EFFC] shadow-sanctuary-sm ring-1 ring-brand-purple'
                        : 'border-sanctuary-border bg-white hover:border-brand-purple/40 hover:bg-sanctuary-bg'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-sanctuary-text-primary">
                        {opt.label}
                      </span>
                      <span className="text-xs text-sanctuary-text-secondary mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-brand-purple bg-brand-purple text-white'
                          : 'border-sanctuary-border bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-sanctuary-border">
              <Button variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                disabled={selectedGrounding === null}
                onClick={() => setStep(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Optional Reflection Note */}
        {step === 4 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Mindful Check-In &bull; Step 4 of 4 (Optional)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
                Any mindful thought to hold today?
              </h1>
              <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                A gentle intention, boundary, or quiet gratitude. You can leave this blank if you prefer.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sanctuary-border focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/20 transition-all">
              <textarea
                rows={4}
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="Write a few mindful thoughts (optional)..."
                className="w-full bg-transparent text-sm text-sanctuary-text-primary placeholder:text-sanctuary-text-muted outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-sanctuary-border">
              <Button variant="ghost" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleComplete} loading={isSubmitting}>
                  Skip Note
                </Button>
                <Button variant="primary" onClick={handleComplete} loading={isSubmitting} rightIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Complete Check-In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Completion & Affirmation Screen */}
        {step === 5 && (
          <Card variant="white" className="p-6 sm:p-10 border border-sanctuary-border shadow-sanctuary-md flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-brand-mint-light text-brand-mint flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <h2 className="text-2xl font-extrabold text-sanctuary-text-primary tracking-tight">
                Thank you for honoring your pause.
              </h2>
              <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                Your mindful check-in has been noted. Taking intentional time to reflect on your energy and emotions is a quiet act of self-care.
              </p>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="w-full p-4 rounded-2xl bg-sanctuary-bg border border-sanctuary-border flex flex-wrap items-center justify-center gap-3 text-xs">
              {selectedEnergy && (
                <span className="px-3 py-1 rounded-full bg-white border border-sanctuary-border text-sanctuary-text-primary font-medium">
                  Energy: <strong>{ENERGY_OPTIONS.find((o) => o.score === selectedEnergy)?.label}</strong>
                </span>
              )}
              {selectedGrounding && (
                <span className="px-3 py-1 rounded-full bg-white border border-sanctuary-border text-sanctuary-text-primary font-medium">
                  Body: <strong>{GROUNDING_OPTIONS.find((o) => o.score === selectedGrounding)?.label}</strong>
                </span>
              )}
              {selectedQualities.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-white border border-sanctuary-border text-sanctuary-text-primary font-medium">
                  {selectedQualities.length} emotional {selectedQualities.length === 1 ? 'quality' : 'qualities'}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
              <Link href="/" className="w-full">
                <Button variant="primary" fullWidth rightIcon={<Heart className="w-4 h-4" />}>
                  Back to Sanctuary
                </Button>
              </Link>
              <Button variant="outline" fullWidth onClick={resetForm} leftIcon={<RotateCcw className="w-4 h-4" />}>
                Retake
              </Button>
            </div>

            {/* Non-Diagnostic & Emergency Care Notice */}
            <div className="pt-6 border-t border-sanctuary-border/80 text-[11px] text-sanctuary-text-muted leading-relaxed max-w-lg">
              <p className="flex items-center justify-center gap-1.5 font-semibold text-sanctuary-text-secondary mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
                <span>Mindful Reflection Notice</span>
              </p>
              <p>
                Renew You is an introspective self-care tool and does not provide clinical mental health evaluations or diagnoses. If you are experiencing distressing emotions or crisis, please contact local health services or dial/text <strong>988</strong> (US/Canada).
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
