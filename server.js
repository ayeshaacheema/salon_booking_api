const express = require("express");
const { sequelize, connectDB } = require("./db");
const Service = require("./models/Service");
const Booking = require("./models/Booking");

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

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Salon Booking API is running!" });
});

// GET All Bookings
app.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.findAll({ include: Service });
        const formatted = bookings.map(b => ({
            id: b.id,
            service: b.Service.name,
            date: b.date,
            time: b.time,
            name: b.name,
            phone: b.phone,
            notes: b.notes
        }));
        res.status(200).json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});

// GET Single Booking
app.get("/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, { include: Service });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({
            id: booking.id,
            service: booking.Service.name,
            date: booking.date,
            time: booking.time,
            name: booking.name,
            phone: booking.phone,
            notes: booking.notes
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch booking" });
    }
});

// CREATE Booking
app.post("/bookings", async (req, res) => {
    try {
        const { service, date, time, name, phone, notes } = req.body;

        if (!service || !date || !time || !name || !phone) {
            return res.status(400).json({
                message: "Service, date, time, name and phone are required."
            });
        }

        const [serviceRecord] = await Service.findOrCreate({ where: { name: service } });

        const booking = await Booking.create({
            serviceId: serviceRecord.id,
            date,
            time,
            name,
            phone,
            notes
        });

        res.status(201).json({
            message: "Booking created successfully!",
            booking: {
                id: booking.id,
                service: serviceRecord.name,
                date: booking.date,
                time: booking.time,
                name: booking.name,
                phone: booking.phone,
                notes: booking.notes
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create booking" });
    }
});

// UPDATE Booking
app.put("/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const { service, date, time, name, phone, notes } = req.body;

        if (!service || !date || !time || !name || !phone) {
            return res.status(400).json({
                message: "Service, date, time, name and phone are required."
            });
        }

        const [serviceRecord] = await Service.findOrCreate({ where: { name: service } });

        booking.serviceId = serviceRecord.id;
        booking.date = date;
        booking.time = time;
        booking.name = name;
        booking.phone = phone;
        booking.notes = notes;
        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully!",
            booking: {
                id: booking.id,
                service: serviceRecord.name,
                date: booking.date,
                time: booking.time,
                name: booking.name,
                phone: booking.phone,
                notes: booking.notes
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update booking" });
    }
});

// DELETE Booking
app.delete("/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.destroy();

        res.status(200).json({ message: "Booking deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete booking" });
    }
});

// Start Server
connectDB().then(async () => {
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});