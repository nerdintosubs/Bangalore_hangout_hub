# BLR Hangout Hub — Minimum Backend (No Cloud API) That Scales Later

Goal: Stand up a compact, production-ready backend that avoids third‑party “cloud APIs” (especially for messaging), preserves current UX/SEO, and leaves a clean path to scale.

This design assumes the public site is hosted at https://blrhangouthub.com and the API at https://api.blrhangouthub.com (or /api behind Nginx). WhatsApp Business contact: +91 7068344125. No WhatsApp Cloud API used; we rely on deep links to wa.me and in-house logging.

---------------------------------------------------------------------

## 1) Architecture Overview

- Runtime: Node.js (LTS) + Fastify (or Express) with TypeScript
- ORM: Prisma
- DB:
  - MVP: SQLite (single file; simplest ops) OR Postgres from day 1 (preferred for growth)
  - Recommendation: Postgres on a small VM (or managed Postgres if you’re okay with managed infra; still not a “cloud messaging API”)
- Auth: JWT (access + refresh) for admin/therapist portals; stateless
- Storage: Local disk for now (KYC uploads) with signed one-time download URLs; later swap to S3/R2
- Jobs: Node-cron (daily pass rotation, cleanup); later swap to Redis + BullMQ if needed
- Security: Helmet, CORS allowlist (blrhangouthub.com), rate limiter, input validation (zod)
- Observability: Pino logs (JSON), health check /health, uptime alerts via a simple cron ping (e.g., healthchecks.io – optional)
- Reverse proxy: Nginx (TLS termination, HTTP→HTTPS, static caching)
- Deployment: 
  - Single small VM (2 vCPU, 2–4 GB RAM) running:
    - Nginx (front)
    - Node service via systemd/PM2
    - Postgres (if self‑hosted) or SQLite file
  - CI: GitHub Actions (build, test, migrate, deploy via SSH)

Why this stack
- Zero vendor lock for messaging; WhatsApp deep links keep you compliant without Cloud API.
- Small footprint (single VM) but clear path to Postgres + Redis as you scale.
- Prisma lets you start on SQLite and migrate to Postgres with minimal changes.

---------------------------------------------------------------------

## 2) Core Features (MVP)

Public/Customer
- Daily Availability (server‑gated): GET /v1/availability/day/:date?pass=XXXX
- Booking Request: POST /v1/bookings (name, phone, zone, preferred_time, notes) → logs request + returns a wa.me deep link to 7068344125 prefilled with context; optionally emails ops (SMTP) — no third‑party API
- WhatsApp Click Logger: GET /v1/click/whatsapp?src=hero&type=therapist&id=t1 → logs source, returns 302 to wa.me/917068344125?text=...

Admin (password/JWT)
- Availability Admin:
  - POST /v1/admin/availability/day { date, pass, note }
  - POST /v1/admin/availability/day/:id/publish
  - POST /v1/admin/availability/day/:id/assign { therapist_id, shift }
- Therapists Admin:
  - POST /v1/admin/therapists (create)
  - PATCH /v1/admin/therapists/:id (verify, zones, shifts)
  - GET /v1/admin/therapists (list with filters)
- Bookings Admin:
  - GET /v1/admin/bookings (filters)
  - POST /v1/admin/bookings/:id/assign { therapist_id }
  - POST /v1/admin/bookings/:id/status { status }
- Content Admin:
  - CRUD for Services/FAQ if you later move these server‑driven

Auth
- POST /v1/auth/login (admin email + password; or single admin password for MVP)
- POST /v1/auth/refresh, POST /v1/auth/logout

Utilities
- GET /v1/health (liveness)

---------------------------------------------------------------------

## 3) Data Model (Prisma)

You can begin with SQLite and later switch to Postgres. Minimal schema:

```prisma
// schema.prisma
datasource db {
  provider = "sqlite"  // switch to "postgresql" later
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum BookingStatus {
  PENDING
  MATCHED
  ACCEPTED
  CONFIRMED
  COMPLETED
  CANCELED
}

model User {
  id           String  @id @default(cuid())
  email        String  @unique
  passwordHash String
  role         String  // "admin" | "therapist" | "customer"
  createdAt    DateTime @default(now())
}

model Therapist {
  id              String   @id @default(cuid())
  name            String
  isFresher       Boolean  @default(false)
  experienceYears Int      @default(0)
  specialties     String   // CSV tags
  certifications  String   // CSV tags
  bio             String?
  verified        Boolean  @default(false)
  photoUrl        String?
  willingToRelocate Boolean @default(false)
  zones           String   // CSV zones: "Koramangala,Indiranagar"
  shifts          String   // CSV: "Morning (7–12),Evening (5–10)"
  rating          Float?   // optional
  userId          String?  // link if therapist gets a login later
  createdAt       DateTime @default(now())
}

model Zone {
  id   String @id @default(cuid())
  name String @unique
}

model AvailabilityDay {
  id        String   @id @default(cuid())
  date      DateTime
  passCode  String
  note      String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  items     AvailabilityAssignment[]
}

model AvailabilityAssignment {
  id                String @id @default(cuid())
  availabilityDayId String
  therapistId       String
  shift             String   // e.g., "Morning (7–12)"
  AvailabilityDay   AvailabilityDay @relation(fields: [availabilityDayId], references: [id])
  Therapist         Therapist       @relation(fields: [therapistId], references: [id])
}

model Booking {
  id          String   @id @default(cuid())
  customerName String
  customerPhone String
  zone         String
  preferredTime String
  notes         String?
  status        BookingStatus @default(PENDING)
  therapistId   String?
  createdAt     DateTime @default(now())
}

model ClickLog {
  id        String   @id @default(cuid())
  src       String   // "hero", "header", "sticky-cta", "therapist-card", "pricing", etc
  type      String   // "therapist", "generic"
  refId     String?  // therapist id if applicable
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())
}
```

Later improvements:
- Normalize specialties/certifications/zones with join tables
- Add Reviews, AuditLog, and KYC file references

---------------------------------------------------------------------

## 4) Endpoint Sketches

Availability (public gated)
```ts
// GET /v1/availability/day/:date?pass=XXXX
// returns safe subset: name, photoUrl, specialties, zones, rating
```

Click Logger (tracks attribution, redirects to WhatsApp)
```ts
// GET /v1/click/whatsapp?src=pricing&type=therapist&id=t1&msg=...
// 1) save log { src, type, refId, ip, ua }
// 2) 302 redirect to wa.me/917068344125?text=<encoded msg>
```

Booking Request (no external API)
```ts
// POST /v1/bookings { name, phone, zone, preferredTime, notes }
// 1) save Booking(PENDING)
// 2) return { waLink: "https://wa.me/917068344125?text=..." }
// optional: send email over SMTP to ops@ (not a third‑party API; direct SMTP)
```

Admin Auth
```ts
// POST /v1/auth/login { email, password } => { accessToken, refreshToken }
// POST /v1/auth/refresh
// Use JWT middleware for /v1/admin/*
```

Admin Availability
```ts
// POST /v1/admin/availability/day { date, passCode, note }
// POST /v1/admin/availability/day/:id/assign { therapistId, shift }
// POST /v1/admin/availability/day/:id/publish
```

Therapists Admin
```ts
// POST /v1/admin/therapists { name, zones, shifts, ... }
// PATCH /v1/admin/therapists/:id { verified, zones, shifts, photoUrl, ... }
// GET /v1/admin/therapists?zone=Koramangala&verified=true
```

---------------------------------------------------------------------

## 5) Security & Compliance

- HTTPS everywhere via Nginx + Let’s Encrypt
- Helmet, CORS allowlist
- JWT + refresh rotation; revoke on logout (short TTLs)
- Rate limit /auth and public read endpoints
- Validation via zod; reject unsafe inputs; sanitize error messages
- Logs: Pino JSON to files; rotate daily
- Backups: Daily DB dump (sqlite file copy or pg_dump)
- KYC files: store outside webroot; serve via signed, short‑lived tokens

---------------------------------------------------------------------

## 6) Dev & Deploy

Directory structure:
```
backend/
  package.json
  tsconfig.json
  src/
    server.ts
    routes/
      availability.ts
      bookings.ts
      click.ts
      auth.ts
      admin/
        availability.ts
        therapists.ts
        bookings.ts
    lib/
      prisma.ts
      auth.ts
      validate.ts
      logger.ts
  prisma/
    schema.prisma
.env.example
```

Env (.env):
```
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://blrhangouthub.com
DATABASE_URL="file:./data.db"  # or postgres://user:pass@host:5432/db
JWT_SECRET=change-me
ADMIN_EMAIL=admin@blrhangouthub.com
ADMIN_PASSWORD=change-me
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ops@blrhangouthub.com
SMTP_PASS=app-password
```

Systemd service (if using systemd):
```
[Unit]
Description=BLR API
After=network.target

[Service]
WorkingDirectory=/srv/blr-api
ExecStart=/usr/bin/node dist/server.js
Restart=always
Environment=NODE_ENV=production
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Nginx (reverse proxy):
```
server {
  server_name api.blrhangouthub.com;
  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

CI (GitHub Actions outline):
- on push: install, typecheck, test (if any), prisma generate, build, scp dist/ + PM2/systemd reload via SSH

---------------------------------------------------------------------

## 7) Frontend Integration (No UX regression)

- Replace current client-side availability gate with server call:
  - Frontend calls GET /v1/availability/day/:date?pass=XXXX
  - Render the result; pass never stored in source code
- Replace direct wa.me links with logged redirect:
  - Change href from https://wa.me/917068344125?... to
    https://api.blrhangouthub.com/v1/click/whatsapp?src=pricing&type=therapist&id=t1&msg=...
- Booking form (optional new section or use WhatsApp flow):
  - POST /v1/bookings, then show the returned wa.me link and a copy button

---------------------------------------------------------------------

## 8) Roadmap (Scale Path)

- Swap SQLite → Postgres (update prisma provider + migration)
- Add Redis + BullMQ (jobs: nightly availability rollup, reminders)
- Add Admin UI (Next.js) at https://admin.blrhangouthub.com (uses same API)
- Add Reviews model + publish to site
- Add Razorpay (optional) for pre-auth on peak slots (no “cloud messaging API”)
- If business needs automated messaging later, you can add WhatsApp Cloud API as a separate adapter without touching booking core

---------------------------------------------------------------------

## 9) What You Need to Provide

- Subdomain for API: api.blrhangouthub.com + DNS access (A record to server IP)
- VM credentials (SSH) or approval to set up a managed host
- Admin email/password seed for first login
- Decision: SQLite (fastest) vs Postgres now (recommended)
- If SMTP is desired: mailbox/app-password (or skip SMTP entirely)

---------------------------------------------------------------------

## 10) Build Effort (Phase‑1, minimal)

- Day 1–2: Scaffold backend, Prisma schema, auth, availability (admin + public pass get), click logger, booking request
- Day 3: Wire frontend to use /availability + /click redirect; add booking request (optional)
- Day 4: Nginx + SSL, health checks, CI light; deploy staging → production

This gives you a lean, private backend with zero dependency on cloud messaging APIs, preserves premium UX, and sets a clean runway to scale.