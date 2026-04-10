# FixMzansi Build Plan

## Goal
Turn the Cape Town solar product spec into a working MVP with clear implementation phases, file structure, and engineering milestones.

## Build objective
Ship a mobile-first marketplace that can:
- capture solar requests
- show verified providers
- support booking
- track jobs
- collect reviews
- give admins control

## Suggested codebase structure
```text
app/
  page.tsx
  layout.tsx
  requests/
  pros/
  bookings/
  admin/
  api/
components/
  forms/
  cards/
  layout/
  navigation/
lib/
  db/
  auth/
  geo/
  matching/
  notifications/
  pricing/
  validation/
  analytics/
styles/
  globals.css
supabase/
  migrations/
  seed.sql
docs/
  product/
  architecture/
  execution/
```

## Data model build order
1. users
2. pros
3. service_requests
4. matches
5. bookings
6. reviews
7. notifications
8. admin audit log

## Page map
### Public pages
- home
- request flow
- pro directory
- pro profile
- booking confirmation
- review submission
- suburb SEO pages

### Pro pages
- onboarding
- dashboard
- bookings
- availability
- profile editor

### Admin pages
- queue for new pros
- request review
- booking monitoring
- dispute handling
- review moderation

## API routes
### Request creation
- create service request
- upload photos
- validate location and category

### Matching
- return top 3 to 5 pros
- apply ranking rules

### Booking
- create booking
- confirm time slot
- update status

### Reviews
- allow only completed-job reviews
- store verified review records

### Notifications
- send booking updates
- send review prompts

### Admin
- approve pros
- reject pros
- update statuses
- resolve disputes

## Component architecture
### Layout components
- header
- footer
- sidebar / mobile nav
- page shell

### Marketplace components
- pro card
- request form
- booking card
- review card
- trust badge
- availability badge
- price estimate badge

### Admin components
- moderation table
- status filters
- request queue
- dispute panel

## Implementation phases
### Phase 1: foundation
- repo scaffold
- auth
- database schema
- landing page
- request form

### Phase 2: matching and profiles
- pro profiles
- matching logic
- suburb pages
- ranking UI

### Phase 3: booking and trust
- booking flow
- verification badges
- review system
- admin moderation

### Phase 4: notifications and analytics
- WhatsApp/email notifications
- analytics events
- dashboards

### Phase 5: payments
- deposit capture
- payment status tracking
- future escrow support

## Suggested sprint 1 tasks
1. scaffold Next.js app
2. set up Supabase and auth
3. create database schema
4. build landing page
5. build request form
6. seed sample pros
7. render pro cards and profiles
8. implement matching endpoint
9. build booking flow
10. add admin review queue
11. wire the request action to Supabase inserts
12. add loading and error states for request submission
13. create booking creation and confirmation endpoints
14. persist match results for auditability
15. add request detail pages and pro profile pages
16. wire live data into home, requests, pros, and booking pages
17. add notification scaffolding and admin review queue hooks
18. add admin moderation UI and operations dashboard
19. add customer and pro dashboard surfaces
20. add public trust/how-it-works page
21. wire real Supabase Auth sessions into login/register
22. persist roles and route users to the correct dashboard
23. add live KPI cards and market health metrics
24. add review submission flow after booking completion
25. add booking status transitions and a visible notification inbox
26. add end-to-end request-to-booking state transitions
27. add graceful fallback messaging when the remote schema is not yet applied

## Change log and source-of-truth policy
- Any new feature recommendation that changes implementation scope must be added back into this build plan or the relevant product spec before work continues.
- Any new architectural state, endpoint, or data model should be documented here and in the architecture doc.
- Any UI system changes, color palette decisions, or interaction pattern changes should be documented here and in the product spec.
- Treat this file as the implementation source of truth for the current build phase.

## Engineering rule
The first build should prioritize trust and flow over perfection.

## Definition of done for MVP build
- user can submit a request
- system can show pros
- user can book a pro
- admin can manage the process
- completed jobs can be reviewed
- the product is stable enough to iterate
- all new work is reflected in the build plan and architecture docs
