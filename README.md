# Salon Booking API

A RESTful API for managing salon bookings built with Node.js, Express.js, PostgreSQL, and Sequelize. The project provides CRUD operations for bookings using a relational database instead of in-memory storage. It was tested using Postman to verify functionality, validation, and error handling.

## Features

- Create, retrieve, update, and delete bookings
- Store data in PostgreSQL
- Relational database design using Sequelize
- Input validation
- Error handling
- Automatic table creation on startup
- Database connection checks
- RESTful API design
- Tested with Postman

## Technologies

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JavaScript
- Postman

## Project Structure

```text
salon_booking_api/
│
├── models/
│   ├── Booking.js
│   └── Service.js
├── postman/
├── screenshots/
├── db.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
```

## Prerequisites

Before running the project, install:

- Node.js
- npm
- PostgreSQL

## Installation

Clone the repository:

```bash
git clone https://github.com/ayeshaacheema/salon_booking_api.git
cd salon_booking_api
```

Install dependencies:

```bash
npm install
```

Create a PostgreSQL database:

```sql
CREATE DATABASE salon_booking_db;
```

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=salon_booking_db
DB_USER=postgres
DB_PASSWORD=your_password
```

An `.env.example` file is included as a template.

Start the server:

```bash
npm start
```

or

```bash
npm run dev
```

The server runs on:

```text
http://localhost:3000
```

When the application starts, Sequelize automatically creates the required tables if they do not already exist.

## Database

The application uses two related tables.

### Services

| Field | Type |
|------|------|
| id | Integer |
| name | String |

### Bookings

| Field | Type |
|------|------|
| id | Integer |
| date | Date |
| time | String |
| name | String |
| phone | String |
| notes | String |
| serviceId | Foreign Key |

Each booking belongs to one service, and each service can have multiple bookings.

If the database connection fails, the application logs the error and exits instead of continuing to run.

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/:id` | Get a booking by ID |
| POST | `/bookings` | Create a booking |
| PUT | `/bookings/:id` | Update a booking |
| DELETE | `/bookings/:id` | Delete a booking |

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

Example response:

```json
{
  "message": "Booking created successfully!",
  "booking": {
    "id": 1,
    "service": "Haircut",
    "date": "2026-07-28",
    "time": "3:00 PM",
    "name": "Ayesha Cheema",
    "phone": "03001234567",
    "notes": "First-time client"
  }
}
```

## Testing

The API was tested manually using Postman.

The following scenarios were verified:

- Retrieve all bookings
- Retrieve a booking by ID
- Create a booking
- Update a booking
- Delete a booking
- Missing required fields
- Invalid booking IDs
- Error responses
- Database persistence after server restart

The repository includes:

- `postman/` – Postman collection
- `screenshots/` – API testing screenshots

## Screenshots

Screenshots included in the repository demonstrate:

- Get all bookings
- Get booking by ID
- Create booking
- Update booking
- Delete booking
- Validation and error handling
