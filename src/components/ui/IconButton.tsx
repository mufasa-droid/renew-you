import React from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'ghost' | 'surface' | 'primary' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
}

export function IconButton({
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2';

  const variants = {
    ghost:
      'text-sanctuary-text-secondary hover:text-brand-purple hover:bg-brand-purple-light/60',
    surface:
      'bg-white text-sanctuary-text-primary border border-sanctuary-border shadow-sanctuary-sm hover:bg-sanctuary-muted hover:border-brand-purple-subtle/40',
    primary:
      'bg-brand-purple text-white shadow-sanctuary-sm hover:bg-brand-purple-hover',
    subtle:
      'bg-brand-purple-light text-brand-purple hover:bg-[#E2DBF5]',
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <button
      aria-label={ariaLabel}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
}
