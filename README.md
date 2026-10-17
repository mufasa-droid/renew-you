# Renew You 🌿

> A mindful, guest-first wellness sanctuary for daily reflection, mood tracking, and guided breathwork.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-success?logo=vercel)](https://renew-you.vercel.app)

**Live Production App:** [https://renew-you.vercel.app](https://renew-you.vercel.app)  
**Settings & Privacy:** [https://renew-you.vercel.app/settings](https://renew-you.vercel.app/settings)

---

## ✨ Overview

Renew You is a lightweight, respectful, and aesthetically refined wellness web application. Designed for busy people seeking quiet moments of mindfulness, Renew You requires zero account registration, collects no personal telemetry, and retains all wellness data strictly within your own web browser.

### Key Capabilities

- **Daily Mood Check-In & History:**
  - Fast, intuitive 5-tier mood scale (*Radiant, Serene, Neutral, Low Energy, Overwhelmed*).
  - Same-day entry updates and edit-in-place capabilities.
  - 7-day responsive overview and chronological history timeline.
- **Guided Breathwork Sanctuary:**
  - Gentle animated breathing orb with synchronized visual expansion and contraction.
  - 3 configurable cadence presets:
    - **Gentle Balance** (4s inhale / 4s exhale)
    - **Calm Flow** (4s inhale / 6s exhale)
    - **Box Breathing** (4s inhale / 4s hold / 4s exhale / 4s hold)
  - Full playback controls (Start, Pause, Resume, Stop) and `prefers-reduced-motion` compliance.
- **Daily Reflection Journal:**
  - Prompted daily journaling stored locally in the browser with auto-saving and timestamps.
- **Local Data & Privacy Management:**
  - Dedicated `/settings` dashboard detailing browser storage behavior and longevity.
  - Single-click, two-step confirmation to selectively erase Renew You entries (`renew_you_*`), preserving all other browser and third-party site data.
- **Non-Clinical Care & Crisis Support:**
  - Clear medical disclaimers emphasizing that Renew You is an informational self-care companion, not clinical psychiatric treatment.
  - Integrated 988 Suicide & Crisis Lifeline hotline references.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Cache Components, Partial Prefetching)
- **Library:** [React 19](https://react.dev/) using `useSyncExternalStore` with memoized snapshot selectors for zero hydration re-render loops
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Storage Layer:** Centralized `storageManager.ts` utility strictly namespacing `localStorage` keys:
  - `renew_you_mood_entries_v1`
  - `renew_you_reflection_entries_v1`
  - `renew_you_settings_v1`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mufasa-droid/renew-you.git

# Navigate to the project directory
cd renew-you

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the Next.js Turbopack development server
npm run dev

# Or on Windows PowerShell:
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Run TypeScript validation and compile static pages
npm run build

# Or on Windows PowerShell:
npm.cmd run build
```

---

## 🔒 Privacy & Safety Disclosures

1. **Browser-Only Storage:** All moods and reflections are stored locally via `window.localStorage`. If you clear site data, switch browsers, or open an incognito session, your data will not carry over.
2. **Non-Medical Notice:** Renew You does not provide medical or psychiatric diagnoses. If you are experiencing a mental health emergency or crisis, please dial or text **988** (US/Canada) or contact your local emergency emergency healthcare provider.

---

## 📄 License

MIT © [Renew You](https://renew-you.vercel.app)
