'use client';

import React from 'react';
import { SevenDayOverviewDay } from '@/types/mood';
import { MOOD_CONFIGS } from '@/lib/moodConstants';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, CheckCircle2, Sparkles, CloudRain, Cloud, SunDim, Sun } from 'lucide-react';

interface SevenDayOverviewProps {
  days: SevenDayOverviewDay[];
  className?: string;
}

const DAY_MOOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'very-low': CloudRain,
  'low': Cloud,
  'okay': SunDim,
  'good': Sun,
  'excellent': Sparkles,
};

export function SevenDayOverview({ days, className = '' }: SevenDayOverviewProps) {
  const loggedDaysCount = days.filter((d) => Boolean(d.entry)).length;

  return (
    <Card variant="white" className={`p-4 sm:p-7 flex flex-col gap-4 border border-sanctuary-border ${className}`}>
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
            <p className="text-xs text-sanctuary-text-secondary">
              A gentle view of your recent emotional landscape
            </p>
          </div>
        </div>

        <Badge variant={loggedDaysCount >= 4 ? 'mint' : 'muted'} size="sm">
          {loggedDaysCount} / 7 Days Checked In
        </Badge>
      </div>

      {/* Warm prompt when fewer than 2 days are logged */}
      {loggedDaysCount < 2 && (
        <div className="p-3 rounded-xl bg-brand-purple-light/50 border border-brand-purple/20 text-xs text-brand-purple font-medium flex items-center justify-between">
          <span>🌱 Your journey starts today — check in each day to see your rhythm unfold.</span>
          <span className="text-[11px] font-semibold text-sanctuary-text-secondary">
            {loggedDaysCount}/7 logged
          </span>
        </div>
      )}

      {/* 7 Days Grid */}
      <div
        role="list"
        aria-label="7-Day mood journey"
        className="grid grid-cols-7 gap-1 sm:gap-3 py-2 overflow-x-auto no-scrollbar"
        suppressHydrationWarning
      >
        {days.map((day) => {
          const entry = day.entry;
          const config = entry ? MOOD_CONFIGS[entry.level] : null;
          const MoodIcon = entry ? DAY_MOOD_ICONS[entry.level] : null;

          const cellAriaLabel = day.isToday
            ? `Today: ${config ? `${config.label} (${config.score} of 5)` : 'No entry yet'}`
            : `${day.dayName}, ${day.dateKey}: ${config ? `${config.label} (${config.score} of 5)` : 'No check-in'}`;

          return (
            <button
              key={day.dateKey}
              type="button"
              role="listitem"
              aria-label={cellAriaLabel}
              title={cellAriaLabel}
              className={`flex flex-col items-center justify-between p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-center outline-none focus-visible:ring-2 focus-visible:ring-brand-purple cursor-pointer ${
                day.isToday
                  ? 'bg-sanctuary-muted/80 border-brand-purple ring-2 ring-brand-purple/20 shadow-xs'
                  : entry
                  ? 'bg-white border-sanctuary-border hover:border-brand-purple/40 hover:shadow-xs'
                  : 'bg-sanctuary-bg/50 border-sanctuary-border/80'
              }`}
            >
              {/* Day Header */}
              <span
                className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider ${
                  day.isToday ? 'text-brand-purple' : 'text-sanctuary-text-secondary'
                }`}
              >
                {day.dayName}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold my-1 ${
                  day.isToday ? 'text-sanctuary-text-primary font-extrabold' : 'text-sanctuary-text-secondary'
                }`}
              >
                {day.dayNumber}
              </span>

              {/* Status Indicator */}
              {config && MoodIcon ? (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sanctuary-sm mt-1"
                  style={{ backgroundColor: config.color }}
                >
                  <MoodIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.25]" />
                </div>
              ) : (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dotted border-sanctuary-border flex items-center justify-center text-sanctuary-text-muted mt-1"
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
              )}

              {/* Today Pill */}
              {day.isToday && (
                <span className="text-[10px] font-bold text-brand-purple mt-1.5 uppercase tracking-normal">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Affirmation */}
      <div className="flex items-center justify-between text-xs text-sanctuary-text-secondary pt-2 border-t border-sanctuary-border/80">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-mint" />
          <span>Non-judgmental awareness is the goal, not perfect scores.</span>
        </span>
        <span className="hidden sm:inline text-xs font-medium text-sanctuary-text-secondary">
          Scores: 1 (Very low) &rarr; 5 (Excellent)
        </span>
      </div>
    </Card>
  );
}
