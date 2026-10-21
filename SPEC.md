# Renew You — Product and Implementation Specification

**Document status:** Working specification for V1 and V1.1  
**Product:** Renew You  
**Primary design reference:** https://www.figma.com/design/Bc6QhGQzEpUz0ow6hRIEU9/Untitled?node-id=0-1&t=nREjlk8tgwgHCaMh-1

## 1. Product overview

Renew You is a general-wellness website that helps people pause, reflect on their feelings, and practice simple self-care. It is not a diagnostic, clinical, or emergency mental-health service.

### Product principles
- Calm, welcoming, non-judgmental language.
- Mobile-first, accessible design.
- Guest access for V1.
- Clear consent and user control over personal data.
- Simple features that can be tested with early users.
- No feature expansion without a product decision.

## 2. Release scope

### V1 — Frontend prototype
- Guest access without mandatory registration.
- Home dashboard.
- Daily mood check-in.
- Mood history and a simple seven-day overview.
- Daily reflection prompt and optional written response.
- Guided breathing exercise with start, pause, resume, and stop controls.
- Settings/privacy information and a clear-data option.
- Browser localStorage for prototype persistence.
- Responsive layout matching the approved Figma design.

### V1.1 — Personal wellness platform
- Supabase Auth: sign-up, login, logout, password recovery.
- PostgreSQL persistence for profiles, mood check-ins, and reflections.
- Guided mood questionnaire with optional follow-up questions.
- Personal mood history available across authenticated devices.
- Account/profile settings.
- Data export where practical and account/data deletion.
- Safe migration of existing guest data into an authenticated account.
- Server/data-boundary authorization and Row Level Security.
- Robust loading, error, offline, and failed-save states.

### Explicitly out of scope unless approved
- AI wellness companion or AI analysis of mood notes.
- Diagnosis, treatment recommendations, or clinical claims.
- Therapist marketplace or booking.
- Public mood sharing, community, or chat.
- Payments/subscriptions.
- Push notifications or complex streak/reward systems.
- Third-party transmission of personal wellness content.

## 3. Audience and user needs

**Audience:** People interested in everyday wellness and personal reflection.

Users should be able to:
- Record how they feel without judgment.
- Reflect on possible influences on their mood.
- Revisit their own history.
- Use a short breathing exercise.
- Understand where their data is stored and control it.

## 4. Design and UX requirements

- Use the Figma file as the visual source of truth.
- Preserve Renew You branding, logo, colors, typography, spacing, component shapes, and screen hierarchy.
- If Figma cannot be inspected, request exported screenshots instead of inventing a design.
- Prioritize mobile layouts, then tablet and desktop.
- Use semantic HTML and accessible labels and focus states.
- Support reduced-motion preferences.
- Provide empty, loading, success, and error states.
- Do not leave visible controls inert.
- Avoid excessive animations, clutter, or new visual styles not present in the design.

## 5. Routes and information architecture

Adapt routes to the existing repository and Figma screens. Suggested routes:

- `/` — Home dashboard.
- `/mood` — Mood questionnaire and check-in.
- `/mood/history` — Mood history and seven-day overview.
- `/reflect` — Daily prompt and saved reflections.
- `/breathe` — Guided breathing exercise.
- `/settings` — Privacy, data controls, and profile.
- `/login` — Login, when authentication is enabled.
- `/signup` — Registration, when authentication is enabled.
- `/forgot-password` — Password recovery, when authentication is enabled.

Do not force authentication screens into V1 if guest access is the approved approach. Existing Figma screens may include onboarding/auth screens for later releases.

## 6. V1 feature requirements

### 6.1 Home dashboard
- Welcome the user without requiring an account.
- Provide a clear mood-check-in entry point.
- Display the daily reflection prompt.
- Link to the breathing exercise.
- Display a recent mood summary or a useful empty state.
- Provide clear, consistent navigation.

### 6.2 Mood check-in
- Five initial mood options: Very low, Low, Okay, Good, Excellent.
- Optional short note.
- One entry per local calendar day; user may edit that day's entry.
- Clear save confirmation and validation.
- No diagnosis or clinical interpretation.
- Store entries locally in V1 only.
- Handle malformed or unavailable localStorage safely.

### 6.3 Mood history
- Show saved entries in chronological order.
- Show mood label, date, and optional note.
- Show a simple seven-day overview based only on recorded data.
- Empty state for users with no entries.
- Avoid overstating trends or implying clinical meaning.

### 6.4 Daily reflection
- Show one short, non-clinical prompt per day.
- Response is optional.
- Allow users to save, edit, and delete their own responses.
- Display previous responses in chronological order.
- Keep content private; do not send it to external services.

### 6.5 Breathing exercise
- One gentle, configurable inhale/exhale cycle; initial example: four seconds in and four seconds out.
- Start, pause, resume, and stop controls.
- Clear instruction text and visual pacing.
- Prevent multiple timers from running at once.
- Clean up timers on unmount/navigation.
- Respect reduced motion.
- Users may stop at any time; advise stopping if uncomfortable or dizzy.
- Do not claim medical benefits.

### 6.6 Settings and local privacy
- Explain V1 local browser storage and its limitations.
- Provide a clear-data action with explicit confirmation.
- Remove only Renew You's own storage keys.
- Do not claim localStorage is encrypted.
- Explain that clearing browser data or switching devices may remove or separate records.

## 7. V1.1 mood questionnaire specification

The questionnaire is for self-reflection, not diagnosis. It should be brief, non-judgmental, accessible, and skippable where indicated.

### Proposed core questions
1. **How are you feeling right now?**
   - Happy or content
   - Calm or peaceful
   - Sad or low
   - Worried or anxious
   - Frustrated or irritated
   - Unsure / hard to describe

2. **How is your energy level?**
   - Low
   - Moderate
   - High
   - Unsure

3. **How much stress are you experiencing?**
   - Very little or none
   - Some
   - A lot
   - Unsure

4. **What might be influencing how you feel?** (optional; allow more than one selection if useful)
   - Work or school
   - Relationships or family
   - Sleep, physical well-being, or energy
   - A mix of things
   - Nothing specific I can identify
   - Prefer not to say

5. **How long have you been feeling this way?**
   - Just today
   - A few days
   - A while
   - Unsure

### Optional follow-up
Offer one optional follow-up based on an answer, such as asking about rest when low energy is selected. Do not use deterministic rules to infer a disorder or clinical risk.

### Results screen
- Reflect the user's selected answers in plain language.
- Use phrasing such as “You described feeling…” rather than “You are…”.
- Offer a gentle next step: optional reflection, breathing exercise, or return to home.
- Do not output diagnostic labels, clinical risk scores, or unsupported conclusions.
- Make it clear that the summary is a reflection of the user's answers, not a diagnosis.

### Questionnaire acceptance criteria
- User can navigate the flow and see progress.
- Required fields are validated; optional fields can be skipped.
- Back navigation preserves current answers.
- Refresh/failed save behavior is explicit and does not silently discard answers.
- Successful submission creates a persistent record for the authenticated user.
- Errors do not expose private data.
- UI works with keyboard and screen readers.
- All answers are stored with a versioned questionnaire schema so future question changes do not corrupt historical entries.

## 8. V1.1 technical architecture

### Frontend
- Next.js App Router, React, TypeScript, Tailwind CSS.
- Reuse the existing project and dependencies where appropriate.
- Shared UI and feature components.
- Typed domain models and validation.
- Separate data-access/storage code from UI components.

### Backend and database
- Supabase Auth for identity and sessions.
- PostgreSQL for user-owned data.
- Use migrations for schema changes; do not rely on manual production-only edits.
- Enable Row Level Security on tables containing user data.
- Enforce ownership in the database/data-access boundary, not only in UI logic.
- Keep service-role credentials server-only; never expose them to the browser.
- Use the installed versions' supported Supabase/Next.js SSR session pattern.

### Suggested logical data model
Exact column types and constraints should be proposed during the repository audit.

**profiles**
- `user_id` references the authenticated identity and is unique.
- `display_name` optional.
- `created_at`, `updated_at`.
- Minimal preferences only when needed.

**mood_checkins**
- `id`.
- `user_id`.
- `entry_date` representing the user's local check-in date.
- `mood` and structured questionnaire answers.
- Optional note.
- `questionnaire_version`.
- `created_at`, `updated_at`.
- Unique constraint for one check-in per user per local date, if the product retains the one-per-day rule.

**reflections**
- `id`.
- `user_id`.
- `prompt_id` or prompt key.
- `entry_date`.
- `response`.
- `created_at`, `updated_at`.
- Add uniqueness only if the chosen UX allows one response per prompt/date.

Avoid duplicating sensitive data unnecessarily. Do not store passwords in application tables.

## 9. Authentication and authorization

- Sign-up, login, logout, and password recovery.
- Validate form input and handle duplicate accounts, invalid credentials, expired links, and network failures with safe user-facing messages.
- Use the recommended Supabase SSR session pattern for the installed versions.
- Protect authenticated operations at the server/data-access boundary.
- Do not rely solely on client-side route guards.
- Apply and test RLS policies for select, insert, update, and delete.
- Test that User A cannot read or modify User B's mood entries or reflections.
- Do not log passwords, tokens, session cookies, or wellness content.

## 10. Guest-data migration

Existing V1 localStorage records may matter to users.

- Audit and document the current localStorage keys and formats before changing them.
- Offer to import guest records after account creation/sign-in.
- Validate records before upload.
- Make imports repeatable and protect against duplicates.
- Preserve local data until successful import is confirmed.
- Handle partial failures without silently discarding records.
- Explain what will be imported and obtain user confirmation.
- Do not upload guest data without a clear user action.

## 11. Privacy, retention, and deletion

Mood records and reflections are sensitive personal information.

- Collect only what is needed.
- Provide clear privacy information and data controls.
- Decide and document data retention and deletion behavior before launch.
- Provide a user-accessible way to delete entries and request account deletion.
- Define what happens to related records when an account is deleted.
- Provide export of personal data where practical.
- Do not send wellness content to analytics, logging, or AI services by default.
- Never claim encryption or regulatory compliance without verification.
- Review applicable privacy obligations for the intended markets before public launch.

## 12. Error, loading, and resilience requirements

Handle:
- Network disconnection and timeouts.
- Failed saves and retries.
- Expired or missing authentication sessions.
- Invalid or malformed data.
- Empty history.
- Double submission.
- Unauthorized access.
- Interrupted guest-data import.
- Browser storage unavailable in V1.
- Missing environment variables with a clear development error.

Never show a success state until the operation has actually succeeded.

## 13. Testing and release acceptance

Before a release:
- Run lint, TypeScript checks, tests, and production build where scripts exist.
- Test all V1 and V1.1 core flows.
- Test mobile, tablet, and desktop layouts.
- Test keyboard focus, accessible labels, contrast, and reduced motion.
- Test authenticated data access with at least two separate users.
- Verify RLS prevents cross-user access.
- Test guest import, duplicate handling, and interrupted migration.
- Test logout, password recovery, account deletion, and data deletion.
- Check browser console and failed requests.
- Verify environment secrets are not exposed.
- Do not claim tests passed unless actually run.
- Do not deploy or alter production data without explicit authorization.

## 14. Implementation phases

### Phase 0 — Repository audit
Inspect code, routes, data structures, localStorage, dependencies, and design. Do not modify files until the audit and migration plan are approved.

### Phase 1 — Project foundation
Prepare environment variables, compatible Supabase packages, typed configuration, and migration conventions. Keep secrets out of source control.

### Phase 2 — Database and access control
Create reviewed migrations for profiles, mood check-ins, and reflections. Enable RLS and test policies before connecting sensitive UI.

### Phase 3 — Authentication
Implement sign-up, login, logout, password recovery, session handling, and protected operations.

### Phase 4 — Guided questionnaire
Build the question flow, validation, optional follow-up, results summary, and versioned answer schema.

### Phase 5 — Persistent mood and reflection data
Connect reads/writes to Supabase, add loading/error states, and verify user ownership.

### Phase 6 — Guest-data migration
Implement user-confirmed, validated, repeatable import with duplicate and failure handling.

### Phase 7 — Account and privacy controls
Implement profile settings, data deletion/export where practical, and account deletion behavior.

### Phase 8 — QA and release
Run functional, responsive, accessibility, authorization, migration, and production checks. Deploy only with explicit approval.

## 15. Definition of done

V1.1 is ready when:
- Users can register, log in, log out, and recover their accounts.
- The guided questionnaire works and uses non-diagnostic language.
- Mood entries and reflections persist across devices for authenticated users.
- RLS and server-side authorization prevent cross-user access.
- Guest data can be imported without silent loss or duplicate records.
- Users have clear privacy and deletion controls.
- The existing design remains recognizable and responsive.
- Relevant automated and manual checks have been run and reported.
- Known limitations are documented honestly.
