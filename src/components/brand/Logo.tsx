import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function LotusMark({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Renew You Lotus Mark"
    >
      <defs>
        <linearGradient id="renewPurpleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A3298" />
          <stop offset="60%" stopColor="#5E44B3" />
          <stop offset="100%" stopColor="#876ED8" />
        </linearGradient>
        <linearGradient id="renewMintGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2E9E77" />
          <stop offset="60%" stopColor="#38B289" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
        <linearGradient id="renewDualGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5E44B3" />
          <stop offset="70%" stopColor="#38B289" />
        </linearGradient>
      </defs>

      {/* Outer Left Petal */}
      <path
        d="M20 72C18 52 36 34 50 30C46 44 48 64 20 72Z"
        fill="url(#renewPurpleGrad)"
        opacity="0.85"
      />
      {/* Mid Left Petal */}
      <path
        d="M32 78C30 56 52 32 64 22C62 42 62 66 32 78Z"
        stroke="url(#renewPurpleGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Water / Spine stream curving to droplet */}
      <path
        d="M48 88C52 82 56 78 68 76C82 74 88 64 86 52C84 42 74 38 68 44C62 50 64 64 78 64"
        stroke="url(#renewMintGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top Floating Droplet Petal */}
      <path
        d="M94 38C94 30 84 18 84 18C84 18 74 30 74 38C74 44 78.5 48 84 48C89.5 48 94 44 94 38Z"
        fill="none"
        stroke="url(#renewPurpleGrad)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Outer Right Petal */}
      <path
        d="M84 76C98 72 108 58 104 44C90 48 78 62 84 76Z"
        fill="url(#renewMintGrad)"
        opacity="0.8"
      />
      {/* Bottom Base Arc */}
      <path
        d="M22 82C34 92 52 96 68 96C86 96 100 88 106 80"
        stroke="url(#renewPurpleGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Inner Mint Base Ripple */}
      <path
        d="M36 85C48 91 60 92 74 91C84 90 92 86 98 81"
        stroke="url(#renewMintGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className = '',
  size = 'md',
  showText = true,
  showTagline = true,
  orientation = 'vertical',
}: LogoProps) {
  const pixelSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  };

  const currentSize = pixelSizes[size];

  return (
    <div
      className={`inline-flex items-center ${
        orientation === 'vertical' ? 'flex-col text-center' : 'flex-row gap-3 text-left'
      } ${className}`}
    >
      <LotusMark size={currentSize} />
      {showText && (
        <div className={orientation === 'vertical' ? 'mt-2.5' : ''}>
          <span className="block font-sans font-bold tracking-[0.16em] text-sanctuary-text-primary text-lg sm:text-xl leading-tight">
            RENEW YOU
          </span>
          {showTagline && (
            <span className="block font-sans text-xs font-medium tracking-[0.08em] text-sanctuary-text-secondary mt-0.5">
              Pause. Reflect. Renew.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
