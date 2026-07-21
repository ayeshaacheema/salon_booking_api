# 💇 Salon Booking API

A RESTful API built with **Node.js** and **Express.js** for managing salon appointments. The API supports full CRUD (Create, Read, Update, Delete) operations and has been thoroughly tested using Postman.

---

## 🚀 Features

- Create a new booking
- Retrieve all bookings
- Retrieve a booking by ID
- Update an existing booking
- Delete a booking
- Input validation
- Proper error handling
- RESTful API design
- Fully tested using Postman

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

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/ayeshaacheema/salon_booking_api.git
```

### 2. Navigate to the project

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

or

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

---

# 📌 API Endpoints

## GET /bookings

Retrieve all bookings.

---

## GET /bookings/:id

Retrieve a specific booking by its ID.

---

## POST /bookings

Create a new booking.

Example request body:

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

## PUT /bookings/:id

Update an existing booking.

---

## DELETE /bookings/:id

Delete a booking.

---

# ✅ API Testing

The API has been fully tested using **Postman**.

### Tested Endpoints

- ✅ GET /bookings
- ✅ GET /bookings/:id
- ✅ POST /bookings
- ✅ PUT /bookings/:id
- ✅ DELETE /bookings/:id

### Validation Tested

- Missing required fields
- Invalid booking IDs
- Invalid request data
- Successful CRUD operations

The Postman collection and workspace files are included in this repository.

```text
postman/
.postman/
```

---

# 📸 Screenshots

The `screenshots/` folder contains examples of:

- Successful GET requests
- Successful POST requests
- Successful PUT requests
- Successful DELETE requests
- Validation and error responses

---

## 👩‍💻 Author

**Ayesha Cheema**

GitHub: https://github.com/ayeshaacheema
