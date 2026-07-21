# Salon Booking API

A REST API built with Node.js and Express.js that manages salon bookings using an in-memory array.

## Features

- Create booking
- Get all bookings
- Get single booking
- Update booking
- Delete booking
- Request logging middleware

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

Server runs on port 3000.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /bookings | Get all bookings |
| GET | /bookings/:id | Get one booking |
| POST | /bookings | Create booking |
| PUT | /bookings/:id | Update booking |
| DELETE | /bookings/:id | Delete booking |

## Sample Booking

```json
{
  "service": "Haircut",
  "date": "2026-07-20",
  "time": "2:00 PM",
  "name": "Ayesha",
  "phone": "03001234567",
  "notes": "Near window seat"
}
```
