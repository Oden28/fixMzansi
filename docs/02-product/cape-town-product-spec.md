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
