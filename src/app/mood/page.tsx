import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/wellness/ComingSoonPage';
import { Smile, Sparkles, Filter, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mindful Mood Space — Renew You',
  description: 'Deep emotional check-ins, nuance sliders, and contextual tags in Renew You.',
};

export default function MoodPage() {
  return (
    <ComingSoonPage
      pageTitle="Mindful Mood Space"
      tagline="Explore nuanced emotional palettes beyond binary high and low feelings."
      description="We are building an intuitive multidimensional mood explorer that enables granular energy, valence, and tension tracking with rich contextual tags and voice-to-text reflections."
      icon={Smile}
      badge="Phase V1.2 Expansion"
      alternativeAction={{
        label: 'Take Today’s Check-In',
        href: '/questionnaire',
        icon: Smile,
      }}
      plannedFeatures={[
        {
          title: 'Nuanced Valence & Energy Matrix',
          description:
            'A 2D emotional wheel mapping high-energy excitement, calm stillness, drained fatigue, and restless tension with precision.',
          icon: Layers,
        },
        {
          title: 'Contextual Tagging System',
          description:
            'Tag influences like sleep quality, social connections, outdoors, work stress, and physical sensations without clutter.',
          icon: Filter,
        },
        {
          title: 'Gentle Affirmation Engine',
          description:
            'Encouraging, non-toxic affirmations tailored to acknowledge and validate exactly how you feel right now.',
          icon: Sparkles,
        },
      ]}
      mindfulQuote={{
        quote: 'Whatever you are feeling right now does not define you; it is simply passing through you.',
        author: 'Tara Brach',
      }}
    />
  );
}
