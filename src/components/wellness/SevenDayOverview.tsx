'use client';

import React from 'react';
import { SevenDayOverviewDay } from '@/types/mood';
import { MOOD_CONFIGS } from '@/lib/moodConstants';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface SevenDayOverviewProps {
  days: SevenDayOverviewDay[];
  className?: string;
}

export function SevenDayOverview({ days, className = '' }: SevenDayOverviewProps) {
  const loggedDaysCount = days.filter((d) => Boolean(d.entry)).length;

  return (
    <Card variant="white" className={`p-6 sm:p-7 flex flex-col gap-4 border border-sanctuary-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sanctuary-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-purple-light text-brand-purple flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-sanctuary-text-primary">
              7-Day Emotional Journey
            </h3>
            <p className="text-[11px] text-sanctuary-text-secondary">
              A gentle view of your recent emotional landscape
            </p>
          </div>
        </div>

        <Badge variant={loggedDaysCount >= 4 ? 'mint' : 'muted'} size="sm">
          {loggedDaysCount} / 7 Days Checked In
        </Badge>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 py-2">
        {days.map((day) => {
          const entry = day.entry;
          const config = entry ? MOOD_CONFIGS[entry.level] : null;

          return (
            <div
              key={day.dateKey}
              className={`flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl border transition-all text-center ${
                day.isToday
                  ? 'bg-sanctuary-muted/60 border-brand-purple/40 ring-2 ring-brand-purple/10'
                  : 'bg-white border-sanctuary-border'
              }`}
            >
              {/* Day Header */}
              <span
                className={`text-[10px] uppercase font-bold tracking-wider ${
                  day.isToday ? 'text-brand-purple' : 'text-sanctuary-text-muted'
                }`}
              >
                {day.dayName}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold my-1 ${
                  day.isToday ? 'text-sanctuary-text-primary font-bold' : 'text-sanctuary-text-secondary'
                }`}
              >
                {day.dayNumber}
              </span>

              {/* Status Indicator */}
              {config ? (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sanctuary-sm mt-1"
                  style={{ backgroundColor: config.color }}
                  title={`${config.label} on ${day.dateKey}`}
                >
                  {config.score}
                </div>
              ) : (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-sanctuary-border flex items-center justify-center text-sanctuary-text-muted text-[10px] mt-1"
                  title={`No check-in on ${day.dateKey}`}
                >
                  &mdash;
                </div>
              )}

              {/* Today Pill */}
              {day.isToday && (
                <span className="text-[9px] font-bold text-brand-purple mt-1.5 uppercase tracking-tight">
                  Today
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer / Affirmation */}
      <div className="flex items-center justify-between text-xs text-sanctuary-text-muted pt-2 border-t border-sanctuary-border/80">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-mint" />
          <span>Non-judgmental awareness is the goal, not perfect scores.</span>
        </span>
        <span className="hidden sm:inline text-[11px] text-sanctuary-text-secondary">
          Scores: 1 (Very low) &rarr; 5 (Excellent)
        </span>
      </div>
    </Card>
  );
}
