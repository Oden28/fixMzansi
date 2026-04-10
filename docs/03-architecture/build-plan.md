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
