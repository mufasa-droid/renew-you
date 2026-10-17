'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TopHeader, TopHeaderProps } from './TopHeader';
import { BottomNav, NavTabId } from './BottomNav';

export interface AppShellProps {
  children: React.ReactNode;
  headerProps?: TopHeaderProps;
  showHeader?: boolean;
  showNav?: boolean;
  activeTab?: NavTabId;
  onTabChange?: (tab: NavTabId) => void;
  className?: string;
  contentClassName?: string;
}

export function AppShell({
  children,
  headerProps,
  showHeader = true,
  showNav = true,
  activeTab = 'home',
  onTabChange,
  className = '',
  contentClassName = '',
}: AppShellProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F2EEFA]/60 selection:bg-brand-purple-light selection:text-brand-purple">
      {/* Mobile-first centered sanctuary shell */}
      <div
        className={cn(
          'w-full max-w-[440px] min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col sm:border-x sm:border-sanctuary-border sm:shadow-sanctuary-floating relative',
          className
        )}
      >
        {showHeader && <TopHeader {...headerProps} />}

        <main className={cn('flex-1 flex flex-col px-4 py-5 pb-6 overflow-y-auto no-scrollbar', contentClassName)}>
          {children}
        </main>

        {showNav && (
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        )}
      </div>
    </div>
  );
}
