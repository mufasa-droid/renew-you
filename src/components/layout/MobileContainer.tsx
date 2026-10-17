import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3EFFC]/40">
      <div
        className={cn(
          'w-full max-w-[440px] min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col shadow-sanctuary-floating sm:border-x sm:border-sanctuary-border relative',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
