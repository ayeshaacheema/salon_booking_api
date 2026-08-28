# Salon Booking API

A production-ready REST API for managing salon services, bookings, users, and reviews. Built as a complete backend system, progressing from basic CRUD and authentication through database persistence, validation, role-based authorization, file uploads, automated testing, structured logging, monitoring, and live deployment.

The API models a realistic salon booking workflow: customers browse services, create bookings, manage their profiles, and leave reviews, while administrators manage salon resources.

## Live Demo

- API: https://salon-booking-api-yckd.onrender.com
- Health check: https://salon-booking-api-yckd.onrender.com/health

Example health check response:

```json
{
  "status": "ok",
  "message": "API is healthy"
}
```

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Role-based access control (RBAC)
- Admin-only resource management
- Full CRUD for salon services
- Booking management
- Service reviews
- PostgreSQL persistence via Sequelize ORM
- Request validation with Zod
- Consistent API error handling
- Filtering, sorting, and pagination
- File uploads with Cloudinary storage
- Structured request and error logging
- Automated unit and integration testing
- Production deployment with environment-based configuration
- Health monitoring with UptimeRobot

## Tech Stack

| Category         | Technology           |
|-------------------|-----------------------|
| Runtime           | Node.js               |
| Framework         | Express.js             |
| Database          | PostgreSQL             |
| ORM               | Sequelize               |
| Authentication    | JWT                      |
| Validation        | Zod                       |
| Testing           | Jest + Supertest          |
| File uploads      | Multer + Cloudinary        |
| Logging           | Pino + pino-http             |
| API hosting       | Render                        |
| Database hosting  | Neon PostgreSQL                |
| Monitoring        | UptimeRobot                     |

## Architecture

```
Client
  |
  v
Express Routes
  |
  +-- Authentication Middleware
  +-- Role Authorization
  +-- Request Validation
  |
  v
Controllers
  |
  v
Models / Sequelize ORM
  |
  v
PostgreSQL
```

Logging and centralized error handling operate as cross-cutting concerns across the request lifecycle.

**Routes** — define public API endpoints and connect requests to controllers and middleware.

**Middleware** — handles authentication, authorization, validation, file processing, logging, and centralized error handling.

**Controllers** — handle HTTP requests and responses, coordinating database operations.

**Models** — represent application entities and relationships via Sequelize.

**PostgreSQL** — persistent relational data storage.

**Validation** — Zod schemas validate incoming request data before it reaches application logic.

**Authentication** — JWT tokens authenticate users and protect private endpoints.

**Authorization** — role-based middleware restricts administrative operations to authorized users.

**Logging** — Pino and pino-http provide structured request and error logs for production troubleshooting.

## Core Resources

**Users** — create an account, log in, access profile, upload a profile picture, authenticate via JWT.

**Services** — bookable salon offerings (haircuts, styling, facials, manicures, etc.). Admins can create, update, and delete services.

**Bookings** — customers create and manage bookings tied to users and services. Supports filtering, sorting, and pagination.

**Reviews** — customers leave reviews for services and retrieve reviews per service.

## Authentication & Authorization

Authentication uses JSON Web Tokens. After login, the API returns a token to be supplied on protected endpoints:

```
Authorization: Bearer <JWT_TOKEN>
```

Roles: `user`, `admin`. Regular users perform customer-level operations; administrative operations (e.g. service management) are restricted to the `admin` role.

## API Endpoints

### Authentication

| Method | Endpoint       | Access |
|--------|----------------|--------|
| POST   | `/auth/signup` | Public |
| POST   | `/auth/login`  | Public |

### Services

| Method | Endpoint        | Access |
|--------|-----------------|--------|
| GET    | `/services`     | Public |
| GET    | `/services/:id` | Public |
| POST   | `/services`     | Admin  |
| PUT    | `/services/:id` | Admin  |
| DELETE | `/services/:id` | Admin  |

`GET /services` supports filtering, sorting, and pagination.

### Bookings

| Method | Endpoint        | Access                  |
|--------|-----------------|--------------------------|
| GET    | `/bookings`     | Protected                |
| POST   | `/bookings`     | Protected                |
| PUT    | `/bookings/:id` | Protected                |
| DELETE | `/bookings/:id` | Protected / Authorized   |

### Reviews

| Method | Endpoint                 | Access    |
|--------|---------------------------|-----------|
| POST   | `/services/:id/reviews`   | Protected |
| GET    | `/services/:id/reviews`   | Public    |

### Users

| Method | Endpoint                  | Access    |
|--------|----------------------------|-----------|
| GET    | `/users/profile`           | Protected |
| POST   | `/users/profile-picture`   | Protected |

### System

| Method | Endpoint  | Purpose          |
|--------|-----------|-------------------|
| GET    | `/`       | API information    |
| GET    | `/health` | Health check         |

## Validation & Error Handling

Incoming data is validated with Zod before reaching application logic. Centralized error handling keeps responses consistent across endpoints, covering:

- Invalid or missing request data
- Authentication and authorization failures
- Missing resources
- Malformed JSON
- File upload errors and invalid file types
- Sequelize validation errors and duplicate records
- Unexpected server errors

## File Uploads

Uploads are handled with Multer and stored via Cloudinary rather than the local filesystem, so the app can run on stateless cloud infrastructure. Used primarily for user profile pictures.

## Filtering, Sorting & Pagination

The bookings endpoint supports query-based retrieval:

```
GET /bookings?page=1&limit=10
```

Filtering and sorting are handled at the database layer using Sequelize.

## Testing

Automated tests use Jest and Supertest, covering both unit and integration scenarios.

**Unit tests** — booking validation, role-based authorization.

**Integration tests** — cover the full request path (route → middleware → auth → validation → database → response), including signup, login, JWT authentication, booking creation, profile retrieval, service review retrieval, and invalid input/credentials/resources.

Run tests:

```bash
npm test
```

Current result:

```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
```

## Database

PostgreSQL with Sequelize as the ORM. Relationships between core resources:

```
User
 |
 +----< Booking >---- Service
 |                        |
 +------- Reviews >-------+
```

Sequelize handles model definitions, relationships, queries, validation integration, and database synchronization. Production database is hosted on Neon.

## Production Deployment

Deployed on Render, with PostgreSQL hosted on Neon.

```
Client -> Render (Node + Express) -> Neon (PostgreSQL)
```

Configuration is environment-variable based rather than hardcoded.

## Environment Variables

Create a `.env` file for local development:

```env
PORT=3000

DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=

JWT_SECRET=
JWT_EXPIRES_IN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit `.env` files or production secrets to GitHub.

## Local Development

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd salon-booking-api
```

Install dependencies:

```bash
npm install
```

Configure environment variables in `.env`, then start the server:

```bash
npm run dev
# or
npm start
```

The API runs at `http://localhost:3000`, with health check at `http://localhost:3000/health`.

## Production Reliability

**Environment-based configuration** — secrets and deployment-specific settings come from environment variables.

**Process error handling** — the app handles `uncaughtException`, `unhandledRejection`, database startup failures, and application startup failures. Unrecoverable failures cause the process to exit so the hosting platform can restart it.

**Structured logging** — Pino and pino-http log HTTP method, request URL, response status, request duration, and error details/stack traces.

## Health Monitoring

```
GET /health
```

Monitored externally via UptimeRobot to confirm the production API stays reachable.

## Project Screenshots

- Automated tests: `screenshots/integration-and-unit-tests-passed.png`
- Render deployment: `screenshots/render-deployment.png`
- Health check: `screenshots/health-check.png`
- Uptime monitoring: `screenshots/uptimerobot-monitor.png`

## Project Requirements

### Core backend requirements

- [x] Node.js/Express setup
- [x] REST API
- [x] CRUD operations
- [x] PostgreSQL persistence
- [x] Sequelize ORM
- [x] Authentication
- [x] Protected routes
- [x] Role-based authorization
- [x] Input validation
- [x] Consistent error handling
- [x] Related resources
- [x] Filtering, sorting, pagination
- [x] File uploads
- [x] Automated testing
- [x] API documentation
- [x] Production deployment
- [x] Environment variables
- [x] Structured logging
- [x] Health monitoring

### Production / stretch features

- [x] File uploads
- [x] Filtering, sorting, pagination
- [x] Structured logging
- [x] Cloud file storage
- [x] Production deployment
- [x] Uptime monitoring

## Internship Task Progress

| Stage  | Focus                                        | Status    |
|--------|-----------------------------------------------|-----------|
| Week 1 | Environment, Git & first API                    | Completed |
| Week 1 | In-memory CRUD API                                | Completed |
| Week 2 | Authentication                                     | Completed |
| Week 2 | PostgreSQL persistence                              | Completed |
| Week 3 | Validation & error handling                          | Completed |
| Week 3 | Relationships, filtering & pagination                 | Completed |
| Week 4 | File upload & storage                                   | Completed |
| Week 4 | Role-based access control                                | Completed |
| Week 5 | Automated testing & API documentation                      | Completed |
| Week 5 | Production deployment, logging & monitoring                  | Completed |

## Key Backend Concepts Demonstrated

RESTful API design, Express middleware architecture, JWT authentication, RBAC authorization, PostgreSQL relational databases, Sequelize ORM, data validation, error handling, database relationships, pagination and filtering, file upload processing, cloud storage, automated and integration testing, structured logging, environment configuration, cloud deployment, health checks, and application monitoring.

## Project Structure

```
salon-booking-api/
├── config/
│   └── database.js
├── controllers/
├── middleware/
│   ├── auth.js
│   ├── authorizeRoles.js
│   └── validate.js
├── models/
├── routes/
├── schemas/
├── test/
│   ├── auth.test.js
│   ├── authorize.test.js
│   ├── bookingValidator.test.js
│   └── setup.js
├── utils/
│   └── logger.js
├── screenshots/
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

The exact structure may vary slightly depending on final project organization.

## Future Improvements

- Swagger / OpenAPI documentation
- Rate limiting
- Automated CI/CD pipeline
- Docker containerization
- Background jobs
- Email notifications
- Booking conflict prevention
- More comprehensive test coverage
- Advanced search
- Appointment availability management

## Author

**Ayesha Cheema**

Computer Science student interested in backend development, artificial intelligence, machine learning, and computer vision.

## Summary

The Salon Booking API evolved from a simple CRUD application into a deployed backend system with authentication, authorization, database persistence, validation, relationships, file storage, testing, logging, monitoring, and production deployment — covering the full backend development lifecycle from idea to REST API, CRUD, database, auth, validation, relationships, file storage, testing, logging, deployment, and monitoring.
