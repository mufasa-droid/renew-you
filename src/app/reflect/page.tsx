import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/wellness/ComingSoonPage';
import { BookOpen, PenTool, Sparkles, Archive } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Daily Reflection Sanctuary — Renew You',
  description: 'Distraction-free guided journaling prompts for mindful self-discovery.',
};

export default function ReflectPage() {
  return (
    <ComingSoonPage
      pageTitle="Daily Reflection Sanctuary"
      tagline="A distraction-free, peaceful space for journaling, gratitude, and self-discovery."
      description="We are crafting a dedicated reflection journal with rotating mindfulness prompts, gratitude logs, and private archive search—giving your thoughts a quiet sanctuary away from digital noise."
      icon={BookOpen}
      badge="Phase V1.2 Expansion"
      alternativeAction={{
        label: 'Write Reflection on Dashboard',
        href: '/#journal',
        icon: PenTool,
      }}
      plannedFeatures={[
        {
          title: 'Curated Daily Mindfulness Prompts',
          description:
            'Thoughtful, therapist-inspired inquiries designed to unlock perspective, celebrate small wins, and release bottled thoughts.',
          icon: Sparkles,
        },
        {
          title: 'Distraction-Free Zen Writing Mode',
          description:
            'A minimalist full-screen typing interface with soothing ambient soundscapes and instant local autosave.',
          icon: PenTool,
        },
        {
          title: 'Searchable Journal Archive',
          description:
            'Filter past entries by tag, date, or mood rating to witness how your personal resilience has grown over time.',
          icon: Archive,
        },
      ]}
      mindfulQuote={{
        quote: 'Writing is a way of talking without being interrupted. It turns confusion into clarity.',
        author: 'Jules Renard',
      }}
    />
  );
}
