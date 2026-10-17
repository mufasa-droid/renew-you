import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'mint' | 'muted';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'purple',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    purple: 'bg-brand-purple-light text-brand-purple',
    mint: 'bg-brand-mint-light text-brand-mint font-semibold',
    muted: 'bg-sanctuary-muted text-sanctuary-text-secondary border border-sanctuary-border',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
