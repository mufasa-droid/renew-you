'use client';

import React from 'react';
import { MoodEntry } from '@/types/mood';
import { MOOD_CONFIGS } from '@/lib/moodConstants';
import { Card } from '@/components/ui/Card';
import { LotusMark } from '@/components/brand/Logo';
import { Clock, Trash2, Calendar, ShieldCheck } from 'lucide-react';

interface MoodHistoryListProps {
  entries: MoodEntry[];
  onDelete?: (id: string) => void;
  className?: string;
}

export function MoodHistoryList({
  entries,
  onDelete,
  className = '',
}: MoodHistoryListProps) {
  return (
    <Card variant="white" className={`p-6 sm:p-8 flex flex-col gap-5 border border-sanctuary-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sanctuary-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F3EFFC] text-brand-purple flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-sanctuary-text-primary tracking-tight">
              Previous Check-Ins
            </h3>
            <p className="text-[11px] text-sanctuary-text-secondary">
              Chronological log stored confidentially on this device
            </p>
          </div>
        </div>

        <span className="text-xs text-brand-purple font-semibold">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Empty State */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center text-center py-10 px-4">
          <div className="w-14 h-14 rounded-full bg-brand-purple-light flex items-center justify-center text-brand-purple mb-3">
            <LotusMark size={32} />
          </div>
          <h4 className="text-base font-bold text-sanctuary-text-primary">
            No Previous Check-Ins Yet
          </h4>
          <p className="text-xs text-sanctuary-text-secondary mt-1.5 max-w-sm leading-relaxed">
            Your emotional journey begins with your first check-in above. Whenever you record how you feel, your entries will be organized chronologically here.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-sanctuary-text-muted mt-4">
            <ShieldCheck className="w-4 h-4 text-brand-mint" />
            <span>Encrypted and kept on your local browser</span>
          </div>
        </div>
      ) : (
        /* Chronological Entries List */
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const config = MOOD_CONFIGS[entry.level];

            return (
              <div
                key={entry.id}
                className="p-4 sm:p-5 rounded-2xl bg-sanctuary-bg/70 border border-sanctuary-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:bg-sanctuary-bg"
              >
                {/* Left: Mood Pill & Date */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sanctuary-sm"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.score}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-sanctuary-text-primary">
                        {config.label}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                        style={{
                          backgroundColor: config.bgColor,
                          color: config.color,
                        }}
                      >
                        {config.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-sanctuary-text-muted mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.displayDate}</span>
                      {entry.updatedAt !== entry.createdAt && (
                        <span className="text-[10px] text-brand-purple font-medium italic">
                          (Edited)
                        </span>
                      )}
                    </div>

                    {/* Optional Note */}
                    {entry.note && (
                      <p className="text-xs text-sanctuary-text-primary mt-2 italic bg-white/80 p-2.5 rounded-xl border border-sanctuary-border/60 leading-relaxed">
                        &quot;{entry.note}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Delete Action */}
                {onDelete && (
                  <button
                    type="button"
                    aria-label={`Delete check-in for ${entry.displayDate}`}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete your check-in for ${entry.displayDate}?`
                        )
                      ) {
                        onDelete(entry.id);
                      }
                    }}
                    className="self-end sm:self-center p-2 rounded-xl text-sanctuary-text-muted hover:text-sanctuary-error hover:bg-sanctuary-error-bg transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
