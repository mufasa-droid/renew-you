'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Menu, X, ArrowRight, User as UserIcon, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isLoading, signOut } = useAuth();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Friend';

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FBF9FD]/90 backdrop-blur-md border-b border-sanctuary-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/#sanctuary"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors whitespace-nowrap"
          >
            Live Sanctuary
          </Link>
          <Link
            href="/#practices"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors whitespace-nowrap"
          >
            Mindful Practices
          </Link>
          <Link
            href="/questionnaire"
            className="text-sm font-medium text-sanctuary-text-secondary hover:text-brand-purple transition-colors whitespace-nowrap"
          >
            Mindful Check-In
          </Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading ? (
            <div className="w-24 h-8 bg-sanctuary-muted/50 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100/80 text-purple-900 text-xs font-semibold whitespace-nowrap">
                <UserIcon className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{displayName}</span>
              </div>
              <Link
                href="/settings"
                title="Settings & Privacy"
                className="p-2 rounded-full text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors"
                aria-label="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-xs whitespace-nowrap"
                >
                  Get Started
                </Button>
              </Link>
              <Link
                href="/settings"
                title="Settings & Privacy"
                className="p-2 rounded-full text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors"
                aria-label="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
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
          {user && (
            <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-brand-purple/10 text-brand-purple text-xs font-semibold">
              <UserIcon className="w-4 h-4" />
              <span>Signed in as {displayName}</span>
            </div>
          )}
          <a
            href="#sanctuary"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            Live Sanctuary
          </a>
          <Link
            href="/questionnaire"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            Mindful Check-In
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-sanctuary-text-primary py-2 hover:text-brand-purple border-b border-sanctuary-border/40"
          >
            Settings &amp; Privacy
          </Link>

          <div className="flex flex-col gap-2.5 pt-2">
            {user ? (
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

