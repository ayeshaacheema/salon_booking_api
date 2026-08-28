# Salon Booking API

A production-oriented REST API for managing salon services, customer bookings, users, and reviews.

This project was built to demonstrate the complete backend development lifecycle — from REST API design and PostgreSQL persistence to authentication, authorization, validation, testing, structured logging, cloud storage, deployment, and monitoring.

The system models a realistic salon workflow:

* Customers can create accounts, browse services, create and manage bookings, manage their profiles, and leave reviews.
* Administrators can manage the salon's services through protected CRUD endpoints.
* The API is deployed to the cloud with a managed PostgreSQL database, external file storage, structured logging, and uptime monitoring.

> **Project goal:** Build a backend that resembles a small real-world product rather than a collection of isolated CRUD endpoints.

---

## Live API

**Base URL:**
[https://salon-booking-api-yckd.onrender.com](https://salon-booking-api-yckd.onrender.com?utm_source=chatgpt.com)

**Health Check:**
[https://salon-booking-api-yckd.onrender.com/health](https://salon-booking-api-yckd.onrender.com/health?utm_source=chatgpt.com)

Example response:

```json
{
  "status": "ok",
  "message": "API is healthy"
}
```

---

# Features

### Authentication & Security

* User registration and login
* JWT-based authentication
* Protected routes
* Role-based access control
* Admin-only service management
* Authorization checks for protected resources
* Environment-based secret configuration

### Core Product Features

* Full CRUD for salon services
* Booking creation and management
* Service reviews
* User profile management
* Profile picture uploads
* User/service/booking/review relationships
* Filtering, sorting, and pagination

### Backend Engineering

* PostgreSQL persistence
* Sequelize ORM
* Zod request validation
* Centralized error handling
* Structured request logging
* Cloudinary file storage
* Automated unit and integration testing
* Production deployment
* Health monitoring

---

# Architecture

The API follows a layered architecture:

```text
                         Client
                           |
                           v
                    Express Routes
                           |
              +------------+------------+
              |            |            |
              v            v            v
        Authentication   RBAC       Validation
         Middleware     Middleware     (Zod)
              |            |            |
              +------------+------------+
                           |
                           v
                      Controllers
                           |
                           v
                  Sequelize Models
                           |
                           v
                      PostgreSQL


        Cross-Cutting Concerns
        ───────────────────────
        Pino / pino-http Logging
        Centralized Error Handling
        Environment Configuration
```

### Request Flow

A typical protected request follows this path:

```text
HTTP Request
     |
     v
Route
     |
     v
Authentication
     |
     v
Authorization
     |
     v
Request Validation
     |
     v
Controller
     |
     v
Sequelize
     |
     v
PostgreSQL
     |
     v
HTTP Response
```

This separation keeps responsibilities clear:

| Layer       | Responsibility                                                              |
| ----------- | --------------------------------------------------------------------------- |
| Routes      | Define API endpoints and middleware flow                                    |
| Middleware  | Authentication, authorization, validation, uploads, logging, error handling |
| Controllers | Coordinate requests, business operations, and responses                     |
| Models      | Define entities, relationships, and database interaction                    |
| Database    | Persist relational application data                                         |
| Validation  | Validate incoming request data before application logic                     |
| Logging     | Provide structured production diagnostics                                   |

---

# Core Resources

The system is built around four primary resources.

### User

Represents customers and administrators.

Capabilities include:

* Registration
* Login
* JWT authentication
* Profile retrieval
* Profile picture upload

### Service

Represents a bookable salon service such as:

* Haircuts
* Styling
* Facials
* Manicures

Administrators can create, update, and delete services.

### Booking

Represents a customer's appointment for a salon service.

Bookings are associated with both a user and a service.

The endpoint supports:

* Creation
* Retrieval
* Updating
* Deletion
* Filtering
* Sorting
* Pagination

### Review

Represents customer feedback for a service.

Reviews are associated with users and services and can be retrieved per service.

---

# Data Model

The core relationships are:

```text
User
 |
 +--------< Booking >-------- Service
 |                              |
 |                              |
 +--------< Review >-----------+
```

Conceptually:

```text
User
 ├── hasMany Bookings
 └── hasMany Reviews

Service
 ├── hasMany Bookings
 └── hasMany Reviews

Booking
 ├── belongsTo User
 └── belongsTo Service

Review
 ├── belongsTo User
 └── belongsTo Service
```

PostgreSQL is used to enforce relational integrity while Sequelize provides the application-level abstraction over the database.

---

# API Endpoints

## Authentication

| Method | Endpoint       | Access |
| ------ | -------------- | ------ |
| `POST` | `/auth/signup` | Public |
| `POST` | `/auth/login`  | Public |

---

## Services

| Method   | Endpoint        | Access |
| -------- | --------------- | ------ |
| `GET`    | `/services`     | Public |
| `GET`    | `/services/:id` | Public |
| `POST`   | `/services`     | Admin  |
| `PUT`    | `/services/:id` | Admin  |
| `DELETE` | `/services/:id` | Admin  |

`GET /services` supports filtering, sorting, and pagination.

---

## Bookings

| Method   | Endpoint        | Access                 |
| -------- | --------------- | ---------------------- |
| `GET`    | `/bookings`     | Protected              |
| `POST`   | `/bookings`     | Protected              |
| `PUT`    | `/bookings/:id` | Protected              |
| `DELETE` | `/bookings/:id` | Protected / Authorized |

Example:

```http
GET /bookings?page=1&limit=10
```

---

## Reviews

| Method | Endpoint                | Access    |
| ------ | ----------------------- | --------- |
| `POST` | `/services/:id/reviews` | Protected |
| `GET`  | `/services/:id/reviews` | Public    |

---

## Users

| Method | Endpoint                 | Access    |
| ------ | ------------------------ | --------- |
| `GET`  | `/users/profile`         | Protected |
| `POST` | `/users/profile-picture` | Protected |

---

## System

| Method | Endpoint  | Purpose         |
| ------ | --------- | --------------- |
| `GET`  | `/`       | API information |
| `GET`  | `/health` | Health check    |

---

# Authentication & Authorization

Authentication uses JSON Web Tokens.

After successful login, the API returns a JWT that is supplied with protected requests:

```http
Authorization: Bearer <JWT_TOKEN>
```

The system currently defines two roles:

```text
user
admin
```

Regular users can perform customer-level operations, while administrative operations such as service management are restricted to users with the `admin` role.

Authorization is implemented as reusable middleware:

```text
Route
  |
  +--> authenticate
  |
  +--> authorizeRoles("admin")
  |
  +--> controller
```

This keeps authorization rules visible at the route level instead of scattering role checks throughout controllers.

---

# Validation & Error Handling

Request data is validated at the API boundary using **Zod**.

```text
Incoming Request
       |
       v
Zod Validation
       |
   Valid?
    /   \
  No     Yes
  |       |
Error   Controller
          |
          v
       Database
```

Centralized error handling provides consistent responses for common failure cases, including:

* Invalid request data
* Missing required fields
* Authentication failures
* Authorization failures
* Missing resources
* Malformed JSON
* Invalid file types
* Multer upload errors
* Sequelize validation errors
* Duplicate records
* Unexpected server errors

Validation at the request boundary prevents invalid data from reaching application logic unnecessarily, while database constraints provide an additional layer of protection.

---

# File Uploads

Profile pictures are handled using:

```text
Client
  |
  v
Multer
  |
  v
Cloudinary
```

Cloudinary was chosen instead of storing uploaded files on the application server because cloud application filesystems can be ephemeral.

Keeping uploaded assets outside the application server means the API remains stateless and avoids losing files during redeployments or restarts.

---

# Filtering, Sorting & Pagination

Database-backed endpoints support query-based retrieval.

Example:

```http
GET /bookings?page=1&limit=10
```

Filtering and sorting are performed through Sequelize queries rather than loading the complete dataset into application memory.

This approach is more appropriate for a growing dataset because pagination and filtering happen closer to the data source.

---

# Technology Stack

| Category         | Technology       |
| ---------------- | ---------------- |
| Runtime          | Node.js          |
| Framework        | Express.js       |
| Database         | PostgreSQL       |
| ORM              | Sequelize        |
| Authentication   | JWT              |
| Validation       | Zod              |
| Testing          | Jest + Supertest |
| File Uploads     | Multer           |
| File Storage     | Cloudinary       |
| Logging          | Pino + pino-http |
| API Hosting      | Render           |
| Database Hosting | Neon PostgreSQL  |
| Monitoring       | UptimeRobot      |

---

# Architecture & Design Decisions

This section explains the major engineering decisions behind the project and the trade-offs considered.

## PostgreSQL + Sequelize

### Why PostgreSQL?

The domain is strongly relational.

A booking belongs to a user and a service, while reviews are associated with both users and services.

```text
User
  |
  +---- Booking ---- Service
  |
  +---- Review ----- Service
```

A relational database provides:

* Foreign-key relationships
* Constraints
* Structured querying
* Consistent relational data
* Strong support for transactional workflows

This is particularly important for a booking system where data consistency becomes increasingly important as concurrent bookings are introduced.

### Why Sequelize?

Sequelize provides:

* Model definitions
* Associations
* Query abstraction
* Validation integration
* PostgreSQL support

The trade-off is additional ORM abstraction compared with raw SQL or a lighter query builder.

A tool such as Knex could provide more direct control over SQL, while Prisma could provide stronger TypeScript-oriented developer ergonomics. Sequelize was selected because it provided the required relational features while allowing fast iteration within the project's time constraints.

---

## JWT Authentication

JWTs were selected because the API can remain stateless.

The server does not need to maintain a session for every authenticated request:

```text
Client
  |
  | JWT
  v
API
  |
  | verify token
  v
Authorized Request
```

This works well for the current deployment architecture.

### Trade-off

JWTs make immediate token revocation more difficult because authentication state is not stored server-side.

For a larger production system, the next step could be:

* Short-lived access tokens
* Refresh tokens
* Token rotation
* Server-side revocation for sensitive scenarios

Session-based authentication would make revocation simpler but would introduce the need for shared session storage when scaling across multiple application instances.

---

## Middleware-Based RBAC

Role-based authorization is implemented through reusable middleware rather than repeating role checks inside controllers.

Example conceptually:

```text
Route
  |
  +--> authenticate
  |
  +--> authorizeRoles("admin")
  |
  +--> controller
```

This provides two advantages:

1. Controllers remain focused on application behavior.
2. Authorization requirements are immediately visible from the route definition.

### Trade-off

Role-based middleware is well suited to coarse permissions such as:

```text
admin
user
```

It becomes less suitable for complex resource-level rules such as:

> A user can update only their own booking.

Those rules still require resource-aware authorization.

For a larger system, a policy or permission layer could be introduced for fine-grained access control.

---

## Zod Request Validation

Validation is performed before request data reaches the controller.

```text
Request
  |
  v
Zod
  |
  +---- Invalid ---> 400 Response
  |
  v
Controller
```

This provides:

* Clear validation rules
* Consistent input validation
* Earlier failure detection
* Testable schemas
* Better separation of concerns

### Trade-off

Some constraints exist at both the API and database layers.

This duplication is intentional.

Zod protects the application boundary, while PostgreSQL/Sequelize constraints protect the data layer.

This provides defense in depth rather than relying on a single validation mechanism.

---

## Cloudinary Instead of Local File Storage

Application servers deployed on cloud platforms should not be treated as permanent file storage.

Local uploads could disappear after:

* Redeployment
* Restart
* Instance replacement

Cloudinary provides external persistent storage for profile images.

### Trade-off

The application becomes dependent on a third-party storage provider and an external API call is introduced into the upload path.

For a larger system, an S3-compatible object storage service could be another option.

---

## Render + Neon

The API and database are deployed separately:

```text
Client
  |
  v
Render
(Node + Express)
  |
  v
Neon
(PostgreSQL)
```

This separation allows the application and database infrastructure to be managed independently.

### Trade-off

Using two providers introduces additional configuration and two separate infrastructure dependencies.

A single-provider platform could simplify deployment, but separating the database from the application provides a clearer architecture and allows each service to evolve independently.

---

## Pino Structured Logging

Instead of relying on:

```javascript
console.log(...)
```

the application uses Pino and pino-http for structured logging.

Logs include information such as:

* HTTP method
* Request URL
* Response status
* Request duration
* Error information
* Stack traces

Structured logs are easier to process by centralized logging systems in a larger production environment.

### Trade-off

Raw JSON logs are less readable than normal console messages during local development.

Development-friendly formatting can be used locally while retaining structured logging in production.

---

# Production Reliability

The application includes several production-oriented concerns.

### Environment Configuration

Secrets and deployment-specific configuration are supplied through environment variables rather than hardcoded values.

### Process Error Handling

The server handles:

* `uncaughtException`
* `unhandledRejection`
* Database startup failures
* Application startup failures

Unrecoverable process failures cause the application to exit so the hosting platform can restart the service.

### Structured Logging

Request and error information is logged using Pino.

### Health Endpoint

The API exposes:

```http
GET /health
```

which provides a lightweight endpoint for external monitoring.

### Uptime Monitoring

The production health endpoint is monitored through UptimeRobot.

---

# Testing

Automated tests use **Jest** and **Supertest**.

Testing covers both isolated application logic and complete HTTP request flows.

### Unit Tests

Current unit-level coverage includes:

* Booking validation
* Role-based authorization

### Integration Tests

Integration tests exercise complete request paths such as:

```text
HTTP Request
     |
     v
Route
     |
     v
Middleware
     |
     v
Authentication
     |
     v
Validation
     |
     v
Database
     |
     v
Response
```

Covered scenarios include:

* User signup
* User login
* JWT authentication
* Booking creation
* Profile retrieval
* Service review retrieval
* Invalid input
* Invalid credentials
* Invalid/missing resources

Run the test suite with:

```bash
npm test
```

Current test result:

```text
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
```

---

# Deployment

The API is deployed on **Render** and uses **Neon PostgreSQL** for production persistence.

```text
                        Production

Client
  |
  v
Render
Node.js + Express API
  |
  v
Neon PostgreSQL
```

The application is configured through environment variables and does not depend on local development configuration.

---

# Environment Variables

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

**Never commit `.env` files, credentials, API keys, or production secrets to source control.**

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd salon-booking-api
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file and provide your local PostgreSQL and application configuration.

## 4. Start the Development Server

```bash
npm run dev
```

Or:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

## 5. Run Tests

```bash
npm test
```

---

# Project Structure

```text
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

> The exact structure may vary slightly as the project evolves.

---

# Project Requirements

### Core Backend

* [x] Node.js / Express
* [x] REST API
* [x] CRUD operations
* [x] PostgreSQL persistence
* [x] Sequelize ORM
* [x] Authentication
* [x] Protected routes
* [x] Role-based authorization
* [x] Request validation
* [x] Centralized error handling
* [x] Related resources
* [x] Filtering
* [x] Sorting
* [x] Pagination
* [x] File uploads
* [x] Automated testing
* [x] API documentation
* [x] Production deployment
* [x] Environment configuration
* [x] Structured logging
* [x] Health monitoring

### Production-Oriented Features

* [x] Cloud file storage
* [x] Structured logging
* [x] Production deployment
* [x] External PostgreSQL database
* [x] Health endpoint
* [x] Uptime monitoring

---

# Project Screenshots

The repository includes screenshots demonstrating the deployed and tested application:

```text
screenshots/
├── integration-and-unit-tests-passed.png
├── render-deployment.png
├── health-check.png
└── uptimerobot-monitor.png
```

---

# Development Progress

This project was developed incrementally across the backend development stages:

| Stage  | Focus                                 | Status    |
| ------ | ------------------------------------- | --------- |
| Week 1 | Environment, Git & first API          | Completed |
| Week 1 | In-memory CRUD API                    | Completed |
| Week 2 | Authentication                        | Completed |
| Week 2 | PostgreSQL persistence                | Completed |
| Week 3 | Validation & error handling           | Completed |
| Week 3 | Relationships, filtering & pagination | Completed |
| Week 4 | File uploads & storage                | Completed |
| Week 4 | Role-based access control             | Completed |
| Week 5 | Automated testing & API documentation | Completed |
| Week 5 | Deployment, logging & monitoring      | Completed |

---

# What This Project Demonstrates

This project demonstrates practical experience with:

* RESTful API design
* Express middleware architecture
* Layered backend architecture
* PostgreSQL relational modeling
* Sequelize ORM
* JWT authentication
* Role-based authorization
* Request validation
* Centralized error handling
* Database relationships
* Filtering, sorting, and pagination
* Multipart file uploads
* Cloud object storage
* Automated unit testing
* Integration testing
* Structured logging
* Environment-based configuration
* Cloud deployment
* Health checks
* Application monitoring

More importantly, the project demonstrates how these pieces fit together into a single backend system rather than existing as isolated exercises.

---

# Future Improvements

The current implementation focuses on the core backend lifecycle. Potential next steps include:

* Swagger / OpenAPI documentation
* Rate limiting
* CI/CD with GitHub Actions
* Docker containerization
* Booking conflict prevention
* Appointment availability management
* Email notifications
* Background jobs
* Advanced search
* Refresh-token authentication
* More comprehensive automated test coverage
* Database migrations and production-safe schema management

---

# Author

**Ayesha Cheema**

Computer Science student interested in backend development, artificial intelligence, machine learning, and computer vision.

---

# Final Takeaway

The Salon Booking API started as a basic CRUD application and evolved into a complete backend system.

It now combines:

```text
REST API
   +
PostgreSQL
   +
Authentication
   +
Authorization
   +
Validation
   +
Relationships
   +
File Storage
   +
Testing
   +
Structured Logging
   +
Deployment
   +
Monitoring
   =
Production-Oriented Backend
```

The project demonstrates the complete journey from designing an API and database schema to deploying, testing, monitoring, and documenting a backend application.
