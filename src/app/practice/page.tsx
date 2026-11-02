import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/wellness/ComingSoonPage';
import { Sparkles, Compass, Eye, Waves } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mindfulness Practices & Somatics — Renew You',
  description: 'Curated somatic grounding rituals, body scans, and ambient mindfulness.',
};

export default function PracticePage() {
  return (
    <ComingSoonPage
      pageTitle="Mindfulness Practices & Meditations"
      tagline="Somatic grounding exercises, gentle body scans, and soothing sensory resets."
      description="We are developing an expanded collection of short, micro-restoration practices you can complete in 2 to 5 minutes to release physical tension and regain mental clarity anywhere."
      icon={Sparkles}
      badge="Phase V1.2 Expansion"
      alternativeAction={{
        label: 'Try Guided Breathwork',
        href: '/breathe',
        icon: Waves,
      }}
      plannedFeatures={[
        {
          title: '5-4-3-2-1 Sensory Grounding',
          description:
            'A guided interactive walkthrough that engages sight, touch, sound, smell, and taste to halt acute overthinking.',
          icon: Eye,
        },
        {
          title: 'Somatic Progressive Relaxation',
          description:
            'Step-by-step head-to-toe muscle tension and release sequences paired with soothing visual timers.',
          icon: Compass,
        },
        {
          title: 'Adaptive Ambient Soundscapes',
          description:
            'Layerable nature audio, soft rainfall, oceanic surges, and brown noise crafted for concentration or rest.',
          icon: Waves,
        },
      ]}
      mindfulQuote={{
        quote: 'Do not hurry, do not rest. Each moment of quiet attention returns you to yourself.',
        author: 'Jon Kabat-Zinn',
      }}
    />
  );
}
