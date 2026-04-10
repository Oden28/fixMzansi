# FixMzansi Cape Town Architecture

## Goal
Build a scalable marketplace architecture for Cape Town solar services that can later expand to more trades and more cities.

## Architecture principles
- start simple
- optimize for trust and speed
- keep the stack easy to maintain
- make data and workflows extensible
- support manual operations early
- design for later automation without building it too soon

## Recommended stack
### Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

Why:
- fast to build
- mobile-friendly
- SEO-friendly for suburb landing pages
- strong ecosystem

### Backend
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime

Why:
- handles auth, database, files, and real-time features in one system
- good for MVP speed
- easy to evolve into a larger system

### Hosting
- Vercel for frontend
- Supabase hosted backend

Why:
- simple deployment
- low operational overhead
- good performance for a public marketplace

### Maps and location
- PostGIS in PostgreSQL
- geospatial queries for proximity matching

Why:
- useful for suburb-based matching and service areas

### Messaging
- WhatsApp Business API
- email for fallback notifications

Why:
- WhatsApp is the practical communication layer for the South African market

### Payments
- start with manual payment tracking or lightweight deposit capture
- later integrate local payment rails and escrow flows

Why:
- payment complexity should not block launch

### Analytics
- PostHog

Why:
- product analytics, funnels, feature usage, and experiments

### Error monitoring
- Sentry

Why:
- catch runtime issues quickly

## System boundaries
### Public web app
Used by consumers to:
- browse the service
- submit requests
- view pros
- book work
- review completed jobs

### Pro portal
Used by tradespeople to:
- manage profile
- respond to leads
- view bookings
- update availability
- track earnings

### Admin console
Used by internal operators to:
- vet and approve pros
- edit listings
- manage disputes
- review job status
- moderate reviews

## Core data model
### users
- id
- name
- phone
- email
- role
- created_at

### pros
- id
- user_id
- trade_category
- city
- suburb_service_area
- verification_status
- rating
- bio
- profile_photo
- certificate_files

### service_requests
- id
- user_id
- category
- description
- photos
- location
- urgency
- status
- created_at

### matches
- id
- request_id
- pro_id
- rank_score
- match_reason
- sent_at

### bookings
- id
- request_id
- pro_id
- scheduled_time
- status
- price_estimate
- payment_status

### reviews
- id
- booking_id
- user_id
- pro_id
- rating
- text
- verified

### notifications
- id
- user_id
- channel
- type
- payload
- status

## Request flow
1. consumer opens landing page
2. consumer submits solar request
3. system matches nearby pros
4. consumer sees ranked providers
5. consumer books one pro
6. pro receives notification
7. admin can intervene if needed
8. job completes
9. review is collected

## Matching logic
The first version should use simple rules:
- trade category match
- Cape Town location match
- service area overlap
- verification status
- rating
- availability
- responsiveness history

No heavy AI is required for MVP.

## Trust system
Trust is the core product asset.

Signals:
- verified identity
- certificate uploads
- manual approval
- customer reviews
- job completion history
- dispute history

## SEO architecture
Create landing pages for:
- solar installation Cape Town
- solar installer in [suburb]
- battery installation Cape Town
- inverter repair Cape Town
- solar maintenance Cape Town

These pages should be indexable and fast.

## Environment model
### Development
- local Next.js app
- local Supabase or dev project
- seeded sample pros and requests

### Staging
- mirrored production config
- limited invite-only testers

### Production
- live Cape Town marketplace
- monitoring and logging active

## Deployment strategy
- deploy frontend continuously
- keep database migrations versioned
- use feature flags for risky launches
- ship in small increments

## Security and safety
- restrict admin routes
- validate uploads
- sanitize all user input
- rate-limit request forms
- protect contact data
- log moderation actions

## Scalability path
### Phase 1
Cape Town solar only

### Phase 2
Expand to other Cape Town trades

### Phase 3
Expand to another city

### Phase 4
Add finance, subscriptions, and B2B tooling

## Architectural rule
Do not overbuild for the final company. Build the smallest architecture that can support the first market wedge and later scale cleanly.
