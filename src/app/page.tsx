'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InteractiveSanctuary } from '@/components/wellness/InteractiveSanctuary';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LotusMark } from '@/components/brand/Logo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Compass,
  Feather,
  TrendingUp,
  Lock,
  Play,
  CheckCircle2,
  Wind,
  Smile,
} from 'lucide-react';

export default function RenewYouWebsite() {
  const pillars = [
    {
      icon: <Compass className="w-6 h-6 text-brand-purple" />,
      title: 'Explore Emotions',
      description:
        'Identify what you are feeling without judgment. Move beyond simple labels into nuanced emotional awareness using our radial emotion tiers.',
      badge: 'Emotion Wheel',
    },
    {
      icon: <Feather className="w-6 h-6 text-brand-purple" />,
      title: 'Guided Clarity',
      description:
        'Gentle, mindful prompts designed to help you unpack cluttered thoughts, understand underlying needs, and discover your calm next step.',
      badge: 'Mindful Journal',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-mint" />,
      title: 'Recognize Growth',
      description:
        'Acknowledge subtle shifts in your mental landscape over time. Celebrate moments of resilience, tranquility, and emotional balance.',
      badge: 'Personal Milestones',
    },
    {
      icon: <Lock className="w-6 h-6 text-brand-purple" />,
      title: 'Private Space',
      description:
        'Your reflections, moods, and thoughts are strictly confidential. Encrypted and stored locally on your device for total peace of mind.',
      badge: 'Guest-First & Secure',
    },
  ];

  const practices = [
    {
      title: 'Pause: Slow down & notice',
      category: 'Breathwork',
      duration: '3 mins',
      description: 'A 4-second box breathing exercise to soothe nervous system agitation and center attention.',
      active: true,
    },
    {
      title: 'Unpack the Present Moment',
      category: 'Guided Reflection',
      duration: '5 mins',
      description: 'Three gentle questions to separate what you can control from what you can gracefully let go.',
      active: false,
    },
    {
      title: 'Grounding in the Now',
      category: 'Sensory Reset',
      duration: '4 mins',
      description: 'Engage your five senses to anchor your consciousness when thoughts feel overwhelming.',
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col selection:bg-brand-purple-light selection:text-brand-purple">
      {/* 1. Header Navigation */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-brand-mint/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sanctuary-border shadow-sanctuary-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
              <span className="text-xs font-semibold text-sanctuary-text-primary tracking-wide">
                Pause. Reflect. Renew. — Digital Wellness Sanctuary
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-sanctuary-text-primary tracking-tight max-w-4xl leading-[1.12]">
              Understand what you feel.{' '}
              <span className="bg-gradient-to-r from-brand-purple via-[#7E67CA] to-brand-mint bg-clip-text text-transparent">
                Discover your next step.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-sanctuary-text-secondary max-w-2xl mt-6 leading-relaxed">
              Renew You is a tranquil, non-judgmental digital sanctuary designed to help you explore your emotions, find clarity, and move forward with peace.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
              <a href="#sanctuary" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Enter Guest Sanctuary
                </Button>
              </a>

              <a href="#practices" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  leftIcon={<Wind className="w-5 h-5 text-brand-purple" />}
                >
                  Try Mindful Pause
                </Button>
              </a>
            </div>

            {/* Trust / Value Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 pt-8 border-t border-sanctuary-border/80 text-xs sm:text-sm text-sanctuary-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-mint" />
                <span>100% Guest-Accessible</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-purple" />
                <span>Zero Tracking or Data Selling</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-mint" />
                <span>Gentle, Non-Judgmental Tone</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The 4 Pillars Section */}
        <section id="pillars" className="py-20 bg-white border-y border-sanctuary-border scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
              <Badge variant="purple" size="md" className="mb-3">
                Core Philosophy
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-sanctuary-text-primary tracking-tight">
                Designed for Emotional Clarity and Peace
              </h2>
              <p className="text-sm sm:text-base text-sanctuary-text-secondary mt-3 leading-relaxed">
                Every tool in Renew You is crafted around four foundational pillars to help you ground your thoughts and cultivate lasting well-being.
              </p>
            </div>

            {/* 4 Pillar Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar) => (
                <Card
                  key={pillar.title}
                  variant="white"
                  className="flex flex-col justify-between p-6 sm:p-7 hover:shadow-sanctuary-md hover:-translate-y-1 transition-all duration-300 border border-sanctuary-border group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple-light flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                      {pillar.icon}
                    </div>
                    <Badge variant="muted" size="sm" className="mb-3">
                      {pillar.badge}
                    </Badge>
                    <h3 className="text-lg font-bold text-sanctuary-text-primary tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Live Interactive Sanctuary App Section */}
        <InteractiveSanctuary />

        {/* 5. Mindful Practices Section */}
        <section id="practices" className="py-20 bg-white border-y border-sanctuary-border scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="mint" size="md" className="mb-2">
                  Guided Exercises
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-sanctuary-text-primary tracking-tight">
                  Mindful Practices for Daily Renewal
                </h2>
                <p className="text-sm sm:text-base text-sanctuary-text-secondary mt-2">
                  Bite-sized mindful exercises you can practice whenever you need a grounded breath.
                </p>
              </div>

              <a href="#sanctuary">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Full Library
                </Button>
              </a>
            </div>

            {/* Practice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {practices.map((practice) => (
                <Card
                  key={practice.title}
                  variant="white"
                  className="p-6 sm:p-7 flex flex-col justify-between hover:border-brand-purple/40 hover:shadow-sanctuary-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-semibold text-brand-purple uppercase tracking-wider text-[11px]">
                        {practice.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-sanctuary-muted text-sanctuary-text-secondary font-medium text-[11px]">
                        {practice.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-sanctuary-text-primary">
                      {practice.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-sanctuary-text-secondary mt-2 leading-relaxed">
                      {practice.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-sanctuary-border flex items-center justify-between">
                    <span className="text-xs text-sanctuary-text-muted flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
                      Free Guest Practice
                    </span>
                    <a href="#sanctuary">
                      <Button
                        variant={practice.active ? 'primary' : 'secondary'}
                        size="sm"
                        leftIcon={<Play className="w-3 h-3 fill-current" />}
                      >
                        Begin
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Privacy & Ethics Sanctuary Banner */}
        <section id="privacy" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-[#F3EFFC] via-white to-[#E8F7F2] border border-sanctuary-border p-8 sm:p-14 shadow-sanctuary-floating flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col items-start gap-4 max-w-xl">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sanctuary-sm flex items-center justify-center text-brand-purple">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-sanctuary-text-primary tracking-tight">
                Safe Sanctuary: End-to-End Privacy, No Account Required.
              </h2>
              <p className="text-sm sm:text-base text-sanctuary-text-secondary leading-relaxed">
                Your vulnerability deserves sacred privacy. Renew You is intentionally architected to operate fully as a guest on your local device. We do not store, profile, or sell your thoughts.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-sanctuary-text-primary font-semibold mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                  <span>No mandatory logins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                  <span>Client-side storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                  <span>No invasive tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                  <span>Instant guest access</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-sanctuary-border shadow-sanctuary-sm w-full lg:w-80 shrink-0">
              <LotusMark size={60} />
              <span className="font-bold text-sanctuary-text-primary text-lg mt-3">
                Renew You
              </span>
              <span className="text-xs text-sanctuary-text-secondary mt-0.5">
                Pause. Reflect. Renew.
              </span>
              <a href="#sanctuary" className="w-full mt-6">
                <Button variant="primary" fullWidth size="md">
                  Enter Sanctuary Now
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* 7. Reflection Quotes / Community Presence */}
        <section className="py-16 bg-white/70 border-t border-sanctuary-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
            <Smile className="w-8 h-8 text-brand-purple mb-4" />
            <blockquote className="text-lg sm:text-xl font-medium text-sanctuary-text-primary italic leading-relaxed">
              &quot;By naming what we are experiencing without judgment, we create the gentle pause needed to respond rather than react.&quot;
            </blockquote>
            <span className="text-xs font-semibold uppercase tracking-wider text-sanctuary-text-secondary mt-4">
              Renew You Mindful Principle
            </span>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
