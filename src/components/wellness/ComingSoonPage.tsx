import React from 'react';
import Link from 'next/link';
import { Logo, LotusMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  ArrowLeft,
  Sparkles,
  Home,
  CheckCircle2,
  Heart,
  Settings,
  LucideIcon,
  ShieldCheck,
} from 'lucide-react';

export interface PlannedFeature {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface ComingSoonPageProps {
  pageTitle: string;
  badge?: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  plannedFeatures?: PlannedFeature[];
  alternativeAction?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  mindfulQuote?: {
    quote: string;
    author: string;
  };
}

export function ComingSoonPage({
  pageTitle,
  badge = 'In Crafting • Coming Soon',
  tagline,
  description,
  icon: Icon,
  plannedFeatures = [],
  alternativeAction,
  mindfulQuote = {
    quote: 'Patience is not the ability to wait, but the ability to keep a peaceful attitude while waiting.',
    author: 'Mindful Sanctuary',
  },
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-sanctuary-bg flex flex-col justify-between text-sanctuary-text-primary">
      {/* Top Sanctuary Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF9FD]/90 backdrop-blur-md border-b border-sanctuary-border/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            aria-label="Renew You Home"
          >
            <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-xs"
              >
                Back to Sanctuary
              </Button>
            </Link>
            <Link
              href="/settings"
              title="Settings & Privacy"
              className="p-2 rounded-full text-sanctuary-text-secondary hover:text-brand-purple hover:bg-sanctuary-muted transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-sanctuary-border/80 shadow-sanctuary-md p-6 sm:p-12 text-center">
          {/* Ambient Background Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-purple-light/50 rounded-full blur-3xl opacity-70"
          />

          {/* Icon Badge */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-purple-light/70 border border-brand-purple/20 flex items-center justify-center shadow-sanctuary-sm text-brand-purple">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
              <LotusMark size={20} />
            </div>
          </div>

          {/* Badge Pill */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-brand-purple/20">
              <Sparkles className="w-3 h-3 text-brand-purple" />
              <span>{badge}</span>
            </span>
          </div>

          {/* Page Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-sanctuary-text-primary tracking-tight mb-3">
            {pageTitle}
          </h1>

          <p className="text-sm sm:text-base font-medium text-brand-purple mb-4">
            {tagline}
          </p>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed mb-8">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
              >
                Return to Sanctuary Home
              </Button>
            </Link>

            {alternativeAction ? (
              <Link href={alternativeAction.href} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={
                    alternativeAction.icon ? (
                      <alternativeAction.icon className="w-4 h-4" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )
                  }
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  {alternativeAction.label}
                </Button>
              </Link>
            ) : (
              <Link href="/questionnaire" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Heart className="w-4 h-4" />}
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  Take Mindful Check-In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Planned Features Preview */}
        {plannedFeatures.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <div className="text-center mb-6">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sanctuary-text-muted">
                What We Are Crafting For You
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plannedFeatures.map((feat, idx) => {
                const FeatIcon = feat.icon || CheckCircle2;
                return (
                  <Card key={idx} variant="white" padding="md" className="flex flex-col gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-purple-light/70 text-brand-purple flex items-center justify-center shrink-0">
                      <FeatIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-sanctuary-text-primary">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-sanctuary-text-secondary leading-relaxed">
                      {feat.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Mindful Quote & Reassurance */}
        <div className="mt-10 p-6 rounded-2xl bg-sanctuary-muted/60 border border-sanctuary-border/80 text-center max-w-2xl mx-auto">
          <p className="italic text-xs sm:text-sm text-sanctuary-text-secondary mb-2">
            &ldquo;{mindfulQuote.quote}&rdquo;
          </p>
          <span className="text-[11px] font-semibold text-brand-purple uppercase tracking-wider">
            — {mindfulQuote.author}
          </span>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full border-t border-sanctuary-border py-6 px-4 bg-white/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sanctuary-text-muted text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-mint shrink-0" />
            <span>Renew You is private, client-first, and non-judgmental.</span>
          </div>
          <p>© 2026 Renew You. All wellness data stays securely in your hands.</p>
        </div>
      </footer>
    </div>
  );
}
