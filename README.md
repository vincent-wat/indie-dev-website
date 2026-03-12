# Pippy Studios Website (WIP)

Marketing website for **Pippy Studios**, with a built-in **Playtest Bug Reports** feature for collecting and triaging playtester feedback.
Currently aiming to get a "Minimum Viable Product" (MVP) up and running.

Progress: 
- Day 1: Project Setup (Ubuntu setup + installing packages + docker desktop + etc.)
- Day 2: Setup Postgres database, seeded demo accounts, POST request for login
- Day 3: Implemented JWT token modules, added BugReport model and migrated into database, POST request for bugs
- Day 4: GET requests for bugs based on role permissions, PATCH requests for updating status on bugs
---

## Project Details
This repo contains:
- A public-facing marketing site for Pippy Studios (home, about)
- A private playtest portal where users can:
  - log in
  - submit bug reports
  - view their submitted reports
- A staff triage workflow where staff/admin can:
  - view all bug reports
  - update bug status (triage pipeline)

---

## Tech Stack
- Frontend: **Next.js (React) + TypeScript** (`apps/web`)
- Backend: **Node.js + Express + TypeScript** (`apps/api`)
- Database: **PostgreSQL** (Docker Compose)
- ORM: **Prisma**
- Auth: **JWT** (Bearer token)
- Validation: **Zod**

---

## Repo Structure

web/
- Next.js marketing site + playtest UI

api/
- Express REST API + Prisma

## Demo Accounts
You can use these to test endpoints and permissions.

Password for all demo accounts: password

admin@demo.com (admin)

staff@demo.com (staff)

tester@demo.com (playtester)

## Current API
**Health**

- GET /health (Already provided)

**Login Auth**

- POST /auth/login

**Bug Reports**

- POST /playtest/bugs (auth required)

- GET /playtest/bugs (auth required)

- PATCH /playtest/bugs/:id/status (staff/admin only)

## Testing the API
**Login (You can get your JWT token here)**

curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@demo.com","password":"password"}'

**Display Bug List**

curl -s http://localhost:4000/playtest/bugs \
  -H "Authorization: Bearer (TOKEN)"

**Create Bug Report**

curl -s -X POST http://localhost:4000/playtest/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer (TOKEN)" \
  -d '{"title":"Inventory freezes","description":"Game freezes when opening inventory after 10 minutes.","severity":"high"}'

**Update Status of a Bug**

curl -s -X PATCH http://localhost:4000/playtest/bugs/<BUG_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer (STAFF/ADMIN TOKEN)" \
  -d '{"status":"triaged"}'


