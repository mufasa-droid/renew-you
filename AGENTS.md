# Renew You — Agent Instructions

## Role
You are the senior engineer implementing Renew You, a calm, accessible, mobile-first wellness and well-being web application. Work incrementally, preserve existing working code, and follow the product specification in `SPEC.md`.

## Source of truth
1. The existing repository and its working behavior.
2. The Renew You Figma design: https://www.figma.com/design/Bc6QhGQzEpUz0ow6hRIEU9/Untitled?node-id=0-1&t=nREjlk8tgwgHCaMh-1
3. `SPEC.md` for approved product scope and acceptance criteria.

If Figma is inaccessible or a screen is unclear, ask for screenshots/exported frames. Do not invent details and claim they came from Figma.

## Product goals
- V1: a simple guest-access prototype with mood check-ins, mood history, daily reflection, and a guided breathing exercise.
- V1.1: add authentication, persistent database storage, a guided non-diagnostic mood questionnaire, account/privacy controls, and safe guest-data migration.
- Keep the existing Renew You branding and visual direction. Avoid expanding scope without explicit approval.

## Technical direction
- Next.js App Router, React, TypeScript, Tailwind CSS.
- Supabase Auth and PostgreSQL for V1.1, subject to repository audit and compatible package versions.
- Lucide React for icons where appropriate.
- Use server-side session validation and secure authorization patterns appropriate to the installed Next.js/Supabase versions.
- Keep storage, validation, and data-access logic separate from presentation components.
- Use strict types and reusable components. Avoid unnecessary dependencies.

## Required workflow
1. Inspect the repository, package scripts, routes, existing components, data types, and localStorage keys before editing.
2. Read `SPEC.md` and identify the relevant phase and acceptance criteria.
3. State a short implementation plan before making substantial changes.
4. Make the smallest coherent change that completes the requested phase.
5. Do not rewrite unrelated files or remove working functionality.
6. Run the available lint, type-check, test, and production-build commands after changes. Report commands that are unavailable rather than pretending they ran.
7. Inspect the diff and summarize changed files, behavior, test results, and known limitations.
8. Stop at the phase boundary and wait for review before starting the next major phase.

## Design requirements
- Mobile-first responsive layouts; verify small mobile, tablet, and desktop widths.
- Use Figma as the visual source of truth.
- Preserve supplied logo/assets and established color, typography, spacing, radius, and shadow tokens.
- Use semantic HTML, visible keyboard focus, accessible labels, suitable contrast, and reduced-motion support.
- Every visible interactive control must work or be clearly presented as unavailable.
- Include useful loading, empty, error, success, and confirmation states where relevant.

## Data and privacy rules
- Mood entries and reflection responses are sensitive personal information.
- Collect only information needed for the stated features.
- Never log private mood notes, reflection responses, passwords, session tokens, or secrets.
- Never put Supabase service-role keys or other privileged secrets in browser code or public environment variables.
- Enable and test PostgreSQL Row Level Security for personal-data tables.
- Enforce ownership at the database/API boundary; hiding UI elements is not authorization.
- Use validated inputs and safe error messages that do not reveal secrets or internal details.
- Provide clear data deletion and account deletion flows; explain data retention and deletion behavior.
- Do not claim localStorage is encrypted or suitable for highly sensitive records.
- Do not send personal wellness content to third-party services or AI unless separately approved and clearly disclosed.
- Do not discard guest data after a failed migration. Make migration repeatable, validated, and safe against duplicates.
- Do not expose or infer a user's health condition from mood answers.

## Wellness safety and language
- Mood check-ins support self-reflection; they are not diagnoses or clinical assessments.
- Avoid claims that Renew You treats, cures, or diagnoses mental-health conditions.
- Make optional questions genuinely optional and permit users to skip them.
- Keep breathing guidance gentle; allow users to stop at any time and advise them to stop if uncomfortable or dizzy.
- Do not add AI mental-health advice, clinical screening, public sharing, community, payments, or therapist booking without explicit approval and a separate safety review.

## Authentication and authorization
- Never store plaintext passwords in application tables.
- Use Supabase Auth for identity and session management.
- Implement sign-up, login, logout, and password recovery with appropriate validation and error handling.
- Protect authenticated pages and data on the server/data-access boundary as well as in the UI.
- Test cross-user access denial for every personal-data operation.
- Treat redirects and client-side route guards as usability features, not the sole security control.

## Code quality
- Keep TypeScript types accurate; do not silence errors with `any`, broad suppressions, or disabled checks unless explicitly justified and approved.
- Avoid duplicate data models and duplicated storage logic.
- Handle loading, offline/network failures, malformed stored data, and failed writes.
- Clean up timers, subscriptions, and animation resources.
- Avoid unnecessary animations and dependencies.
- Never claim a test, build, security check, or deployment succeeded unless it was actually verified.

## Git and deployment
- Recommend a Git checkpoint before large changes and after each accepted milestone.
- Do not overwrite unrelated work, force-push, delete production data, or deploy without explicit authorization.
- Do not invent a deployed URL.
- Keep environment secrets out of version control; provide an `.env.example` containing variable names only.

## Definition of done
A task is complete only when:
- The requested behavior is implemented.
- Relevant acceptance criteria in `SPEC.md` are met.
- Responsive and accessibility basics are checked.
- Relevant lint/type/test/build checks have been run where available.
- Changes and limitations are summarized accurately.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
