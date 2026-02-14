# Denoko Taxi Dispatch MVP - The Taxi Company

## Overview
A hybrid taxi dispatch web app for The Taxi Company (A Denoko Cooperative). Features live driver GPS tracking on a map, dispatcher-created call pins, and dispatch code grouping.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Wouter (routing)
- Backend: Express.js with in-memory storage
- Maps: Mapbox GL JS
- No database - uses in-memory storage for MVP

## Architecture
- `shared/schema.ts` - Zod schemas and TypeScript types for Driver, Call, dispatch validation
- `server/storage.ts` - In-memory storage (MemStorage) for drivers and calls
- `server/routes.ts` - API routes for driver location, calls CRUD, dispatch code validation, geocoding
- `client/src/pages/Landing.tsx` - Role selection landing page (Driver vs Dispatch)
- `client/src/pages/DriverPage.tsx` - Driver setup, GPS sharing (splash -> setup -> active)
- `client/src/pages/DispatchPage.tsx` - Dispatch login, dashboard with map, calls, drivers (splash -> login -> dashboard)
- `client/src/components/TaxiLogo.tsx` - Branded taxi logo component
- `client/src/components/SplashScreen.tsx` - Loading splash screen

## Environment Variables (Secrets)
- `MAPBOX_TOKEN` - Mapbox API token for maps and geocoding
- `DISPATCH_PASSCODE` - Admin passcode for dispatch login
- `DISPATCH_GROUP_CODE` - Shared dispatch code (e.g., NYAC-TAXI-01)

## API Routes
- `POST /api/validate-dispatch-code` - Validates dispatch code for drivers
- `POST /api/dispatch/login` - Dispatch login with passcode + dispatch code
- `POST /api/driver/update-location` - Driver GPS update (every 5s)
- `GET /api/driver/list?dispatchCode=...` - List drivers by dispatch code
- `POST /api/calls/create` - Create call with Mapbox geocoding
- `GET /api/calls/list?dispatchCode=...` - List calls by dispatch code
- `PATCH /api/calls/update-status` - Update call status (NEW/ASSIGNED/DONE)
- `GET /api/mapbox-token` - Get Mapbox token for frontend

## Design Theme
- Taxi yellow (#FFDD00 / hsl(50, 100%, 50%)) background
- Black text and borders
- Bold, blocky typography (Inter font)
- Thick borders, large buttons, high-contrast UI

## User Preferences
- Mobile-first responsive design
- Yellow/black taxi branding throughout
- No dark mode (themed app)
