import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'muted' | 'tinted-purple' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export function Card({
  children,
  variant = 'white',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variants = {
    white: 'bg-white border border-sanctuary-border shadow-sanctuary-sm',
    muted: 'bg-sanctuary-muted border border-sanctuary-border/60',
    'tinted-purple': 'bg-[#F3EFFC] border border-[#5E44B3]/15 shadow-sanctuary-sm',
    outline: 'bg-transparent border border-sanctuary-border',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:shadow-sanctuary-md hover:border-brand-purple/30 active:scale-[0.99]'
    : '';

  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], interactiveStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}
