# 💇 Salon Booking API

A RESTful API for managing salon appointments, built with **Node.js**, **Express.js**, and **MongoDB**. This API allows users to create, retrieve, update, and delete salon bookings while validating input data and handling errors gracefully.

---

## 🚀 Features

- Create a new booking
- View all bookings
- View a single booking by ID
- Update an existing booking
- Delete a booking
- Input validation
- Proper HTTP status codes
- Error handling
- MongoDB database integration
- Fully tested using Postman

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman

---

## 📁 Project Structure

```
salon-booking-api/
│── models/
│── routes/
│── controllers/
│── screenshots/
│── postman/
│── .postman/
│── server.js
│── package.json
│── README.md
```

---

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

### 4. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### 5. Start the server

```bash
npm start
```

or

```bash
npm run dev
```

The server will run on:

```
http://localhost:3000
```

---

# 📌 API Endpoints

## GET all bookings

```
GET /bookings
```

Returns a list of all bookings.

---

## GET booking by ID

```
GET /bookings/:id
```

Returns a single booking.

---

## POST create booking

```
POST /bookings
```

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

## PUT update booking

```
PUT /bookings/:id
```

Updates an existing booking.

---

## DELETE booking

```
DELETE /bookings/:id
```

Deletes a booking.

---

# ✅ Postman Testing

The API has been thoroughly tested using **Postman**.

### Tested Endpoints

- ✅ GET All Bookings
- ✅ GET Booking by ID
- ✅ POST Create Booking
- ✅ PUT Update Booking
- ✅ DELETE Booking

### Validation Tested

- Missing required fields
- Invalid MongoDB Object IDs
- Non-existent bookings
- Successful CRUD operations
- Invalid request data

The Postman collection and related files are included in this repository.

```
postman/
.postman/
```

---

# 📸 Screenshots

Screenshots demonstrating API functionality are available in the `screenshots/` folder.

Examples include:

- Get All Bookings
- Get Booking by ID
- Create Booking
- Update Booking
- Delete Booking
- Validation Error

---

# 📬 Sample Response

```json
{
  "_id": "...",
  "customerName": "Ayesha Cheema",
  "service": "Haircut",
  "date": "2026-07-22",
  "time": "2:00 PM",
  "phone": "03001234567"
}
```

---

# 👩‍💻 Author

**Ayesha Cheema**

GitHub:
https://github.com/ayeshaacheema

---

## ⭐ Future Improvements

- User authentication
- JWT authorization
- Online payment integration
- Appointment availability checking
- Email notifications
- Swagger API documentation
