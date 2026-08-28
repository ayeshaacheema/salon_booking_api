# System Architecture

## Overview
The Salon Booking API is a robust, modular RESTful backend built with Node.js and Express. It uses a monolithic architecture designed around standard MVC (Model-View-Controller) principles, emphasizing separation of concerns, scalability, and maintainability.

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Relational)
- **ORM:** Sequelize
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Zod
- **File Storage:** Cloudinary
- **Logging:** Pino & pino-http

---

## Architectural Layers

### 1. Routing Layer (`app.js`)
The entry point of the application where all HTTP routes are defined. It maps incoming HTTP requests to their appropriate handlers. It also registers global middleware for logging, error handling, and JSON parsing.

### 2. Middleware Layer (`middleware/`)
Sits between the incoming request and the core business logic.
- **Authentication (`auth.js`):** Intercepts requests to verify JWT tokens and inject user information into the request object.
- **Authorization (`authorize.js`):** Role-Based Access Control (RBAC). Ensures users have the correct permissions (e.g., `admin` role) before proceeding.
- **Validation (`validate.js`):** Integrates with Zod schemas to ensure incoming request payloads are strictly typed and formatted correctly before hitting the database.
- **File Upload (`upload.js`):** Manages `multipart/form-data` using Multer for profile pictures.
- **Error Handling (`errorHandler.js`):** A centralized error-catching middleware that formats and standardizes API error responses.

### 3. Business Logic & Validation (`validators/`)
Zod schemas define the exact shape of valid data. This prevents bad data from ever reaching the models. Schemas exist for Users, Bookings, Services, and Reviews.

### 4. Data Access / ORM Layer (`models/` & `db.js`)
Sequelize handles all database interactions.
- **Models:** Define the database schemas (User, Booking, Service, Review) and their relationships.
  - A `User` can have a profile.
  - A `Service` can have many `Bookings`.
  - A `Service` can have many `Reviews`.
- **Database Connection (`db.js`):** Manages the connection pool to PostgreSQL. It supports distinct environments (development, test, production) switching configurations based on `NODE_ENV` and securely loading credentials.

### 5. Utility Layer (`utils/`)
Contains reusable helper functions decoupled from the main request flow.
- **`AppError.js`:** Custom error class for operational errors.
- **`catchAsync.js`:** Wraps async route handlers to automatically catch promise rejections and forward them to the error handler.
- **`cloudinaryUpload.js`:** Abstracts the complexity of external API calls to Cloudinary.
- **`logger.js`:** Configures the Pino logger for structured, high-performance logging.
- **`response.js`:** Standardizes successful JSON responses.

---

## Data Flow (Request Lifecycle)

1. **Client Request:** A client sends an HTTP request (e.g., `POST /bookings`).
2. **Global Middleware:** The request passes through `express.json()` and the Pino request logger.
3. **Route Match:** Express identifies the matching route in `app.js`.
4. **Authentication/Authorization:** The `authenticateToken` middleware verifies the JWT. If an admin route, `authorizeRoles` checks the user's role.
5. **Validation:** The `validate` middleware checks the request body against a Zod schema. If invalid, a 400 response is immediately returned.
6. **Controller Logic:** The route handler executes, interacting with Sequelize Models to fetch or mutate data.
7. **Database Interaction:** Sequelize translates JS commands into SQL and queries PostgreSQL.
8. **Response:** The handler formats the data and sends a standardized JSON response via `sendSuccess`.
9. **Error Handling:** If any step fails, `catchAsync` routes the error to the centralized `errorHandler` middleware.

---

## Deployment & Environments
- **Local/Development:** Connects to a local PostgreSQL instance. Uses local `.env`.
- **Testing:** Uses Jest and a separate local test database (`.env.test`). The database is wiped clean before test suites run.
- **Production:** Deployed on Render with a managed Neon PostgreSQL database. Enforces SSL database connections. Uses Render environment variables (no `.env` file).

## Security Considerations
- **Password Hashing:** Passwords are never stored in plain text; they are hashed using `bcrypt` before saving to the DB.
- **Stateless Auth:** Uses JWTs for stateless authentication, preventing session hijacking.
- **RBAC:** Strict separation of standard users and administrators.
- **Data Validation:** Zod prevents SQL injection and unexpected data types by sanitizing and strictly enforcing schema shapes.
