# Salon Booking API

A RESTful API built with **Node.js** and **Express.js** for managing salon appointments. The API provides complete CRUD (Create, Read, Update, Delete) functionality and follows RESTful design principles, backed by a **PostgreSQL** database with a relational schema. It has been thoroughly tested using **Postman**, including successful requests, validation checks, and error handling.

---

## 🚀 Features

- Create a new salon booking
- Retrieve all bookings
- Retrieve a booking by its ID
- Update an existing booking
- Delete a booking
- Input validation
- Consistent error handling
- Persistent storage in PostgreSQL (survives server restarts)
- Relational schema: bookings linked to services
- Graceful handling of database connection failures
- RESTful API architecture
- Comprehensive API testing with Postman

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- JavaScript
- Postman

---

## 📁 Project Structure

```text
salon-booking-api/
├── .postman/
├── postman/
├── screenshots/
├── models/
│   ├── Service.js
│   └── Booking.js
├── db.js
├── .env              (not committed — see setup below)
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## 🗄️ Database Setup

This API uses **PostgreSQL** with **Sequelize** as the ORM. Data is stored in two related tables:

- **Services** — `id`, `name` (e.g. "Haircut", "Facial")
- **Bookings** — `id`, `date`, `time`, `name`, `phone`, `notes`, `serviceId` (foreign key → `Services.id`)

This is a **one-to-many relationship**: one service can have many bookings.

### Prerequisites

- PostgreSQL installed and running locally ([download here](https://www.postgresql.org/download/))
- A database created for this project

### 1. Create the database

Open `psql` or pgAdmin and run:

```sql
CREATE DATABASE salon_booking_db;
```

### 2. Configure environment variables

Create a `.env` file in the project root (this file is gitignored and never committed):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=salon_booking_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

An `.env.example` file is included in the repo as a template — copy it to `.env` and fill in your own credentials.

### 3. Tables are created automatically

On server startup, Sequelize syncs the `Services` and `Bookings` tables automatically — no manual migration needed for this project.

### 4. Connection error handling

If the database is unreachable (wrong credentials, Postgres not running, etc.), the server logs a clear error message and exits instead of crashing silently or hanging:

```
❌ Unable to connect to the database: <error message>
```

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- npm (comes with Node.js)
- PostgreSQL

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/ayeshaacheema/salon_booking_api.git
```

### 2. Navigate to the project directory

```bash
cd salon_booking_api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up the database

Follow the [Database Setup](#️-database-setup) section above before starting the server.

### 5. Start the server

```bash
npm start
```

or, if using Nodemon:

```bash
npm run dev
```

The server will run at:

```text
http://localhost:3000
```

You should see:
```
✅ Database connected
Server is running on port 3000
```

---

## 📌 API Endpoints

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| GET    | `/bookings`     | Retrieve all bookings      |
| GET    | `/bookings/:id` | Retrieve a booking by ID   |
| POST   | `/bookings`     | Create a new booking       |
| PUT    | `/bookings/:id` | Update an existing booking |
| DELETE | `/bookings/:id` | Delete a booking           |

---

## 📝 Sample Request

### POST `/bookings`

```json
{
  "service": "Haircut",
  "date": "2026-07-28",
  "time": "3:00 PM",
  "name": "Ayesha Cheema",
  "phone": "03001234567",
  "notes": "First time client"
}
```

Response (`201 Created`):

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
    "notes": "First time client"
  }
}
```

---

## ✅ API Testing

The API has been thoroughly tested using **Postman** to verify both functionality and error handling, including database persistence across server restarts.

### Test Coverage

- ✅ Retrieve all bookings
- ✅ Retrieve a booking by ID
- ✅ Create a new booking
- ✅ Update an existing booking
- ✅ Delete a booking
- ✅ Missing required fields validation
- ✅ Invalid booking ID validation
- ✅ Invalid request handling
- ✅ Successful CRUD operations
- ✅ Data persists correctly after server restart

### Included in this Repository

- `postman/` – Postman collection
- `.postman/` – Postman workspace files
- `screenshots/` – Screenshots demonstrating API testing

---

## 📸 Screenshots

The `screenshots/` folder contains screenshots of:

- GET all bookings
- GET booking by ID
- POST booking
- PUT booking
- DELETE booking
- Validation and error responses

---

## 👩‍💻 Author

**Ayesha Cheema**

GitHub: **https://github.com/ayeshaacheema**
