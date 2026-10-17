'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Button,
  IconButton,
  Input,
  Card,
  Badge,
  SectionHeader,
  MoodChip,
  MoodCategorySelector,
  EmptyState,
  SkeletonCard,
  ErrorState,
} from '@/components/ui';
import { EmotionCategory } from '@/types/wellness';
import {
  ArrowRight,
  Mail,
  Lock,
  Sparkles,
  Heart,
  Bell,
  Search,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

export default function DesignSystemAuditPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'mood' | 'reflect' | 'practice' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory>('pleasant');
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['Calm', 'Grateful']);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [errorDemo, setErrorDemo] = useState<string | null>(null);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{
        title: activeTab === 'home' ? undefined : `Renew You — ${activeTab.toUpperCase()}`,
        subtitle: activeTab === 'home' ? undefined : 'Design System Audit',
        showLogo: activeTab === 'home',
        rightAction: (
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            size="sm"
            icon={<Bell className="w-4 h-4 text-sanctuary-text-secondary" />}
            onClick={() => alert('Notification drawer trigger')}
          />
        ),
      }}
      contentClassName="gap-6"
    >
      {/* Overview Banner */}
      <section>
        <Card variant="tinted-purple" className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Badge variant="mint" size="sm" className="w-fit mb-2">
                Phase 3 Verified
              </Badge>
              <h2 className="text-lg font-bold text-sanctuary-text-primary tracking-tight">
                Renew You Design System
              </h2>
              <p className="text-xs text-sanctuary-text-secondary mt-1 leading-relaxed">
                Shared visual foundation extracted from the Figma audit: tokens, buttons, inputs, cards, mood selectors, and navigation.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-purple shrink-0 shadow-sanctuary-sm">
              <Sparkles className="w-5 h-5 text-brand-purple" />
            </div>
          </div>
        </Card>
      </section>

      {/* 1. Buttons & Icon Buttons */}
      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Buttons & Icon Controls"
          subtitle="Pill-shaped, accessible focus states, and loading indicators"
        />

        <div className="flex flex-col gap-2.5">
          <Button
            variant="primary"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              setIsLoadingDemo(true);
              setTimeout(() => setIsLoadingDemo(false), 2000);
            }}
            loading={isLoadingDemo}
          >
            {isLoadingDemo ? 'Calming your mind...' : 'Primary Button (Click for Loading)'}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            leftIcon={<Heart className="w-4 h-4" />}
          >
            Secondary Pill Button
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Outline Action
            </Button>
            <Button variant="ghost" size="sm">
              Ghost Action
            </Button>
          </div>

          {/* Icon buttons row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-sanctuary-border">
            <span className="text-xs text-sanctuary-text-secondary font-medium">
              Icon Buttons
            </span>
            <div className="flex items-center gap-2">
              <IconButton
                aria-label="Search"
                variant="surface"
                size="sm"
                icon={<Search className="w-4 h-4" />}
              />
              <IconButton
                aria-label="Bookmark"
                variant="subtle"
                size="sm"
                icon={<Bookmark className="w-4 h-4" />}
              />
              <IconButton
                aria-label="Favorite"
                variant="primary"
                size="sm"
                icon={<Heart className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Form Inputs & Labels */}
      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Form Inputs & Validation"
          subtitle="Top labels, icons, password reveal, and error states"
        />

        <Card variant="white" className="flex flex-col gap-3.5">
          <Input
            label="Full Name"
            placeholder="e.g., Alex Morgan"
            rightLabel="Optional"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="We will never share your personal information."
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightLabel="Encrypted"
          />

          <Input
            label="Validation Error State"
            defaultValue="invalid-email"
            error="Please enter a valid sanctuary email address."
            leftIcon={<Mail className="w-4 h-4" />}
          />
        </Card>
      </section>

      {/* 3. Cards & Badges */}
      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Cards & Badges"
          subtitle="Delicate lavender borders, surface hierarchy, and elevation"
        />

        <div className="grid grid-cols-1 gap-2.5">
          <Card variant="white" interactive>
            <div className="flex items-center justify-between">
              <Badge variant="purple" size="sm">
                White Card (Interactive)
              </Badge>
              <span className="text-xs text-sanctuary-text-muted">Hover & tap</span>
            </div>
            <p className="text-xs text-sanctuary-text-secondary mt-2">
              Subtle lavender shadow, gentle hover elevation, and responsive feedback.
            </p>
          </Card>

          <Card variant="muted">
            <div className="flex items-center justify-between">
              <Badge variant="muted" size="sm">
                Muted Sanctuary Card
              </Badge>
              <CheckCircle2 className="w-4 h-4 text-brand-mint" />
            </div>
            <p className="text-xs text-sanctuary-text-secondary mt-2">
              Background tint for secondary guidance, check-ins, and prompts.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Mood Selection Options */}
      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Mood Selection Controls"
          subtitle="Segmented tier selector and selectable emotion chips"
        />

        <Card variant="white" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-sanctuary-text-primary">
              Emotion Category Tier
            </label>
            <MoodCategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-sanctuary-text-primary">
              Selectable Emotion Chips
            </label>
            <div className="flex flex-wrap gap-2">
              {['Calm', 'Grateful', 'Balanced', 'Reflective', 'Unsettled', 'Exhausted'].map(
                (mood) => (
                  <MoodChip
                    key={mood}
                    label={mood}
                    category={selectedCategory}
                    selected={selectedMoods.includes(mood)}
                    onClick={() => toggleMood(mood)}
                  />
                )
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Empty State */}
      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Empty State"
          subtitle="Serene placeholder when no reflections or history exist"
        />

        <EmptyState
          title="Your Sanctuary is Quiet"
          description="You haven't recorded any reflections today. Take a mindful breath and begin whenever you are ready."
          action={
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab('mood')}
            >
              Start First Reflection
            </Button>
          }
        />
      </section>

      {/* 6. Loading & Error States */}
      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Loading & Error States"
          subtitle="Gentle skeleton placeholders and non-disruptive error recovery"
        />

        <div className="flex flex-col gap-3">
          <SkeletonCard />

          <ErrorState
            title="Unable to load guided practice"
            message={errorDemo || "A brief connection issue occurred. Your local reflections remain safely on your device."}
            onRetry={() => {
              setErrorDemo("Checking connection... Everything is peaceful.");
              setTimeout(() => setErrorDemo(null), 3000);
            }}
          />
        </div>
      </section>
    </AppShell>
  );
}
