import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/wellness/ComingSoonPage';
import { Wind, Gauge, Music, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guided Breathwork Sanctuary — Renew You',
  description: 'Immersive pranayama and cadence breathing for deep calm and emotional balance.',
};

export default function BreathePage() {
  return (
    <ComingSoonPage
      pageTitle="Mindful Breathwork Sanctuary"
      tagline="A full-screen, sensory breathing sanctuary to help you ground and recenter."
      description="We are crafting an expansive breathwork experience with customizable pacing, ambient acoustics, and biometric cadence visuals designed to dissolve daily tension in minutes."
      icon={Wind}
      badge="Phase V1.2 Expansion"
      alternativeAction={{
        label: 'Practice on Home Dashboard',
        href: '/#practices',
        icon: Wind,
      }}
      plannedFeatures={[
        {
          title: 'Configurable Cadence Presets',
          description:
            'Switch effortlessly between 4-4 Gentle Balance, 4-6 Calm Flow, and 4-4-4-4 Box Breathing with fine-tuned tempo controls.',
          icon: Gauge,
        },
        {
          title: 'Harmonic Audio Chimes',
          description:
            'Subtle Tibetan singing bowl and chime cues marking transitions between inhale, hold, and exhale cycles.',
          icon: Music,
        },
        {
          title: 'Somatic Visual Resonance',
          description:
            'A reactive organic orb with adaptive ambient color waves supporting deep sensory grounding and reduced-motion modes.',
          icon: Sparkles,
        },
      ]}
      mindfulQuote={{
        quote: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',
        author: 'Thich Nhat Hanh',
      }}
    />
  );
}
