'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FBF9FD]/90 backdrop-blur-md border-b border-sanctuary-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo size="md" showText={true} showTagline={true} orientation="horizontal" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#sanctuary"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            Live Sanctuary
          </a>
          <a
            href="#pillars"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            The 4 Pillars
          </a>
          <a
            href="#practices"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            Mindful Practices
          </a>
          <Link
            href="/settings"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            Settings &amp; Privacy
          </Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#sanctuary">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-brand-purple" />}
            >
              Guest Access
            </Button>
          </a>
          <a href="#sanctuary">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Reflection
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-sanctuary-text-primary hover:bg-sanctuary-muted transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-sanctuary-border px-6 pt-4 pb-6 flex flex-col gap-4 shadow-sanctuary-md animate-in slide-in-from-top duration-200">
          <a
            href="#sanctuary"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            Live Sanctuary
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            The 4 Pillars
          </a>
          <a
            href="#practices"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            Mindful Practices
          </a>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            Settings &amp; Privacy
          </Link>

          <div className="flex flex-col gap-2.5 pt-2">
            <a href="#sanctuary" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Reflection
              </Button>
            </a>
            <div className="flex items-center justify-center gap-1.5 text-xs text-sanctuary-text-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>100% Guest-First & Private</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
