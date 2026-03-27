# NexMeet — Where Every Check-In Counts

A modern, full-featured **event & attendance tracking platform** built with Next.js 14, featuring QR code check-ins, real-time analytics, gamification, and comprehensive reporting.

NexMeet goes beyond simple attendance tracking — it turns every event into an engaging experience with points, leaderboards, achievement badges, and instant feedback.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | Custom shadcn/ui-style components with glassmorphism |
| **Database** | SQLite + Prisma ORM |
| **Authentication** | NextAuth v5 (Attendees) + JWT via jose (Organizers) |
| **Charts** | Recharts |
| **QR Code** | react-qr-code (generation) + @zxing/browser (scanning) |
| **Data Export** | SheetJS (xlsx) |
| **Animations** | CSS keyframes + Framer Motion |
| **Icons** | Lucide React |

---

## Features Overview

### For Attendees

| Feature | Description |
|---------|-------------|
| **QR Code Profile** | Each attendee gets a unique 7-character code with a scannable QR code |
| **Event Calendar** | Month/week view with color-coded events and attendance markers |
| **Attendance History** | Full record of all check-ins with search and filtering |
| **Event Ratings** | Rate attended events with 1-5 stars and written feedback |
| **Gamification** | Earn points for attending events (10 pts regular, 20 pts featured) |
| **Leaderboard** | Compete with other attendees for top rankings |
| **Achievement Badges** | Unlock 10 different badges (First Steps, Week Warrior, Early Bird, etc.) |
| **Dashboard** | Points/level card, attendance heatmap, pie charts, recent activity |
| **Dark/Light Mode** | Toggle between themes with system preference detection |

### For Organizers

| Feature | Description |
|---------|-------------|
| **QR Scanner** | Camera-based QR scanning or manual 7-character code entry |
| **Event Management** | Create, edit, delete events with type, location, capacity, and featured flag |
| **Capacity Tracking** | Set max capacity with live color-coded progress bars |
| **Live Activity Feed** | Real-time check-in stream that auto-refreshes every 10 seconds |
| **Analytics Dashboard** | Animated stat counters, weekly trends, event type distribution |
| **Reports & Export** | Date range reports with 6-sheet Excel export |
| **Toast Notifications** | Instant visual feedback on check-in success/failure |

---

## Pages & Routes

### Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Landing Page** | Stunning animated hero with gradient mesh, floating orbs, feature showcase, testimonials, and stats |
| `/login` | **Attendee Login** | Email/password authentication with glassmorphism design |
| `/register` | **Register** | New attendee registration with auto sign-in |
| `/host/login` | **Organizer Login** | Separate JWT-based authentication for event organizers |

### Attendee Pages (Protected)

| Route | Page | Description |
|-------|------|-------------|
| `/user/profile` | **Profile** | QR code display, unique code, quick stats (events/streak/badges), earned badges list, account info |
| `/user/calendar` | **Calendar** | Interactive month/week toggle calendar with color-coded event dots, attendance checkmarks, and day-detail panel |
| `/user/attendance` | **Attendance History** | Searchable list of all check-ins with event details, type badges, and "Rate Event" buttons for past events |
| `/user/leaderboard` | **Leaderboard** | Top 20 rankings with gold/silver/bronze podium for top 3, animated point counters, level badges, streak/badge counts |
| `/user/dashboard` | **Dashboard** | Points & level progress card, animated stat counters, GitHub-style attendance heatmap, achievement badges grid, attendance-by-type pie chart, recent activity feed |

### Organizer Pages (Protected)

| Route | Page | Description |
|-------|------|-------------|
| `/host/scan` | **QR Scanner** | Camera mode with live viewfinder + manual code entry, event auto-selection, toast notifications on scan results |
| `/host/events` | **Event Management** | Filterable event list with date/type filters, create dialog (title, description, type, location, capacity, featured), capacity bars, delete with confirmation |
| `/host/activity` | **Live Feed** | Real-time check-in stream with user avatars, event badges, relative timestamps, auto-refresh indicator |
| `/host/reports` | **Reports** | Date range picker, summary stats, bar charts (by day/hour), line chart (daily trend), top events table, type breakdown, 6-sheet Excel export |
| `/host/dashboard` | **Dashboard** | Animated stat counters (events/check-ins/active users/upcoming), weekly trend bar chart, event type donut chart, recent check-ins list |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/[...nextauth]` | NextAuth handlers (attendee auth) |
| `POST` | `/api/host/login` | Organizer login (returns JWT cookie) |
| `POST` | `/api/host/logout` | Organizer logout (clears cookie) |
| `GET` | `/api/host/me` | Get current organizer info |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | List events (filters: date, type, hostId) |
| `POST` | `/api/events` | Create event (organizer auth) |
| `GET` | `/api/events/[id]` | Get event with attendees |
| `PUT` | `/api/events/[id]` | Update event |
| `DELETE` | `/api/events/[id]` | Delete event and attendance records |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attendance` | List attendance records |
| `POST` | `/api/attendance` | Check-in (code + eventId), validates capacity, awards points |
| `GET` | `/api/attendance/my` | Current user's attendance history |

### Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leaderboard` | Top 20 users by points |
| `GET` | `/api/badges` | User's earned badges |
| `GET/POST` | `/api/ratings` | Event ratings (GET: list, POST: submit + earn 5 bonus pts) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/user` | Attendee stats (totals, streak, by-type, recent) |
| `GET` | `/api/dashboard/host` | Organizer stats (totals, weekly trend, recent check-ins) |
| `GET` | `/api/reports` | Full report data with date range filter |
| `GET` | `/api/activity` | Live activity feed (last 20 check-ins) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Register new attendee |

---

## Database Schema

```
User          Host            Event           Attendance      Rating          Badge
-----         -----           -----           ----------      ------          -----
id            id              id              id              id              id
name          name            title           userId          userId          userId
email         email           description     eventId         eventId         type
password      password        type            checkedIn       score           name
code (unique) organization    location        points          comment         earnedAt
points                        startTime       createdAt       createdAt
level                         endTime
streak                        capacity
bio                           featured
                              hostId
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/hillystallion/nexmeet.git
cd nexmeet

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push database schema and seed with sample data
npm run setup
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
HOST_JWT_SECRET="your-host-jwt-secret"
```

### Running

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Organizer** | host@example.com | password123 |
| **Organizer** | sarah@example.com | password123 |
| **Attendee** | alice.johnson@example.com | password123 |

> All 30 attendee accounts share the password `password123`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run setup` | Push DB schema + seed data |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Run seed script |
| `npm run db:reset` | Reset database and re-seed |

---

## Sample Data

The seed script creates:

- **3 Organizers** with different organizations
- **30 Attendees** with bios, points, levels, and streaks
- **25 Events** spanning previous week, current week, and next week (with various types, capacities, and featured flags)
- **200+ Attendance records** for past events
- **128 Ratings** with scores and comments
- **37 Achievement badges** distributed among top users

---

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── attendance/         # Check-in endpoints
│   │   ├── auth/               # NextAuth handlers
│   │   ├── badges/             # Badge queries
│   │   ├── dashboard/          # Analytics endpoints
│   │   ├── events/             # Event CRUD
│   │   ├── host/               # Organizer auth
│   │   ├── leaderboard/        # Rankings
│   │   ├── ratings/            # Event feedback
│   │   ├── reports/            # Report generation
│   │   ├── activity/           # Live feed
│   │   └── users/              # User registration
│   ├── host/
│   │   ├── login/              # Organizer login
│   │   └── (protected)/        # Auth-guarded organizer pages
│   │       ├── scan/           # QR scanner
│   │       ├── events/         # Event management
│   │       ├── activity/       # Live feed
│   │       ├── reports/        # Reports & export
│   │       └── dashboard/      # Organizer dashboard
│   ├── user/                   # Auth-guarded attendee pages
│   │   ├── profile/            # QR code & badges
│   │   ├── calendar/           # Event calendar
│   │   ├── attendance/         # History & ratings
│   │   ├── leaderboard/        # Rankings
│   │   └── dashboard/          # Stats & heatmap
│   ├── login/                  # Attendee login
│   ├── register/               # Registration
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/                 # Navigation components
│   │   ├── user-nav.tsx        # Attendee nav (top bar + bottom/side nav)
│   │   └── host-nav.tsx        # Organizer nav
│   ├── ui/                     # Reusable UI components
│   │   ├── animated-counter.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── capacity-bar.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── heatmap.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── star-rating.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── toast.tsx
│   ├── providers.tsx           # Session + Theme + Toast providers
│   └── theme-provider.tsx      # Dark/light mode
├── lib/
│   ├── auth.ts                 # NextAuth v5 configuration
│   ├── host-auth.ts            # JWT host authentication
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # Utilities & constants
├── types/
│   └── next-auth.d.ts          # Type augmentations
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Sample data generator
```

---

## Key Design Decisions

- **Dual Auth System**: NextAuth for attendees (session-based) + JWT cookies for organizers (stateless) — keeps the two portals completely independent
- **SQLite + Prisma**: Zero-config database that works out of the box, perfect for demos and small deployments
- **Route Groups**: `(protected)` route group for organizer pages ensures the login page doesn't inherit the auth-checking layout
- **Server + Client Components**: Server components for layouts and auth checks, client components for interactive pages
- **Custom UI Components**: shadcn/ui-inspired components with glassmorphism, gradient accents, and smooth transitions — no external component library dependency

---

## License

MIT

---

Built with Next.js, Tailwind CSS, Prisma & Recharts
