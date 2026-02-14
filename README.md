# The Taxi Company - Denoko Taxi Dispatch

A hybrid taxi dispatch web application built for **The Taxi Company** (A Denoko Cooperative). Dispatchers manage incoming calls on a live map while drivers share their GPS location in real time from their mobile devices.

## Features

### Driver Mode
- Enter your name and dispatch code to join a dispatch group
- Share your live GPS location with dispatchers (updates every 5 seconds)
- Start/stop location sharing at any time
- Mobile-first responsive design

### Dispatch Mode
- Secure login with passcode and dispatch group code
- Live Mapbox map showing all active driver locations in real time
- Create call pins with customer name, phone number, and address
- Address autocomplete powered by Mapbox Geocoding API (US addresses)
- "Picked Up" button to mark calls as completed
- Green map markers for completed calls, yellow for active
- Stats header showing active and completed call counts
- Active calls sorted first, completed calls at the bottom
- Call details panel with full customer info and status management
- View driver list with last-seen timestamps
- Auto-refreshing dashboard (3-second polling)

### Call Workflow
1. Dispatcher enters customer name, phone number, and address
2. Address autocomplete suggests matching US addresses
3. Selecting an address previews a pin on the map
4. "Drop Pin" creates the call and adds it to the live map
5. "Picked Up" marks the call as completed (pin turns green)

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Wouter (routing), TanStack Query
- **Backend:** Express.js (Node.js)
- **Maps:** Mapbox GL JS
- **Storage:** In-memory (MVP)

## Environment Variables

| Variable | Description |
|---|---|
| `MAPBOX_TOKEN_PUBLIC` | Mapbox public access token (`pk.*`) for map display and geocoding |
| `MAPBOX_TOKEN_SECRET` | Mapbox secret access token (`sk.*`) for server-side operations |
| `DISPATCH_PASSCODE` | Admin passcode for dispatch login |
| `DISPATCH_GROUP_CODE` | Shared dispatch group code (e.g., `NYAC-TAXI-01`) |
| `SESSION_SECRET` | Session secret for Express |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/validate-dispatch-code` | Validates dispatch code for drivers |
| `POST` | `/api/dispatch/login` | Dispatch login with passcode + dispatch code |
| `POST` | `/api/driver/update-location` | Driver GPS update (every 5s) |
| `GET` | `/api/driver/list` | List drivers by dispatch code |
| `POST` | `/api/calls/create` | Create call with customer name, phone, and address |
| `GET` | `/api/calls/list` | List calls by dispatch code |
| `PATCH` | `/api/calls/update-status` | Update call status (NEW / ASSIGNED / DONE) |
| `GET` | `/api/mapbox-token` | Get Mapbox public token for frontend |
| `GET` | `/api/geocode/autocomplete` | Address autocomplete (US-only, Mapbox Geocoding API) |

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set the environment variables listed above
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5000`

## How It Works

1. **Drivers** open the app on their phone, enter their name and the dispatch group code, then tap "Start Sharing" to begin broadcasting their GPS location.

2. **Dispatchers** log in with the admin passcode and dispatch code. They see all active drivers on a live map and can create calls by entering the customer's name, phone number, and address (with autocomplete). Each call appears as a yellow pin on the map. When a customer is picked up, the dispatcher taps "Picked Up" and the pin turns green.

## Design

Custom taxi-themed UI featuring bold yellow (`#FFDD00`) and black branding with thick borders, large buttons, and high-contrast typography using the Inter font family. Designed mobile-first for use by drivers on the go.

## License

Proprietary - The Taxi Company (A Denoko Cooperative)
