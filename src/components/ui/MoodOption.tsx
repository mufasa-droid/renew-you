'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { EmotionCategory } from '@/types/wellness';

export interface MoodChipProps {
  label: string;
  category?: EmotionCategory;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function MoodChip({
  label,
  category = 'neutral',
  selected = false,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
}: MoodChipProps) {
  const categoryIndicatorColors = {
    pleasant: 'bg-brand-mint',
    neutral: 'bg-brand-purple-subtle',
    heavy: 'bg-brand-purple',
  };

  const selectedCategoryStyles = {
    pleasant:
      'bg-brand-mint text-white border-brand-mint shadow-sanctuary-sm',
    neutral:
      'bg-brand-purple-subtle text-white border-brand-purple-subtle shadow-sanctuary-sm',
    heavy:
      'bg-brand-purple text-white border-brand-purple shadow-sanctuary-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
  };

  return (
    <button
      type="button"
      role="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-200 cursor-pointer select-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2',
        sizes[size],
        selected
          ? selectedCategoryStyles[category]
          : 'bg-white text-sanctuary-text-primary border-sanctuary-border hover:bg-sanctuary-muted hover:border-brand-purple-subtle/30',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full shrink-0 transition-colors',
          selected ? 'bg-white' : categoryIndicatorColors[category]
        )}
      />
      <span>{label}</span>
      {selected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />}
    </button>
  );
}

export interface MoodCategorySelectorProps {
  selectedCategory: EmotionCategory;
  onSelectCategory: (category: EmotionCategory) => void;
  className?: string;
}

export function MoodCategorySelector({
  selectedCategory,
  onSelectCategory,
  className = '',
}: MoodCategorySelectorProps) {
  const categories: { id: EmotionCategory; label: string }[] = [
    { id: 'pleasant', label: 'Pleasant' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'heavy', label: 'Heavy' },
  ];

  return (
    <div
      role="tablist"
      aria-label="Emotion category tiers"
      className={cn(
        'flex items-center p-1 rounded-full bg-sanctuary-muted border border-sanctuary-border w-full max-w-sm mx-auto',
        className
      )}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all duration-200 text-center cursor-pointer select-none',
              isSelected
                ? 'bg-white text-brand-purple shadow-sanctuary-sm'
                : 'text-sanctuary-text-secondary hover:text-sanctuary-text-primary'
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
