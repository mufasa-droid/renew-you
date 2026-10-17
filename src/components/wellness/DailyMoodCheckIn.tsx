'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { MoodLevel, MoodEntry } from '@/types/mood';
import { MOOD_CONFIGS } from '@/lib/moodConstants';
import { formatDisplayDate, getLocalTodayDateKey } from '@/lib/moodStorage';
import { MoodOptionCard } from './MoodOptionCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  CheckCircle2,
  Edit3,
  Lock,
  Heart,
  AlertCircle,
} from 'lucide-react';

interface DailyMoodCheckInProps {
  todayEntry: MoodEntry | null;
  onSave: (level: MoodLevel, note?: string) => void;
  className?: string;
}

const MAX_NOTE_LENGTH = 280;

function getClientTodayDate() {
  if (typeof window === 'undefined') return 'Today';
  return formatDisplayDate(getLocalTodayDateKey());
}
function getServerTodayDate() {
  return 'Today';
}
function emptySubscribe() {
  return () => {};
}

export function DailyMoodCheckIn({
  todayEntry,
  onSave,
  className = '',
}: DailyMoodCheckInProps) {
  const [selectedLevel, setSelectedLevel] = useState<MoodLevel | undefined>(
    todayEntry?.level
  );
  const [note, setNote] = useState<string>(todayEntry?.note || '');
  const [isEditing, setIsEditing] = useState<boolean>(!todayEntry);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Read current date via useSyncExternalStore for hydration-safe rendering
  const todayDisplayDate = useSyncExternalStore(
    emptySubscribe,
    getClientTodayDate,
    getServerTodayDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation: Exactly one mood selected
    if (!selectedLevel) {
      setErrorMessage('Please select one of the five mood options to check in.');
      return;
    }

    if (note.length > MAX_NOTE_LENGTH) {
      setErrorMessage(`Notes must be ${MAX_NOTE_LENGTH} characters or fewer.`);
      return;
    }

    // Save check-in (creates or edits in-place for today)
    onSave(selectedLevel, note);

    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  const handleStartEdit = () => {
    if (todayEntry) {
      setSelectedLevel(todayEntry.level);
      setNote(todayEntry.note || '');
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (todayEntry) {
      setSelectedLevel(todayEntry.level);
      setNote(todayEntry.note || '');
      setIsEditing(false);
      setErrorMessage(null);
    }
  };

  const currentConfig = todayEntry ? MOOD_CONFIGS[todayEntry.level] : null;

  return (
    <Card
      variant="white"
      className={`p-6 sm:p-8 flex flex-col gap-6 border-2 border-sanctuary-border shadow-sanctuary-sm ${className}`}
    >
      {/* Header: Date & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sanctuary-border/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-purple-light text-brand-purple flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-sanctuary-text-primary tracking-tight">
              Daily Mood Check-In
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-sanctuary-text-secondary mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-sanctuary-text-muted" />
              <span>{todayDisplayDate}</span>
            </div>
          </div>
        </div>

        {todayEntry && !isEditing ? (
          <Badge variant="mint" size="md" className="w-fit">
            Checked in today
          </Badge>
        ) : (
          <Badge variant="purple" size="md" className="w-fit">
            1 entry per day
          </Badge>
        )}
      </div>

      {/* Success Notification Banner */}
      {showSuccess && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-brand-mint-light border border-brand-mint/30 text-brand-mint text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-300"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-brand-mint" />
          <span>
            Your check-in for today ({todayDisplayDate}) has been saved to your sanctuary.
          </span>
        </div>
      )}

      {/* State A: Already Checked In (Duplicate Prevention View with Edit Option) */}
      {todayEntry && !isEditing ? (
        <div className="flex flex-col gap-5 py-2">
          <div
            className="p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: currentConfig?.bgColor,
              borderColor: currentConfig?.borderColor,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sanctuary-sm shrink-0"
                style={{ backgroundColor: currentConfig?.color }}
              >
                {currentConfig?.score}/5
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-text-secondary">
                  Today&apos;s Feeling
                </span>
                <h3 className="text-xl font-bold text-sanctuary-text-primary capitalize">
                  {currentConfig?.label}
                </h3>
                <p className="text-xs text-sanctuary-text-secondary mt-0.5">
                  {currentConfig?.description}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              leftIcon={<Edit3 className="w-3.5 h-3.5 text-brand-purple" />}
            >
              Edit Today&apos;s Check-in
            </Button>
          </div>

          {/* Saved Optional Note */}
          {todayEntry.note ? (
            <div className="p-4 rounded-2xl bg-sanctuary-bg border border-sanctuary-border/80 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-sanctuary-text-secondary uppercase tracking-wider">
                Today&apos;s Private Note:
              </span>
              <p className="text-xs sm:text-sm text-sanctuary-text-primary italic leading-relaxed">
                &quot;{todayEntry.note}&quot;
              </p>
            </div>
          ) : (
            <p className="text-xs text-sanctuary-text-muted italic">
              No additional note recorded for today. You can tap &quot;Edit&quot; anytime to add one.
            </p>
          )}
        </div>
      ) : (
        /* State B: Active Check-In Form (Create or Edit Mode) */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-sanctuary-text-primary">
              1. How would you describe your overall state right now?
            </span>
            <MoodOptionCard
              selectedLevel={selectedLevel}
              onSelect={(level) => {
                setSelectedLevel(level);
                setErrorMessage(null);
              }}
            />
          </div>

          {/* Optional Short Note */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="mood-note" className="font-semibold text-sanctuary-text-primary">
                2. Optional note (thoughts, circumstances, or feelings):
              </label>
              <span
                className={`text-[11px] font-medium ${
                  note.length > MAX_NOTE_LENGTH
                    ? 'text-sanctuary-error font-bold'
                    : 'text-sanctuary-text-muted'
                }`}
              >
                {note.length}/{MAX_NOTE_LENGTH}
              </span>
            </div>

            <div className="rounded-2xl border border-sanctuary-border bg-sanctuary-bg/40 focus-within:bg-white focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/20 transition-all p-3.5">
              <textarea
                id="mood-note"
                rows={3}
                maxLength={MAX_NOTE_LENGTH}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What might be contributing to this feeling? (Kept confidential on your device)"
                className="w-full bg-transparent text-xs sm:text-sm text-sanctuary-text-primary placeholder:text-sanctuary-text-muted outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Validation Feedback */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-sanctuary-error-bg border border-sanctuary-error-border text-xs text-sanctuary-error font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions & Privacy Note */}
          <div className="pt-2 border-t border-sanctuary-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-sanctuary-text-muted">
              <Lock className="w-3.5 h-3.5 text-brand-mint shrink-0" />
              <span>Strictly confidential. Never uploaded or profiled.</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {todayEntry && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                {todayEntry ? 'Update Today’s Check-in' : 'Save Today’s Check-in'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Card>
  );
}
