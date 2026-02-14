# Denoko Taxi Dispatch MVP - The Taxi Company

## Overview
A hybrid taxi dispatch web app for The Taxi Company (A Denoko Cooperative). Features live driver GPS tracking on a map, dispatcher-created call pins with customer name/phone, "Picked Up" completion workflow, fare pricing, server-side filtering, dispatch code grouping, call-to-driver assignment, and driver performance stats.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter (routing)
- Backend: Express.js with PostgreSQL (Drizzle ORM)
- Maps: Mapbox GL JS
- Database: PostgreSQL with Drizzle ORM for calls persistence. Drivers remain in-memory (ephemeral GPS data).

## Architecture
- `shared/schema.ts` - Drizzle table definitions (calls table) + Zod schemas for validation + TypeScript types
- `server/db.ts` - PostgreSQL connection via pg + Drizzle ORM
- `server/storage.ts` - DatabaseStorage class for calls (DB) + DriverMemStore for drivers (in-memory)
- `server/routes.ts` - API routes for driver location, calls CRUD with server-side filtering, dispatch code validation, geocoding, call assignment, driver stats
- `client/src/pages/HomePage.tsx` - Entry splash page with loading bar, "Enter App" and "Company Site" buttons
- `client/src/pages/Landing.tsx` - Role selection page (Driver vs Dispatch) at /select
- `client/src/pages/DriverPage.tsx` - Driver setup, GPS sharing (splash -> setup -> active)
- `client/src/pages/DispatchPage.tsx` - Dispatch login, dashboard with map, calls, drivers, unified filters, call assignment, driver details panel (splash -> login -> dashboard)
- `client/src/pages/AboutUsPage.tsx` - Company site About Us page with Metro/Zune-inspired design (hero, who we are, two modes, how it works, features, call workflow, map & filtering, tech stack, cooperative manifesto, testimonials, pricing, CTA)
- `client/src/pages/RedirectPage.tsx` - Utility redirect component for /features, /pricing, /contact routes
- `client/src/components/TaxiLogo.tsx` - Branded taxi logo component
- `client/src/components/SplashScreen.tsx` - Loading splash screen
- `client/src/components/CompanyNav.tsx` - Company site navigation bar with smooth-scroll anchor links
- `client/src/components/CompanyFooter.tsx` - Company site footer with CTA and contact info

## Company Site Routes
- `/about-us` - Full About Us page with all sections (hero, features, pricing, etc.)
- `/features` - Redirects to /about-us (features section anchor)
- `/pricing` - Redirects to /about-us (pricing section anchor)
- `/contact` - Redirects to /about-us (contact/footer section anchor)
- Section anchors on about-us: #hero, #who-we-are, #platform, #driver-mode, #dispatch-mode, #features, #workflow, #map-filtering, #tech-stack, #cooperative, #cooperative-mission, #testimonials, #pricing, #contact

## Database Schema
- `calls` table: id (serial PK), dispatch_code, customer_name, customer_phone, address, notes, lat, lng, status (NEW/ASSIGNED/DONE), fare_price_cents (int, nullable), assigned_driver_id (text, nullable), assigned_driver_name (text, nullable), assigned_at (timestamp, nullable), created_at, updated_at, completed_at

## Environment Variables (Secrets)
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)
- `MAPBOX_TOKEN_PUBLIC` - Mapbox public access token (pk.*) for frontend map display
- `MAPBOX_TOKEN_SECRET` - Mapbox secret access token (sk.*) for server-side geocoding
- `DISPATCH_PASSCODE` - Admin passcode for dispatch login
- `DISPATCH_GROUP_CODE` - Shared dispatch code (e.g., NYAC-TAXI-01)
- `SESSION_SECRET` - Session secret for Express

## API Routes
- `POST /api/validate-dispatch-code` - Validates dispatch code for drivers
- `POST /api/dispatch/login` - Dispatch login with passcode + dispatch code
- `POST /api/driver/update-location` - Driver GPS update (every 5s)
- `GET /api/driver/list?dispatchCode=...` - List drivers by dispatch code
- `GET /api/driver/stats?dispatchCode=...&driverId=...&status=...&range=...` - Get driver performance stats (trips assigned, revenue) within filters
- `POST /api/calls/create` - Create call with customerName, customerPhone, address, farePriceCents (optional)
- `GET /api/calls/list?dispatchCode=...&status=...&range=...&startDate=...&endDate=...` - List calls with server-side filtering
  - status: ALL | NEW | COMPLETED
  - range: TODAY | LAST_7_DAYS | LAST_30_DAYS | LAST_6_MONTHS | LAST_12_MONTHS | ALL_TIME | CUSTOM
  - startDate/endDate: YYYY-MM-DD (when range=CUSTOM)
- `PATCH /api/calls/update-status` - Update call status + optional farePriceCents
- `PATCH /api/calls/assign` - Assign/unassign a call to a driver (callId, driverId, driverName)
- `GET /api/mapbox-token` - Get Mapbox public token for frontend
- `GET /api/geocode/autocomplete?q=...` - Address autocomplete (US-only, proxies Mapbox Geocoding API)

## Map Marker Management
- Map is initialized once via useEffect with empty dependency array
- Call markers stored in callMarkersRef (Map keyed by call id)
- Driver markers stored in driverMarkersRef (Map keyed by driver id)
- isValidLngLat() guard prevents markers from jumping to (0,0)
- Markers are updated via setLngLat() instead of being recreated
- map.resize() called when layout changes (panel open/close)

## Design Theme
- Taxi yellow (#FFDD00 / hsl(50, 100%, 50%)) background
- Black text and borders
- Bold, blocky typography (Inter font)
- Thick borders, large buttons, high-contrast UI

## Data Fetching
- Dispatch dashboard uses TanStack Query with refetchInterval (3s) for drivers and calls
- Driver stats use TanStack Query with refetchInterval (5s)
- Query keys include filter params for proper cache invalidation
- Mutations use cache invalidation via queryClient.invalidateQueries
- Driver page uses raw fetch for GPS location updates (every 5s)
- Filters persist in URL query string (status, range, startDate, endDate)

## Pricing Model
- Starter: $99/driver/month (up to 25 drivers)
- Professional: $69/driver/month (25+ drivers, volume savings)

## User Preferences
- Mobile-first responsive design
- Yellow/black taxi branding throughout
- No dark mode (themed app)
- Custom taxi-themed UI (not standard shadcn styling) per user design requirements
