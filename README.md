# learning-management-system
A full-stack Learning Management System (LMS) built using Node.js, Express, and MongoDB, featuring role-based authentication, course management, quizzes, enrollment, and real-time learning progress tracking.
# LMS (Learning Management System)

Production-ready LMS built with **Node.js**, **Express**, **MongoDB**, **JWT**, and both **EJS** (server-rendered) plus **React** (SPA) frontends. The project follows MVC, clean-code practices, and RESTful APIs to manage courses, lessons, enrollments, assignments, and submissions.

## Features

-  Role-based authentication (Admin, Instructor, Student) with JWT
-  Access + refresh tokens, session revocation, device tracking, and rate-limited auth routes
-  Forgot password + secure reset flows via SMTP
-  Rich course catalog (courses → chapters → lessons) with preview lessons and resource links
-  Lesson-level quizzes, multiple-choice questions, shuffled ordering, and auto-graded attempt history
-  Assignments, student submissions, and grading workflows
-  Enrollment tracking with progress updates
-  Multer-powered uploads with optional Cloudinary storage for thumbnails/media
-  Modular architecture (controllers, services, models, middlewares)
-  Dual UI options: EJS templates + Vite React SPA (silent token refresh)
-  Automated integration tests (Jest + Supertest + Mongo Memory Server)
-  Container-ready (API + SPA + Mongo via docker-compose)

 Tech Stack

- Runtime: Node.js 20+
- *Framework*: Express 5
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT, bcrypt
- **Views**: EJS + vanilla CSS
- **SPA**: React 19, Vite, Axios, React Router
- **Testing**: Jest, Supertest, mongodb-memory-server

# Folder Structure

```
src/
  app.js               # Express app bootstrap
  server.js            # HTTP server + DB start
  config/db.js         # Mongo connection helper
  constants/roles.js   # Role definitions
  controllers/         # Route controllers (REST + EJS)
  services/            # Business logic + DB access
  routes/              # API + view routers
  middlewares/         # Auth, error, validators
  models/              # Mongoose schemas
  utils/               # ApiError/Response, logger
  views/               # EJS templates
public/css/            # Stylesheet for server-rendered UI
client/                # React SPA (Vite + React Router + Axios)
scripts/               # Deployment helpers
env.example            # Copy to .env with your secrets
docker-compose.yml     # Production-style stack (Mongo + API + SPA)
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   npm install --prefix client
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   cp client/env.example client/.env
   # Update MONGO_URI, JWT_SECRET/REFRESH, SMTP creds, Cloudinary keys, rate-limit opts, VITE_API_URL, etc.
   ```

3. **Seed local data (optional but helpful)**
   ```bash
   npm run seed
   ```

4. **Run both API + React client with hot reload**
   ```bash
   npm run dev
   # API -> http://localhost:4000 | SPA -> http://localhost:5173
   ```

5. **Other useful commands**
   ```bash
   npm run dev:server      # Express + EJS only
   npm run dev:client      # React SPA only
   npm run build:client    # Production React build
   npm start               # Production API start
   ```

## Key Scripts

| Script               | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Concurrent API + React dev servers            |
| `npm run dev:server` | Nodemon-powered Express API                   |
| `npm run dev:client` | Vite dev server for React SPA                 |
| `npm run seed`       | Populate MongoDB with demo data               |
| `npm test`           | Jest + Supertest integration suite            |
| `npm run build:client` | Production React build                      |
| `npm start`          | Production API start                          |

## REST API Overview

Base path: `/api/v1`

| Method | Endpoint                           | Description                                      | Roles |
| ------ | ---------------------------------- | ------------------------------------------------ | ----- |
| POST   | `/auth/register`                   | Register new user                                | Public |
| POST   | `/auth/login`                      | Login and receive tokens                         | Public |
| POST   | `/auth/logout`                     | Revoke refresh token                             | Auth |
| POST   | `/auth/refresh-token`              | Rotate refresh token                             | Public |
| POST   | `/auth/forgot-password`            | Send reset email                                 | Public |
| POST   | `/auth/reset-password`             | Reset password via token                         | Public |
| GET    | `/auth/me`                         | Get current user profile                         | Auth |
| PUT    | `/auth/me`                         | Update profile                                   | Auth |
| PATCH  | `/auth/change-password`            | Change password                                  | Auth |
| GET    | `/courses`                         | List courses (filterable by status/instructor)   | Public |
| POST   | `/courses`                         | Create course + thumbnail                        | Admin/Instructor |
| GET    | `/courses/:id`                     | Get course + chapters + lessons                  | Public |
| PUT    | `/courses/:id`                     | Update course metadata/thumbnail                 | Admin/Instructor |
| PATCH  | `/courses/:id/status`              | Change course status (draft/published/locked)    | Admin/Instructor |
| DELETE | `/courses/:id`                     | Remove course                                    | Admin/Instructor |
| POST   | `/chapters`                        | Create chapter                                   | Admin/Instructor |
| GET    | `/chapters/course/:courseId`       | List chapters for a course                       | Auth |
| POST   | `/lessons`                         | Add lesson to a chapter                          | Admin/Instructor |
| GET    | `/lessons/:courseId`               | List lessons (optional `?chapterId=` filter)     | Public |
| POST   | `/quizzes`                         | Create/update quiz for a lesson                  | Admin/Instructor |
| GET    | `/quizzes/:id`                     | Fetch quiz (answers hidden for students)         | Auth |
| DELETE | `/quizzes/:id`                     | Delete quiz                                      | Admin/Instructor |
| POST   | `/attempts/quiz/:quizId`           | Submit quiz attempt                              | Student |
| GET    | `/attempts/me`                     | View my quiz attempts                            | Auth |
| GET    | `/attempts/quiz/:quizId`           | View attempts for a quiz                         | Admin/Instructor |
| POST   | `/enrollments`                     | Enroll in a course                               | Student |
| GET    | `/enrollments`                     | List enrollments                                 | Auth |
| PATCH  | `/enrollments/:id/progress`        | Update student progress                          | Admin/Instructor |
| POST   | `/assignments`                     | Create assignment                                | Admin/Instructor |
| POST   | `/assignments/submissions`         | Submit assignment                                | Student |
| PATCH  | `/assignments/submissions/:id`     | Grade submission                                 | Admin/Instructor |

> Full request/response samples live in the controller logic and can be explored via Postman or tools such as Thunder Client.

## Authentication & Session Workflow

- Access tokens are short-lived and signed with `JWT_SECRET`.
- Refresh tokens are signed with `JWT_REFRESH_SECRET`, hashed per device, and rotated on every refresh/logout.
- Forgot/reset password flow issues single-use, 15-minute tokens and clears existing sessions after completion.
- `authMiddleware` ensures requests include a valid access token; `roleMiddleware` gates role-specific routes; `/api/v1/auth/*` endpoints are protected by rate limiting.

## Course Hierarchy, Quizzes & Attempts

- Courses contain ordered **chapters**, which contain ordered **lessons**. Lessons support video URLs, long-form text, downloadable resources, preview flags, and optional quizzes.
- Quizzes are multiple-choice with configurable pass scores, attempt limits, question shuffling, and time limits. Student-facing payloads hide correct answers while instructors/admins see the full record.
- Attempts are auto-graded, persisted in `AttemptHistory`, and exposed through `/attempts/me` (students) and `/attempts/quiz/:quizId` (staff) for analytics.

## File Uploads

- Course thumbnails can be uploaded alongside create/update requests. Multer handles in-memory parsing, and uploads are sent to Cloudinary when `CLOUDINARY_*` environment variables are set, otherwise they fall back to `public/uploads`.
- Existing thumbnails are automatically deleted when replaced or when a course is removed.

## React SPA Improvements

- Axios interceptors perform silent access-token refreshes; 401 responses trigger `/auth/refresh-token`, update both tokens, and retry the original request seamlessly.
- Failed refresh clears local storage so the UI can prompt for re-auth without stale sessions.

## Frontend Options

**EJS (server-rendered)**

- `/` – Public home page that lists published courses
- `/dashboard` – Authenticated dashboard summarizing enrollments
- Styles in `public/css/styles.css`

**React SPA (Vite)**

- Screens: catalog (Home), Login, Register, Dashboard, Course Detail
- Global auth context (JWT storage + Axios interceptors)
- Configure API base via `client/.env` (`VITE_API_URL`)
- Production build served via `client/Dockerfile` (Nginx)
## Testing

End-to-end style API tests run with Jest and Supertest against an in-memory MongoDB instance:

```bash
npm test
```

Add more tests under `tests/` to cover new features.

## Deployment

- `Dockerfile` – Express API (Node 20)
- `client/Dockerfile` – React SPA build + Nginx
- `docker-compose.yml` – Mongo + API + SPA stack
- `scripts/deploy.sh` / `scripts/deploy.ps1` – helper scripts

Typical flow:

```bash
./scripts/deploy.sh      # macOS/Linux
./scripts/deploy.ps1     # Windows PowerShell
docker compose up -d     # Manual alternative
```

Expose API on port `4000` and SPA on `5173/80`. Inject `MONGO_URI`, `JWT_SECRET`, and `VITE_API_URL` via your hosting platform.

## Sample Accounts (`npm run seed`)

| Role       | Email                | Password      |
| ---------- | -------------------- | ------------- |
| Admin      | `admin@lms.dev`      | `Password123!`|
| Instructor | `instructor@lms.dev` | `Password123!`|
| Student    | `student@lms.dev`    | `Password123!`|

Use these to explore admin/instructor/student flows quickly.

## Production Hardening Checklist

- Configure proper CORS origins
- Set robust JWT secret & rotation policy
- Attach rate limiting / request logging
- Enable HTTPS (behind a proxy or load balancer)
- Add centralized monitoring and alerting

## Contributing

1. Fork / branch
2. Add or update features with tests
3. Run `npm run dev` to verify
4. Submit PR describing changes

Enjoy building on top of this LMS foundation! 🎓

