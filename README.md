# Salon Booking API

A REST API for managing salon bookings built with Node.js, Express, PostgreSQL, and Sequelize. The API supports user authentication using JWT and provides CRUD operations for managing salon bookings.

## Features

- User signup and login
- JWT-based authentication
- Password hashing with bcrypt
- PostgreSQL database integration
- Sequelize ORM
- CRUD operations for bookings
- Automatic database table creation
- Environment variable configuration
- Tested using Postman

## Technologies

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- bcrypt
- JSON Web Token (JWT)
- dotenv
- Postman

## Project Structure

```text
salon_booking_api/
│
├── models/
│   ├── Booking.js
│   ├── Service.js
│   └── User.js
│
├── middleware/
│   └── auth.js
│
├── db.js
├── server.js
├── .env.example
├── package.json
├── postman/
├── screenshots/
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/ayeshaacheema/salon_booking_api.git
cd salon_booking_api
```

### Install dependencies

```bash
npm install
```

### Create the database

```sql
CREATE DATABASE salon_booking_db;
```

### Configure environment variables

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

Generate a secure JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Run the server

```bash
node server.js
```

When the server starts, Sequelize automatically creates the required database tables if they do not already exist.

## Database

The application contains three models.

### User

| Field | Type |
|------|------|
| id | Integer |
| email | String |
| password | String (hashed) |

### Service

| Field | Type |
|------|------|
| id | Integer |
| name | String |

### Booking

| Field | Type |
|------|------|
| id | Integer |
| date | Date |
| time | String |
| name | String |
| phone | String |
| notes | String |
| serviceId | Foreign Key |

### Relationships

- A service can have many bookings.
- A booking belongs to one service.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT |

### Bookings

| Method | Endpoint | Authentication |
|--------|----------|----------------|
| GET | `/bookings` | No |
| GET | `/bookings/:id` | No |
| POST | `/bookings` | Yes |
| PUT | `/bookings/:id` | No |
| DELETE | `/bookings/:id` | Yes |

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
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Include the token in the request header when accessing protected routes.

```http
Authorization: Bearer <your_token>
```

Protected routes:

- POST `/bookings`
- DELETE `/bookings/:id`

The token expiration time is controlled through the `JWT_EXPIRES_IN` environment variable.

## Error Responses

| Status | Description |
|--------|-------------|
| 400 | Email already in use |
| 401 | Invalid email or password |
| 401 | No token provided |
| 401 | Token has expired |
| 403 | Invalid token |

For security reasons, the login endpoint returns the same message whether the email does not exist or the password is incorrect.

## Testing

The API was tested using Postman.

The following scenarios were verified:

- User signup
- User login
- JWT authentication
- Create booking
- Retrieve all bookings
- Retrieve a booking by ID
- Update booking
- Delete booking
- Invalid requests
- Authentication errors

The Postman collection is available in the `postman` folder.

## Author

**Ayesha Cheema**

GitHub: https://github.com/ayeshaacheema
