import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/wellness/ComingSoonPage';
import { Feather, Calendar, TrendingUp, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mood History & Insights — Renew You',
  description: 'Chronological mood journal and emotional trend insights in Renew You.',
};

export default function HistoryPage() {
  return (
    <ComingSoonPage
      pageTitle="Mood History & Personal Insights"
      tagline="Uncover your emotional patterns, monthly cycles, and daily journaling trends."
      description="We are developing an expanded analytics dashboard with multi-week calendar heatmaps, reflection keyword insights, and secure exportable logs to help you honor your personal journey."
      icon={Feather}
      badge="Phase V1.2 Expansion"
      alternativeAction={{
        label: 'View 7-Day History on Home',
        href: '/#history',
        icon: Feather,
      }}
      plannedFeatures={[
        {
          title: '30-Day & Seasonal Heatmaps',
          description:
            'Interactive calendar visualizations tracking how your radiant, serene, and overwhelmed moments shift across months.',
          icon: Calendar,
        },
        {
          title: 'Emotional Correlation Analytics',
          description:
            'Gentle, non-diagnostic insights linking your rest, movement, and reflection prompts with emotional shifts.',
          icon: TrendingUp,
        },
        {
          title: 'Encrypted Wellness Exports',
          description:
            'One-click export of your complete mood and journal records into private JSON or structured PDF summaries.',
          icon: Download,
        },
      ]}
      mindfulQuote={{
        quote: 'You cannot change what you do not observe. Awareness is the beginning of healing.',
        author: 'Carl Rogers',
      }}
    />
  );
}
