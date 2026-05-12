# PowerOil MasterChef Nigeria — UGC Campaign Microsite

A full-stack mobile-first UGC campaign microsite built with **React + TypeScript** (frontend) and **Node.js + Express + Prisma + SQLite** (backend).

---

## Features

### Public
- Campaign landing page with hero, steps, entry gallery, and leaderboard preview
- Participant registration with Zod validation and all consent fields
- Public gallery of approved entries with filtering (state, platform, sort)
- Individual participant voting pages with vote form and share functionality
- Full leaderboard with podium for top 3
- Terms & Conditions and Privacy Policy pages

### Admin
- Secure admin login with JWT authentication
- Role-based access (Super Admin, Campaign Manager, Moderator, Viewer)
- Dashboard with live metrics, charts (vote trend, platform breakdown, votes by state)
- Participant moderation table with approve / reject / suspend / disqualify actions
- Moderation log history per participant
- Votes table with fraud score indicators
- Fraud flags management with resolve action
- Campaign settings (toggle registration/voting, set dates, display options)
- CSV exports for participants and votes

### Security & Anti-fraud
- Rate limiting on registration, voting, and login endpoints
- Duplicate vote detection by phone number
- Fraud scoring based on IP, user agent, device fingerprint
- Fraud flags auto-created for high-score votes
- Helmet, CORS, input validation with Zod
- JWT-based admin auth with role middleware

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form, Zod, Recharts |
| Backend    | Node.js 20, TypeScript, Express, Prisma ORM |
| Database   | SQLite (WAL mode) |
| Auth       | JWT + bcrypt/argon2 |

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
cd ugc-masterchef-campaign
npm install          # installs concurrently at root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up the database

```bash
cd backend
npm run db:migrate   # runs Prisma migrations
npm run db:seed      # creates default admin user and campaign settings
```

### 3. Run development servers

From the project root:

```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 4. Access the app

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public campaign site |
| http://localhost:5173/admin/login | Admin panel login |
| http://localhost:4000/health | Backend health check |

### Default Admin Credentials

```
Email:    admin@poweroil.ng
Password: Admin@PowerOil2024!
```

**Change these immediately in production.**

---

## Project Structure

```
ugc-masterchef-campaign/
  backend/
    prisma/
      schema.prisma         # Database schema
    src/
      config/               # App configuration
      db/                   # Prisma client + seed
      middleware/           # Auth, error handler, rate limiter
      modules/
        auth/               # Admin login/logout
        participants/       # Public participant & voting API
        admin/              # Admin moderation API
        analytics/          # Dashboard summary queries
        settings/           # Campaign settings
        exports/            # CSV export routes
      schemas/              # Zod validation schemas
      utils/                # Code generator, fraud scoring
      app.ts                # Express app setup
      server.ts             # Server entry point
  frontend/
    src/
      api/                  # API client functions
      components/
        public/             # Public-facing components
        admin/              # Admin components
      hooks/                # useAuth hook
      layouts/              # PublicLayout, AdminLayout
      pages/
        admin/              # Admin pages
      types/                # TypeScript types
```

---

## Environment Variables

Copy `.env.example` to `backend/.env` and set values.

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default 4000) |
| `DATABASE_URL` | SQLite database file path |
| `FRONTEND_URL` | Frontend URL for CORS |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) |
| `CAMPAIGN_BASE_URL` | Base URL for voting links |

---

## Production Deployment

1. Build the frontend: `cd frontend && npm run build`
2. Serve the `frontend/dist` folder via Nginx/CDN
3. Run the backend with PM2 or Docker
4. Enable HTTPS
5. Schedule SQLite backups
6. Change default admin password

For higher scale, replace SQLite with PostgreSQL by updating `prisma/schema.prisma` datasource.
