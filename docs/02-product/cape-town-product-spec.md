# Cape Town Product Spec

## Product definition
FixMzansi is a Cape Town solar marketplace for homeowners and small businesses.
It helps users request work, discover verified pros, book jobs, monitor progress, and leave reviews.

## Core user journeys

### 1. Customer journey
- Land on the homepage
- Browse verified pros
- Submit a request
- Review matched pros
- Book a provider
- Track the booking
- Leave a review after completion

### 2. Provider journey
- Join as a pro
- Get verified
- Receive matched leads
- Accept and manage bookings
- Complete jobs
- Build reputation through reviews

### 3. Admin journey
- Review pending pros
- Review incoming requests and marketplace activity
- Watch notifications and operational queues
- Keep the trust layer clean

## Routes in the app
- `/` — home / marketplace entry
- `/how-it-works` — trust and workflow explainer
- `/pros` — pro directory
- `/pros/[id]` — pro profile detail
- `/requests` — request creation
- `/requests/[id]` — request detail and matching results
- `/dashboard` — customer workspace
- `/pro-dashboard` — provider workspace
- `/bookings` — booking overview
- `/bookings/[id]` — booking detail
- `/notifications` — notification inbox
- `/admin` — operations console
- `/login` and `/register` — identity onboarding

## Marketplace IA benchmark alignment (Taskrabbit-inspired)
- Search-first and intent-first discovery should stay visible above the fold.
- Category chips and popular-job shortcuts should reduce first-click friction.
- Trust proof must be visible early: verified badges, ratings, response-time hints, and customer testimonials.
- Pricing and outcome clarity should appear before checkout actions (request, match, book).
- Pro directory UX should support quick filtering by category and suburb without leaving the page.

## Taskrabbit-inspired booking funnel (implementation baseline)
- FixMzansi uses a 4-step booking funnel with explicit numbered stages:
  1. `Describe your task` — location, job options, and detailed brief
  2. `Browse pros & prices` — ranked provider cards with pricing and trust signals
  3. `Choose date & time` — selected pro availability and scheduling capture
  4. `Confirm details` — payment/deposit messaging, price breakdown, and final confirmation CTA
- The request creation page (`/requests`) should present the step-1 mental model clearly, including category, location, task-size estimate, urgency, and a high-context task description.
- The request detail page (`/requests/[id]`) should behave as step 2, with filter controls (date window, time-of-day preference, price range, and pro type) and a clear `Select & Continue` action per matched pro.
- Step 3 and step 4 should be separate focused views to lower cognitive load and preserve user confidence before booking.
- Confirmation copy must explain deposit behavior and cancellation timing in plain language before final booking.
- The final CTA should emphasize post-booking continuity (chat/updates/changes) instead of implying a rigid irreversible action.

## Video-validated UX details (Taskrabbit parity cues)
- The marketplace hero should expose category chips immediately under search intent, not behind deeper navigation.
- Step 1 must support multi-location tasks where applicable (start/end address pattern for moving-style jobs); for solar jobs this maps to site address + optional alternate access/install address.
- Step 1 should include a reassuring availability message after location capture ("Good news — available in your area") to reduce uncertainty before the next click.
- Step 2 provider cards should surface trust metadata in a predictable order: hourly rate -> rating/reviews -> tasks completed -> work photos -> capability notes.
- Step 3 should combine calendar + visible time windows in one frame to preserve momentum.
- Login interruption during funnel should preserve return context and continue users where they left off after auth.

## Product principles
- Trust before volume
- Cape Town first, solar first
- Verified providers should feel meaningfully better than unverified providers
- The interface should always explain what happens next
- Every page should support the same lifecycle: request -> match -> book -> review
- Demo mode must preserve identity context end-to-end so one customer/pro sees their own workflow, not global marketplace data
- UI quality follows UI/UX Pro Max rules: visible focus states, 44px+ touch targets, semantic tokens, and clear CTA hierarchy

## UI design system baseline
- Product pattern: marketplace / directory with search-first entry points
- Core color tokens (cohesive trust palette v2): primary `#0B6E4F`, secondary `#2563EB`, action `#F59E0B`, surface `#0F172A`, text `#E2E8F0`
- Typography baseline: accessible sans stack optimized for readability and high contrast
- Motion baseline: 150-300ms transitions; respect `prefers-reduced-motion`
- Navigation baseline: predictable route transitions and persistent context (`customerUserId`, `proUserId`) across deep links

## Cross-skill UI quality contract (Impeccable + UI Skills + shadcn patterns)
- Interface intent first: every primary screen must communicate one dominant action above the fold (request, compare, schedule, confirm).
- Typography discipline: tighten headline/body rhythm and avoid generic equal-weight blocks; hierarchy should remain obvious at a glance.
- Purposeful motion only: interaction transitions communicate feedback/orientation (hover, focus, press, enter/exit) and avoid decorative animation.
- Control consistency: inputs, selects, textareas, and buttons share a unified size/radius/focus/disabled system across pages.
- State clarity: loading, empty, success, and error states should always preserve layout and communicate next action.
- Accessibility baseline: keyboard-visible focus, reduced-motion support, and touch-safe targets remain mandatory for all interactive controls.

## Authentication and onboarding requirements
- Login and register must be coherent variants of the same flow: mode switch + role selection + form completion.
- Role options are product-facing (`customer`, `pro`, `admin`) while persistence can map internally (`customer` -> `consumer`).
- Successful auth must always return a next-step route and immediately route users into their scoped workspace.
- Registering as a pro must provision a starter pro profile so the pro dashboard and profile pages are not dead ends.

## Pro profile media requirements
- Every pro card and pro detail view should display a profile photo.
- Photo fallback chain: explicit `profile_photo_url` -> seeded avatar URL -> initials avatar block.
- Photo presentation should improve trust and visual scannability without harming performance.

## Lifecycle rules
- A request starts as `submitted`
- A request only moves to `matched` when at least one qualified pro match exists
- Booking creation moves request state to `booked`
- Booking completion moves request state to `completed`
- Booking cancellation moves request state to `cancelled`
- Reviews are only allowed when booking state is `completed`

## Current build status
- Seeded discovery content exists for presentation and testing
- Request, booking, notification, and admin flows are wired into Supabase-backed data paths
- Demo mode uses workspace identity context (`customerUserId`, `proUserId`) through route state while full auth/session wiring is finalized
