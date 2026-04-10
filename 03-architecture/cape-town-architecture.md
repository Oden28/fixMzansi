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
- keep the source-of-truth docs current whenever scope changes

## Visual design system
### Brand colors
- Deep ocean blue: `#0F4C81`
- Solar teal: `#14B8A6`
- Warm amber: `#F59E0B`
- Midnight slate: `#020617`
- Deep slate: `#0F172A`
- Emerald success: `#10B981`
- Rose error: `#F43F5E`

### UI tokens
- Card radius: 24px
- Primary button: teal or blue with strong contrast
- Secondary button: outline on dark background
- Trust badge: emerald tint
- Warning / issue state: amber or rose

### Experience goals
- premium feel
- highly legible on mobile
- fast to scan
- trust-forward interactions
- admin and operations views should feel lightweight but powerful

## Operations dashboard
The product should include dashboards for:
- customer activity and request progress
- pro activity and booking pipeline
- moderation of pros
- tracking requests and bookings
- review queue management
- notification inspection
- market health KPIs
- manual intervention when automation is not enough

## Trust and education
A public how-it-works page should explain:
- how pros are verified
- how matching works
- how booking and payments work
- how reviews are moderated
- what customers can expect from the service

## Authentication and role routing
The app should support real Supabase Auth sessions for:
- customers
- pros
- admins

Authentication should:
- persist sessions
- route users to the correct dashboard by role
- keep onboarding simple
- avoid generic login UX

## Recommended stack
### Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

### Backend
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime

### Hosting
- Vercel for frontend
- Supabase hosted backend

### Maps and location
- PostGIS in PostgreSQL
- geospatial queries for suburb-based matching

### Messaging
- WhatsApp Business API
- email for fallback notifications

### Payments
- start with manual payment tracking or lightweight deposit capture
- later integrate local payment rails and escrow flows

### Analytics
- PostHog

### Error monitoring
- Sentry

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
3. request is validated in the client and server action
4. request is persisted in Supabase
5. system matches nearby pros
6. consumer sees ranked providers
7. consumer books one pro
8. booking record is created and linked to the request
9. pro receives notification
10. admin can intervene if needed
11. job completes
12. review is collected

## Request state machine
- draft
- submitted
- matched
- booked
- in_progress
- completed
- cancelled

## Matching logic
First version should use simple rules:
- trade category match
- Cape Town location match
- service area overlap
- verification status
- rating
- availability
- responsiveness history

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

## Application state boundaries
### Client state
- form validation
- loading states
- submission errors
- optimistic UI updates

### Server state
- requests
- matches
- bookings
- reviews
- notifications
- admin moderation actions
- Supabase persistence using server-side inserts for request, matching, and booking flows
- graceful fallback if schema or permissions are not yet deployed

### Database state
- users
- pros
- service requests
- matches
- bookings
- reviews
- notifications

## Scalability path
### Phase 1
Cape Town solar only

### Phase 2
Expand to other Cape Town trades

### Phase 3
Expand to another city

### Phase 4
Add finance, subscriptions, and B2B tooling
