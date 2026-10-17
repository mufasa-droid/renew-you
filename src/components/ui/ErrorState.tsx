import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something interrupted your peace',
  message,
  onRetry,
  retryText = 'Try again',
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'w-full p-5 rounded-2xl bg-sanctuary-error-bg/60 border border-sanctuary-error-border flex flex-col items-center text-center',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-sanctuary-error/10 text-sanctuary-error flex items-center justify-center shrink-0 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>

      <h4 className="text-sm font-semibold text-sanctuary-text-primary">
        {title}
      </h4>

      <p className="text-xs text-sanctuary-text-secondary mt-1 max-w-xs leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
}
