#  Salon Booking API

A RESTful API built with **Node.js** and **Express.js** for managing salon appointments. The API provides complete CRUD (Create, Read, Update, Delete) functionality and follows RESTful design principles. It has been thoroughly tested using **Postman**, including successful requests, validation checks, and error handling.

---

## 🚀 Features

- Create a new salon booking
- Retrieve all bookings
- Retrieve a booking by its ID
- Update an existing booking
- Delete a booking
- Input validation
- Consistent error handling
- RESTful API architecture
- Comprehensive API testing with Postman

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- JavaScript
- Postman

---

## 📁 Project Structure

```text
salon-booking-api/
├── .postman/
├── postman/
├── screenshots/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- npm (comes with Node.js)

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

### 4. Start the server

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

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/bookings` | Retrieve all bookings |
| GET | `/bookings/:id` | Retrieve a booking by ID |
| POST | `/bookings` | Create a new booking |
| PUT | `/bookings/:id` | Update an existing booking |
| DELETE | `/bookings/:id` | Delete a booking |

---

## 📝 Sample Request

### POST `/bookings`

```json
{
  "customerName": "Ayesha Cheema",
  "service": "Haircut",
  "date": "2026-07-22",
  "time": "2:00 PM",
  "phone": "03001234567"
}
```

---

## ✅ API Testing

The API has been thoroughly tested using **Postman** to verify both functionality and error handling.

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

> You can also display the screenshots directly in this README by adding image links after uploading them to the repository.

---

## 👩‍💻 Author

**Ayesha Cheema**

GitHub: **https://github.com/ayeshaacheema**

---

