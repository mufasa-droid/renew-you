'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Home, Smile, BookOpen, Sparkles, User } from 'lucide-react';

export type NavTabId = 'home' | 'mood' | 'reflect' | 'practice' | 'profile';

export interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/home' },
  { id: 'mood', label: 'Mood', icon: Smile, href: '/mood' },
  { id: 'reflect', label: 'Reflect', icon: BookOpen, href: '/reflect' },
  { id: 'practice', label: 'Practice', icon: Sparkles, href: '/practice' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

export interface BottomNavProps {
  activeTab?: NavTabId;
  onTabChange?: (tab: NavTabId) => void;
  className?: string;
}

export function BottomNav({
  activeTab = 'home',
  onTabChange,
  className = '',
}: BottomNavProps) {
  return (
    <nav
      aria-label="Bottom Navigation"
      className={cn(
        'sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-sanctuary-border px-2 py-1 shadow-sanctuary-floating',
        className
      )}
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.label}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-xl',
                isActive
                  ? 'text-brand-purple'
                  : 'text-sanctuary-text-muted hover:text-sanctuary-text-secondary'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive && 'scale-110 stroke-[2.25]'
                  )}
                />
              </div>

              <span
                className={cn(
                  'text-[10px] mt-1 tracking-tight transition-all duration-200',
                  isActive ? 'font-semibold text-brand-purple' : 'font-medium text-sanctuary-text-muted'
                )}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
