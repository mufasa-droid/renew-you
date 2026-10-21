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
  const handleKeyDown = (e: React.KeyboardEvent, currentLevel: MoodLevel) => {
    const currentIndex = MOOD_LEVELS_ORDERED.indexOf(currentLevel);
    if (currentIndex === -1) return;

    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % MOOD_LEVELS_ORDERED.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + MOOD_LEVELS_ORDERED.length) % MOOD_LEVELS_ORDERED.length;
    }

    if (nextIndex !== -1) {
      const nextLevel = MOOD_LEVELS_ORDERED[nextIndex];
      onSelect(nextLevel);
      const nextBtn = document.getElementById(`mood-radio-${nextLevel}`);
      nextBtn?.focus();
    }
  };

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
            id={`mood-radio-${level}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (!selectedLevel && level === 'okay') ? 0 : -1}
            aria-label={`${config.label}: ${config.description}`}
            disabled={disabled}
            onClick={() => onSelect(level)}
            onKeyDown={(e) => handleKeyDown(e, level)}
            className={cn(
              'group relative flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-center min-h-[120px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2',
              level === 'excellent' && 'col-span-2 sm:col-span-1',
              isSelected
                ? 'bg-white border-2 shadow-sanctuary-md scale-105 z-10'
                : 'bg-white/90 border-sanctuary-border hover:bg-sanctuary-muted/80 hover:border-brand-purple/30 hover:scale-[1.02]',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
            style={{
              borderColor: isSelected ? config.color : undefined,
              boxShadow: isSelected ? `0 0 0 2px ${config.color}25, 0 4px 16px -2px rgba(94, 68, 179, 0.12)` : undefined,
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

            {/* Icon Bubble (24px icon in 48px chip) */}
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-105 shrink-0',
                isSelected ? 'shadow-sanctuary-sm' : ''
              )}
              style={{
                backgroundColor: isSelected ? config.color : config.bgColor,
                color: isSelected ? '#FFFFFF' : config.color,
              }}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Label & Sublabel Container */}
            <div className="flex flex-col items-center w-full justify-start mt-auto">
              <span
                className={cn(
                  'text-xs sm:text-sm font-bold tracking-normal leading-tight',
                  isSelected ? 'text-sanctuary-text-primary' : 'text-sanctuary-text-secondary'
                )}
              >
                {config.label}
              </span>

              {/* Full Sublabel - no truncation, wrapped and centered */}
              <span className="text-xs text-sanctuary-text-muted mt-1 leading-snug text-center w-full px-0.5 font-normal">
                {config.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
