Role-Based Project Management Backend

A secure, invite-only backend API for a role-based admin & project management system built for a mid-level full-stack developer assessment.

## Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- express-validator (request validation)

## Features Implemented (Must-Haves)

- JWT-based authentication
- Invite-only registration (admin-generated tokens, 24h expiration)
- Role-based access control (ADMIN | MANAGER | STAFF)
- Soft delete for projects
- Admin user management (list, change role, activate/deactivate)
- Project CRUD (create by any auth user, edit/delete by ADMIN only)
- Centralized error handling & request validation
- Pagination on users list
- Clean modular architecture (MVC-like)

## Project Structure

src/
├── config/ # Database connection
├── controllers/ # Business logic per resource
├── middlewares/ # Auth, role, logger, error
├── models/ # Mongoose schemas
├── routes/ # Express route definitions
├── seed.ts # Initial admin user seeding
└── index.ts # App entry point
text## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas (or local MongoDB)
- Git

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd backend
npm install
2. Environment Variables
Copy .env.example to .env and fill in values:
Bashcp .env.example .env
Required:

MONGO_URI — MongoDB Atlas connection string
JWT_SECRET — Strong secret (min 32 chars, e.g. openssl rand -hex 32)
PORT (optional, default 5000)

3. Run Development
Bashnpm run dev
4. Seed Initial Admin (one-time)
Bashnpm run seed
Default admin: admin@example.com / adminpassword
5. Build & Production
Bashnpm run build
npm start
API Endpoints Overview
Base: /api
Auth

POST /auth/login
POST /auth/invite (ADMIN)
POST /auth/register-via-invite

Users (ADMIN only)

GET /users?page=1&limit=10
PATCH /users/:id/role
PATCH /users/:id/status

Projects

POST /projects
GET /projects
PATCH /projects/:id (ADMIN)
DELETE /projects/:id (ADMIN – soft delete)

Architecture Decisions & Trade-offs

Mongoose chosen over Prisma/TypeORM for familiarity and MongoDB-native feel.
Email simulation — Invite links logged to console (per task: "email simulation acceptable").
No refresh tokens — Kept simple; access token 1h expiry.
No rate limiting / audit logs — Time-constrained; can be added later.
LocalStorage auth (frontend) — Simple for demo; httpOnly cookies better in prod.
Lean queries — Used for read performance.

Development Notes

Logging: Requests + errors logged with timestamps
Errors: Detailed in development, minimal in production
Validation: express-validator on all inputs

Testing
Manual testing recommended with Postman / Insomnia:

Seed admin → login → get token
Invite new user (check console for link)
Register via token
Create/view projects
Admin manage users/projects

License
MIT

Built for mid-level full-stack assessment – January 2026
text### Final Recommendations
- Add `helmet` → `npm i helmet @types/helmet`
- Set `NODE_ENV=development` in `.env` for detailed errors during testing
- In production: set `NODE_ENV=production`, add real rate limiting (e.g. `express-rate-limit`), refresh tokens if needed
- Commit history: Use conventional commits (e.g. `feat: add request logger`, `refactor: optimize queries with lean()`)

Backend is now more professional, debuggable, and slightly optimized while staying simple and deadline-friendly.

Now you're ready for frontend (Next.js as discussed). Let me know when you want to start it — I can
```
