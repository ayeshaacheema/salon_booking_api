# Salon Booking API

A REST API for managing salon bookings built with Node.js, Express, PostgreSQL, and Sequelize. The project began as an in-memory CRUD application and was later upgraded to use PostgreSQL for persistent storage and JWT authentication for protecting selected routes.

## Features

- User signup and login
- JWT authentication
- Password hashing with bcrypt
- CRUD operations for salon bookings
- PostgreSQL database with Sequelize
- Relational database design
- Automatic table creation on startup
- Input validation and error handling
- Tested using Postman

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- bcrypt
- JSON Web Token (JWT)
- Postman

## Project Structure

```text
salon_booking_api/
│
├── models/
│   ├── Service.js
│   ├── Booking.js
│   └── User.js
├── middleware/
│   └── auth.js
├── db.js
├── server.js
├── .env.example
├── postman/
├── screenshots/
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/ayeshaacheema/salon_booking_api.git
cd salon_booking_api
```

Install the required dependencies:

```bash
npm install
```

Create a PostgreSQL database:

```sql
CREATE DATABASE salon_booking_db;
```

Create a `.env` file in the project root.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=salon_booking_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=1h
```

A sample configuration is provided in `.env.example`.

To generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the server:

```bash
node server.js
```

Sequelize automatically creates the required tables when the application starts. If the database connection cannot be established, the server logs the error and exits.

## Database

The application uses three models:

### User

- id
- email
- password (hashed)

### Service

- id
- name

### Booking

- id
- date
- time
- name
- phone
- notes
- serviceId

Each booking belongs to one service, and each service can have multiple bookings.

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---------|----------|-------------|----------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login and receive a JWT | No |
| GET | `/bookings` | Get all bookings | No |
| GET | `/bookings/:id` | Get a booking by ID | No |
| POST | `/bookings` | Create a booking | Yes |
| PUT | `/bookings/:id` | Update a booking | No |
| DELETE | `/bookings/:id` | Delete a booking | Yes |

## Example Request

**POST** `/bookings`

```json
{
  "service": "Haircut",
  "date": "2026-07-28",
  "time": "3:00 PM",
  "name": "Ayesha Cheema",
  "phone": "03001234567",
  "notes": "First-time client"
}
```

## Authentication

### Signup

```http
POST /auth/signup
```

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### Login

```http
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Example response:

```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOi..."
}
```

Include the token in the request header when accessing protected routes:

```http
Authorization: Bearer <your_token>
```

The following routes require authentication:

- `POST /bookings`
- `DELETE /bookings/:id`

The token expiration time is configured using `JWT_EXPIRES_IN` in the `.env` file.

## Error Responses

| Status | Description |
|--------|-------------|
| 400 | Email already in use |
| 401 | Invalid email or password |
| 401 | No token provided |
| 401 | Token has expired |
| 403 | Invalid token |

For security reasons, the login endpoint returns the same response whether the email is incorrect or the password is incorrect.

## Testing

The API was tested manually using Postman.

The following scenarios were verified:

- User signup
- User login
- JWT authentication
- Create booking
- Retrieve all bookings
- Retrieve a booking by ID
- Update booking
- Delete booking
- Validation errors
- Authentication errors
- Database persistence after server restart

The repository includes:

- `postman/` – Postman collection
- `screenshots/` – Screenshots of API testing

## Screenshots

The `screenshots` folder contains example requests and responses for:

- User signup
- User login
- Get all bookings
- Get booking by ID
- Create booking
- Update booking
- Delete booking
- Error responses
