const express = require("express");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const { sendSuccess } = require("./utils/response");
const catchAsync = require("./utils/catchAsync");
const validate = require("./middleware/validate");
const { bookingSchema } = require("./validators/bookingValidator");
const {
    signupSchema,
    loginSchema
} = require("./validators/userValidator");

const { sequelize, connectDB } = require("./db");
const Service = require("./models/Service");
const Booking = require("./models/Booking");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");
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
    sendSuccess(res, 200, {
        message: "Salon Booking API is running!"
    });
});

// GET All Bookings
app.get(
    "/bookings",

    catchAsync(async (req, res) => {

        const bookings = await Booking.findAll({
            include: Service
        });

        const formatted = bookings.map(b => ({
            id: b.id,
            service: b.Service.name,
            date: b.date,
            time: b.time,
            name: b.name,
            phone: b.phone,
            notes: b.notes
        }));

        sendSuccess(res, 200, formatted);

    })
);
// GET Single Booking
app.get(
    "/bookings/:id",

    catchAsync(async (req, res) => {

        const booking = await Booking.findByPk(req.params.id, {
            include: Service
        });

        if (!booking) {
            throw new AppError("Booking not found", 404);
        }

        sendSuccess(res, 200, {
            id: booking.id,
            service: booking.Service.name,
            date: booking.date,
            time: booking.time,
            name: booking.name,
            phone: booking.phone,
            notes: booking.notes
        });

    })
);
// CREATE Booking
app.post(
    "/bookings",
    authenticateToken,
    validate(bookingSchema),
    catchAsync(async (req, res) => {

        const { service, date, time, name, phone, notes } = req.body;

        const [serviceRecord] = await Service.findOrCreate({
            where: { name: service }
        });

        const booking = await Booking.create({
            serviceId: serviceRecord.id,
            date,
            time,
            name,
            phone,
            notes
        });

        sendSuccess(res, 201, {
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

    })
);
// UPDATE Booking
app.put(
    "/bookings/:id",
    validate(bookingSchema),
    catchAsync(async (req, res) => {

        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            throw new AppError("Booking not found", 404);
        }

        const { service, date, time, name, phone, notes } = req.body;

        const [serviceRecord] = await Service.findOrCreate({
            where: { name: service }
        });

        booking.serviceId = serviceRecord.id;
        booking.date = date;
        booking.time = time;
        booking.name = name;
        booking.phone = phone;
        booking.notes = notes;

        await booking.save();

        sendSuccess(res, 200, {
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

    })
);
// DELETE Booking
app.delete(
    "/bookings/:id",
    authenticateToken,
    catchAsync(async (req, res) => {

        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            throw new AppError("Booking not found", 404);
        }

        await booking.destroy();

        sendSuccess(res, 200, {
            message: "Booking deleted successfully!"
        });

    })
);
// SIGNUP
// SIGNUP
app.post(
    "/auth/signup",
    validate(signupSchema),
    catchAsync(async (req, res) => {

        const { email, password } = req.body;

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new AppError("Email already in use.", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        sendSuccess(res, 201, {
            message: "User created successfully!",
            user: {
                id: user.id,
                email: user.email
            }
        });

    })
);
// LOGIN
// LOGIN
app.post(
    "/auth/login",
    validate(loginSchema),
    catchAsync(async (req, res) => {

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new AppError("Invalid email or password.", 401);
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            throw new AppError("Invalid email or password.", 401);
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        sendSuccess(res, 200, {
            message: "Login successful!",
            token
        });

    })
);
app.all("/{*any}", (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);


// Start Server
connectDB().then(async () => {
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});