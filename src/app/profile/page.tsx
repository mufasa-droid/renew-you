import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/wellness/ComingSoonPage';
import { User, Award, Shield, Sliders } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sanctuary Profile & Milestones — Renew You',
  description: 'Your personal sanctuary milestones, reflection statistics, and preferences.',
};

export default function ProfilePage() {
  return (
    <ComingSoonPage
      pageTitle="Personal Sanctuary Profile"
      tagline="Celebrate your quiet moments of consistency and customize your sanctuary experience."
      description="We are designing a dedicated personal profile space to showcase your mindfulness milestones, custom reflection rhythms, and cross-device sync status—while honoring your privacy at every step."
      icon={User}
      badge="Phase V1.2 Expansion"
      alternativeAction={{
        label: 'Manage Account & Privacy',
        href: '/settings',
        icon: Sliders,
      }}
      plannedFeatures={[
        {
          title: 'Mindfulness Milestones & Streaks',
          description:
            'Non-punitive, compassionate milestones celebrating moments of pause and self-reflection without toxic gamification.',
          icon: Award,
        },
        {
          title: 'Custom Sanctuary Rhythms',
          description:
            'Set gentle optional reminders and customize default breathwork pacing to fit your personal routine.',
          icon: Sliders,
        },
        {
          title: 'End-to-End Privacy Controls',
          description:
            'Direct overview of client-side storage, Supabase RLS encryption status, and one-tap zero-loss data portability.',
          icon: Shield,
        },
      ]}
      mindfulQuote={{
        quote: 'To love oneself is the beginning of a lifelong romance.',
        author: 'Oscar Wilde',
      }}
    />
  );
}
