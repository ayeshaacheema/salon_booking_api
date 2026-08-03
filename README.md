# Week 3 – Input Validation & Error Handling

This update improves the API by validating incoming requests, handling errors in one place, and returning consistent responses across all endpoints.

## Features Added

- Input validation using **Zod**
- Centralized error handling
- Consistent API response format
- Validation for signup, login, create booking, and update booking
- Handling of malformed JSON requests
- Proper error messages for invalid requests

---

## Response Format

### Successful Request

```json
{
  "success": true,
  "data": {
    ...
  },
  "error": null
}
```

### Failed Request

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Description of the error"
  }
}
```

---

# Error Handling Examples

## 1. Empty Request Body

**Request**

```
POST /bookings
```

```json
{}
```

**Response**

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "service: Invalid input: expected string, received undefined, date: Invalid input: expected string, received undefined, time: Invalid input: expected string, received undefined, name: Invalid input: expected string, received undefined, phone: Invalid input: expected string, received undefined"
  }
}
```

---

## 2. Invalid Phone Number

**Request**

```
POST /bookings
```

```json
{
  "service": "Hair Cut",
  "date": "2026-08-15",
  "time": "14:00",
  "name": "Ayesha",
  "phone": "123"
}
```

**Response**

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "phone: Phone number must contain exactly 11 digits"
  }
}
```

---

## 3. Duplicate Email

**Request**

```
POST /auth/signup
```

```json
{
  "email": "ayesha@test.com",
  "password": "mypassword123"
}
```

(Email already exists.)

**Response**

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Email already in use."
  }
}
```

---

## 4. Invalid Login

**Request**

```
POST /auth/login
```

```json
{
  "email": "ayesha@test.com",
  "password": "wrongpassword"
}
```

**Response**

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Invalid email or password."
  }
}
```

---

## 5. Malformed JSON

**Request**

```
POST /bookings
```

```json
{
  "service": "Hair Cut",
  "date": "2026-08-15",
```

**Response**

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Malformed JSON in request body"
  }
}
```

---

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JWT Authentication
- bcrypt
- Zod
