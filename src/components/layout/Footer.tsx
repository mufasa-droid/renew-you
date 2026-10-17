import React from 'react';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-sanctuary-border pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-sanctuary-border/80">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <Logo size="md" showText={true} showTagline={true} orientation="horizontal" />
            <p className="text-sm text-sanctuary-text-secondary max-w-sm leading-relaxed mt-1">
              Renew You is a serene, non-judgmental digital sanctuary designed to help you explore your emotions, find clarity, and recognize your personal growth with ease.
            </p>
            <div className="flex items-center gap-2 text-xs text-sanctuary-text-muted mt-2">
              <ShieldCheck className="w-4 h-4 text-brand-mint shrink-0" />
              <span>Zero-tracking, local-first sanctuary on your device.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-sanctuary-text-primary uppercase tracking-wider">
              Sanctuary
            </h4>
            <a href="#sanctuary" className="text-sm text-sanctuary-text-secondary hover:text-brand-purple transition-colors">
              Daily Mood Wheel
            </a>
            <a href="#sanctuary" className="text-sm text-sanctuary-text-secondary hover:text-brand-purple transition-colors">
              Guided Reflection
            </a>
            <a href="#practices" className="text-sm text-sanctuary-text-secondary hover:text-brand-purple transition-colors">
              Mindful Pause (Breathing)
            </a>
            <a href="#pillars" className="text-sm text-sanctuary-text-secondary hover:text-brand-purple transition-colors">
              4 Core Pillars
            </a>
          </div>

          {/* Principles */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-sanctuary-text-primary uppercase tracking-wider">
              Philosophy
            </h4>
            <span className="text-sm text-sanctuary-text-secondary">
              Non-judgmental awareness
            </span>
            <span className="text-sm text-sanctuary-text-secondary">
              Private by design
            </span>
            <span className="text-sm text-sanctuary-text-secondary">
              Accessible to all guests
            </span>
            <div className="flex items-center gap-1.5 text-xs text-brand-purple font-medium mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pause. Reflect. Renew.</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sanctuary-text-muted">
          <p>&copy; 2026 Renew You. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for peace of mind</span>
            <Heart className="w-3.5 h-3.5 text-brand-purple fill-brand-purple/20 inline mx-1" />
            <span>and thoughtful reflection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
