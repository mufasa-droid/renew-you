'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MoodLevel } from '@/types/mood';
import { MOOD_CONFIGS, MOOD_LEVELS_ORDERED } from '@/lib/moodConstants';
import { CloudRain, Cloud, SunDim, Sun, Sparkles, Check } from 'lucide-react';

interface MoodOptionProps {
  selectedLevel?: MoodLevel;
  onSelect: (level: MoodLevel) => void;
  disabled?: boolean;
  className?: string;
}

const MOOD_ICONS: Record<MoodLevel, React.ComponentType<{ className?: string }>> = {
  'very-low': CloudRain,
  'low': Cloud,
  'okay': SunDim,
  'good': Sun,
  'excellent': Sparkles,
};

export function MoodOptionCard({
  selectedLevel,
  onSelect,
  disabled = false,
  className = '',
}: MoodOptionProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select today's mood"
      className={cn('grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 w-full', className)}
    >
      {MOOD_LEVELS_ORDERED.map((level) => {
        const config = MOOD_CONFIGS[level];
        const Icon = MOOD_ICONS[level];
        const isSelected = selectedLevel === level;

        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${config.label}: ${config.description}`}
            disabled={disabled}
            onClick={() => onSelect(level)}
            className={cn(
              'group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-center',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2',
              level === 'excellent' && 'col-span-2 sm:col-span-1',
              isSelected
                ? 'bg-white border-2 shadow-sanctuary-md scale-[1.02]'
                : 'bg-white/80 border-sanctuary-border hover:bg-sanctuary-muted/80 hover:border-brand-purple/30',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
            style={{
              borderColor: isSelected ? config.color : undefined,
            }}
          >
            {/* Top Selected Indicator Pill */}
            {isSelected && (
              <span
                className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: config.color }}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}

            {/* Icon Bubble */}
            <div
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-105',
                isSelected ? 'shadow-sanctuary-sm' : ''
              )}
              style={{
                backgroundColor: config.bgColor,
                color: config.color,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-xs sm:text-sm font-bold tracking-tight',
                isSelected ? 'text-sanctuary-text-primary' : 'text-sanctuary-text-secondary'
              )}
            >
              {config.label}
            </span>

            {/* Description Subtext */}
            <span className="text-[10px] text-sanctuary-text-muted mt-0.5 line-clamp-1">
              {config.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
