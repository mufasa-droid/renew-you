import React from 'react';
import { cn } from '@/lib/utils';
import { LotusMark } from '@/components/brand/Logo';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-white border border-sanctuary-border shadow-sanctuary-sm',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-brand-purple-light flex items-center justify-center text-brand-purple mb-4">
        {icon ? icon : <LotusMark size={32} />}
      </div>

      <h3 className="text-base font-semibold text-sanctuary-text-primary tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-sanctuary-text-secondary mt-1.5 max-w-xs leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
