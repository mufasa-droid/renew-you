'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, User } from 'lucide-react';
import { Logo, LotusMark } from '@/components/brand/Logo';
import { IconButton } from '@/components/ui/IconButton';

export interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
  className?: string;
}

export function TopHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  showLogo = true,
  className = '',
}: TopHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full h-16 px-4 bg-sanctuary-bg/90 backdrop-blur-md border-b border-sanctuary-border/60 flex items-center justify-between',
        className
      )}
    >
      {/* Left Slot: Back button or Lotus Mark */}
      <div className="w-10 flex items-center justify-start">
        {showBack ? (
          <IconButton
            aria-label="Go back"
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={onBack || (() => window.history.back())}
          />
        ) : showLogo && !title ? (
          <LotusMark size={28} />
        ) : null}
      </div>

      {/* Center Slot: Brand Logo or Page Title */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        {title ? (
          <div>
            <h1 className="text-sm sm:text-base font-bold text-sanctuary-text-primary tracking-tight truncate max-w-[220px]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-sanctuary-text-secondary truncate max-w-[220px]">
                {subtitle}
              </p>
            )}
          </div>
        ) : showLogo ? (
          <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />
        ) : null}
      </div>

      {/* Right Slot: Profile avatar or custom action */}
      <div className="w-10 flex items-center justify-end">
        {rightAction ? (
          rightAction
        ) : (
          <button
            type="button"
            aria-label="User profile"
            className="w-8 h-8 rounded-full bg-brand-purple-light border border-brand-purple/20 flex items-center justify-center text-brand-purple hover:bg-[#E2DBF5] transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
