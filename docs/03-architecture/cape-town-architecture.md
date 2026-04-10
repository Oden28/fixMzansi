# Cape Town Architecture

## Stack
- Next.js App Router
- React
- Supabase for data and server actions
- TypeScript
- Tailwind CSS

## Core domains
- Users
- Pros
- Service requests
- Matches
- Bookings
- Reviews
- Notifications
- Admin queue items

## Data flow
1. Customer submits request
2. Request is validated and persisted
3. Matching service ranks suitable pros
4. Request status is set to `matched` only when at least one persisted match exists
5. Booking is created from a selected match and request state becomes `booked`
6. Booking status changes propagate request state (`completed` / `cancelled`)
7. Reviews are created after completion
8. Notifications keep the customer and provider informed
9. Admin views surface pending operational work

## Identity and scoping
- Full auth is not yet finalized, so demo identity context is passed explicitly via query params and API parameters.
- Customer-facing pages and APIs should scope reads by `customerUserId` where available.
- Pro-facing pages and APIs should scope reads by `proUserId` where available.
- Dashboard and inbox views must not query global marketplace records when an identity scope is present.

## Authentication architecture (coherence sprint)
- `POST /api/auth` is the single auth gateway used by the onboarding UI.
- Request payload: `{ mode, role, email, password, fullName? }`.
- Role mapping at persistence boundary: app role `customer` maps to DB role `consumer`; `pro` and `admin` map directly.
- Register mode creates a `users` row; pro register additionally provisions a `pros` row with default summary and optional profile photo URL.
- API response includes `{ account, scope, nextPath }` so the UI can route immediately to the right scoped workspace.

## Profile media architecture
- Pro list and pro detail both consume `profile_photo_url` from Supabase where present.
- Seeded and fallback profiles include deterministic avatar URLs for visual consistency.
- UI fallback chain is implemented in shared utilities so card/detail experiences stay consistent.

## UI architecture constraints
- Global UI tokens live in `app/globals.css` as semantic CSS variables and are consumed by Tailwind utility classes.
- All interactive controls must preserve keyboard-visible focus styles and touch-safe target sizing.
- Navigation links should use Next.js `Link` for internal routes to keep transitions and prefetch behavior consistent.
- Motion defaults must remain in the 150-300ms range and respect reduced-motion preferences.

## Important architecture rule
The schema and the UI must agree on state names. If read state, review moderation, booking lifecycle, identity scoping, auth role mapping, or design-system tokens change, the docs and app must be updated together.
