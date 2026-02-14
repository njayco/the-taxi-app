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
- Create call pins with customer name, phone number, address, and optional fare price
- Address autocomplete powered by Mapbox Geocoding API (US addresses)
- "Picked Up" button to mark calls as completed with fare entry
- Green map markers for completed calls, yellow for active
- Stats header showing active calls, completed calls, and total revenue
- Server-side filtering by status (New/Completed/All) and date range
- Date range presets: Today, Last 7 Days, Last 30 Days, Last 6 Months, Last 12 Months, All Time, or Custom
- Active calls sorted first, completed calls at the bottom
- Call details panel with full customer info, status management, and driver assignment
- Assign/unassign live drivers to calls via dropdown
- View driver list with last-seen timestamps and assigned call count badges
- Driver details panel showing LIVE/OFFLINE status, trips assigned, and revenue generated
- Driver performance stats respect current filters (status + date range)
- Auto-refreshing dashboard (3-second polling for drivers and calls)

### Call Workflow
1. Dispatcher enters customer name, phone number, address, and optional fare price
2. Address autocomplete suggests matching US addresses
3. Selecting an address previews a pin on the map
4. "Drop Pin" creates the call and adds it to the live map
5. Dispatcher assigns the call to a live driver (call status becomes ASSIGNED)
6. "Picked Up" marks the call as completed with optional fare entry (pin turns green)
7. Unassigning a driver resets the call back to NEW status

### Map Features
- Coordinate validation prevents markers from jumping to invalid positions
- Separate marker management for calls and drivers
- Map auto-resizes when panels open/close
- Call popups show customer info, status, and assigned driver
- Driver popups show driver name and last update time

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Wouter (routing), TanStack Query
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL with Drizzle ORM
- **Maps:** Mapbox GL JS

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
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
| `GET` | `/api/driver/stats` | Get driver performance stats (trips, revenue) with filters |
| `POST` | `/api/calls/create` | Create call with customer name, phone, address, and optional fare |
| `GET` | `/api/calls/list` | List calls with server-side filtering (status, date range) |
| `PATCH` | `/api/calls/update-status` | Update call status (NEW / ASSIGNED / DONE) |
| `PATCH` | `/api/calls/assign` | Assign or unassign a driver to a call |
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

2. **Dispatchers** log in with the admin passcode and dispatch code. They see all active drivers on a live map and can create calls by entering the customer's name, phone number, and address (with autocomplete). Each call appears as a yellow pin on the map. Dispatchers can assign drivers to calls, track performance stats, and mark calls as completed when the customer is picked up.

## Database Schema

The `calls` table stores all dispatch call records:

| Column | Type | Description |
|---|---|---|
| `id` | Serial (PK) | Auto-incrementing primary key |
| `dispatch_code` | Text | Dispatch group code |
| `customer_name` | Text | Customer name |
| `customer_phone` | Text | Customer phone number |
| `address` | Text | Pickup address |
| `notes` | Text | Optional notes |
| `lat` / `lng` | Double | GPS coordinates |
| `status` | Text | NEW, ASSIGNED, or DONE |
| `fare_price_cents` | Integer | Fare in cents (nullable) |
| `assigned_driver_id` | Text | Assigned driver ID (nullable) |
| `assigned_driver_name` | Text | Assigned driver name (nullable) |
| `assigned_at` | Timestamp | When driver was assigned (nullable) |
| `created_at` | Timestamp | Call creation time |
| `updated_at` | Timestamp | Last update time |
| `completed_at` | Timestamp | Completion time (nullable) |

Drivers are stored in-memory (ephemeral GPS data, not persisted).

## Design

Custom taxi-themed UI featuring bold yellow (`#FFDD00`) and black branding with thick borders, large buttons, and high-contrast typography using the Inter font family. Designed mobile-first for use by drivers on the go.

## License

Proprietary - The Taxi Company (A Denoko Cooperative)
