import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center' | 'between';
  className?: string;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function SectionHeader({
  title,
  subtitle,
  action,
  align = 'between',
  className = '',
  titleAs: TitleTag = 'h2',
}: SectionHeaderProps) {
  const isCentered = align === 'center';
  const isBetween = align === 'between' && action;

  return (
    <div
      className={cn(
        'w-full flex',
        isCentered
          ? 'flex-col items-center text-center'
          : isBetween
          ? 'items-center justify-between'
          : 'flex-col items-start text-left',
        className
      )}
    >
      <div className={cn('flex flex-col', isCentered && 'items-center')}>
        <TitleTag className="text-base sm:text-lg font-bold text-sanctuary-text-primary tracking-tight">
          {title}
        </TitleTag>
        {subtitle && (
          <p className="text-xs text-sanctuary-text-secondary mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && !isCentered && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}
