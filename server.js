const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

// Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    });

    next();
});

// In-memory database
let bookings = [];
let nextId = 1;

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Salon Booking API is running!"
    });
});

// GET All Bookings
app.get("/bookings", (req, res) => {
    res.status(200).json(bookings);
});

// GET Single Booking
app.get("/bookings/:id", (req, res) => {

    const bookingId = parseInt(req.params.id);

    const booking = bookings.find(item => item.id === bookingId);

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    res.status(200).json(booking);
});

// CREATE Booking
app.post("/bookings", (req, res) => {

    const { service, date, time, name, phone, notes } = req.body;

    // Validation
    if (!service || !date || !time || !name || !phone) {
        return res.status(400).json({
            message: "Service, date, time, name and phone are required."
        });
    }

    const booking = {
        id: nextId++,
        service,
        date,
        time,
        name,
        phone,
        notes
    };

    bookings.push(booking);

    res.status(201).json({
        message: "Booking created successfully!",
        booking
    });
});

// UPDATE Booking
app.put("/bookings/:id", (req, res) => {

    const bookingId = parseInt(req.params.id);

    const booking = bookings.find(item => item.id === bookingId);

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    const { service, date, time, name, phone, notes } = req.body;

    if (!service || !date || !time || !name || !phone) {
        return res.status(400).json({
            message: "Service, date, time, name and phone are required."
        });
    }

    booking.service = service;
    booking.date = date;
    booking.time = time;
    booking.name = name;
    booking.phone = phone;
    booking.notes = notes;

    res.status(200).json({
        message: "Booking updated successfully!",
        booking
    });
});

// DELETE Booking
app.delete("/bookings/:id", (req, res) => {

    const bookingId = parseInt(req.params.id);

    const index = bookings.findIndex(item => item.id === bookingId);

    if (index === -1) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    bookings.splice(index, 1);

    res.status(200).json({
        message: "Booking deleted successfully!"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});