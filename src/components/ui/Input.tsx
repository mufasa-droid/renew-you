'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightLabel?: React.ReactNode;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      rightLabel,
      type = 'text',
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {(label || rightLabel) && (
          <div className="flex items-center justify-between text-xs font-semibold text-sanctuary-text-primary px-0.5">
            {label && (
              <label htmlFor={inputId} className="cursor-pointer">
                {label}
              </label>
            )}
            {rightLabel && (
              <span className="text-[11px] font-normal text-sanctuary-text-secondary">
                {rightLabel}
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            'relative flex items-center w-full rounded-xl bg-white border border-sanctuary-border transition-all duration-200',
            'focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/20',
            error && 'border-sanctuary-error focus-within:border-sanctuary-error focus-within:ring-sanctuary-error/20',
            disabled && 'bg-sanctuary-muted/50 cursor-not-allowed opacity-60'
          )}
        >
          {leftIcon && (
            <div className="pl-3.5 pr-1 text-sanctuary-text-muted flex items-center justify-center shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={effectiveType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'w-full bg-transparent px-3.5 py-3 text-sm text-sanctuary-text-primary placeholder:text-sanctuary-text-muted outline-none disabled:cursor-not-allowed',
              leftIcon && 'pl-2',
              (rightIcon || isPassword) && 'pr-2',
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3.5 pl-2 text-sanctuary-text-muted hover:text-sanctuary-text-primary transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && (
              <div className="pr-3.5 pl-1 text-sanctuary-text-muted flex items-center justify-center shrink-0">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-sanctuary-error px-0.5" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-sanctuary-text-muted px-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
