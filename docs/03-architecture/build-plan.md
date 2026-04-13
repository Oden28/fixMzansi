# Build Plan

## Current implementation source of truth
The app is already beyond a scaffold. The current architecture includes:
- Supabase-backed request creation
- Matching and persistence for request-to-pro relationships
- Live request and pro profile detail pages
- Booking creation and booking lifecycle endpoints
- Notification inbox and admin queue surfaces
- Demo/seeded discovery content for the marketplace entry experience

## What still needs to stay logically consistent
- Keep notification read state separate from delivery state
- Keep review submission tied to completed bookings
- Keep dashboards anchored to a specific customer or provider context
- Keep pro discovery and request matching aligned with real service areas
- Prevent request status drift when a request has zero matches

## Implementation sequence
1. Stabilize domain models and schema assumptions
2. Fix request / booking / review lifecycle logic
3. Enforce match persistence rule (`submitted` remains until at least one match exists)
4. Pass customer/pro identity context end-to-end through request, booking, dashboard, and notification routes
5. Keep admin and notification surfaces in sync with the schema
6. Harden coherent onboarding, trust-first UI, and profile media
7. Add full authentication/session-backed scoping next

## Current sprint focus: coherence hardening
- Replace fragmented login/register role cards with a single coherent onboarding form flow
- Centralize auth through `/api/auth` and return deterministic next-route + scope
- Map app-facing role `customer` to DB role `consumer` to avoid signup failures
- Provision pro profile scaffolding during pro registration
- Apply trust palette v2 across tokens and global CSS
- Add pro profile photos and stable fallbacks in directory and detail pages
- Keep feature work validated with tests (`npm test`) before each ship step

## Next coherence increment (active)
- Add search-first pro discovery interaction on `/pros` with category chips and location/name query filtering
- Preserve identity scope in navigation links generated from active query params
- Keep customer/pro journey continuity when moving between directory and profile pages

## New active increment: Taskrabbit-style funnel uplift
- Implement explicit 4-step booking funnel UX across request, browse, schedule, and confirm surfaces.
- Add step progress headers and continuity copy so customers always know what comes next.
- Upgrade matched-pro cards with visible pricing, review count, work photo count, and stronger trust metadata.
- Introduce browse filters inspired by Taskrabbit (`date`, `time_of_day`, `price_range`, `pro_type`) and keep them client-side for ranking refinement.
- Add dedicated schedule and confirm pages before booking creation; only create booking after final confirmation.
- Add/extend tests for new parsing/flow helper logic and run `npm test` + `npm run lint` before shipping.

## New active increment: cross-skill polish system
- Apply Impeccable-style refine pass (`typeset`, `layout`, `colorize`, `polish`) to tighten hierarchy and reduce visual noise.
- Apply interaction-design guidance to standardize hover/focus/press states and motion timing by component class.
- Apply interface-design guidance to enforce one dominant action per screen and clearer data density control.
- Apply shadcn/ui component conventions (input/button/card semantics) without introducing unnecessary dependency churn.
