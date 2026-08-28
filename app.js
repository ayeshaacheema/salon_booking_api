require("dotenv").config();

const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");
const cloudinary = require("./config/cloudinary");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const { sendSuccess } = require("./utils/response");
const catchAsync = require("./utils/catchAsync");
const validate = require("./middleware/validate");
const { bookingSchema } = require("./validators/bookingValidator");
const { reviewSchema } = require("./validators/reviewValidator");
const { serviceSchema } = require("./validators/serviceValidator");
const upload = require("./middleware/upload");
const uploadToCloudinary = require("./utils/cloudinaryUpload");
const { Op } = require("sequelize");
const authorizeRoles = require("./middleware/authorize");

const {
    signupSchema,
    loginSchema
} = require("./validators/userValidator");

const { sequelize, connectDB } = require("./db");
const Review = require("./models/Review");
const Service = require("./models/Service");
const Booking = require("./models/Booking");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(
    pinoHttp({
        logger,
    })
);

// Home Route
app.get("/", (req, res) => {
    sendSuccess(res, 200, {
        message: "Salon Booking API is running!"
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API is healthy"
    });
});

// GET All Bookings (supports filtering, sorting, and pagination)
app.get(
    "/bookings",
    catchAsync(async (req, res) => {
        const { service, sortBy, order, page, limit } = req.query;

        const sortField = sortBy || "id";
        const sortOrder = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * pageSize;

        const { rows: bookings, count: totalItems } = await Booking.findAndCountAll({
            include: [
                {
                    model: Service,
                    where: service
                        ? {
                              name: {
                                  [Op.iLike]: service
                              }
                          }
                        : undefined
                }
            ],
            order: [
                [sortField, sortOrder]
            ],
            limit: pageSize,
            offset: offset
        });

        const formatted = bookings.map((b) => ({
            id: b.id,
            service: b.Service.name,
            date: b.date,
            time: b.time,
            name: b.name,
            phone: b.phone,
            notes: b.notes
        }));

        sendSuccess(res, 200, {
            data: formatted,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize)
            }
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
    authenticateToken,
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
    authorizeRoles("admin"),
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

// CREATE Review
app.post(
    "/services/:id/reviews",
    validate(reviewSchema),
    catchAsync(async (req, res) => {
        const serviceId = req.params.id;

        const service = await Service.findByPk(serviceId);

        if (!service) {
            throw new AppError("Service not found", 404);
        }

        const { rating, comment } = req.body;

        const review = await Review.create({
            serviceId,
            rating,
            comment
        });

        sendSuccess(res, 201, {
            message: "Review created successfully!",
            review
        });
    })
);

// GET Reviews for a Service
app.get(
    "/services/:id/reviews",
    catchAsync(async (req, res) => {
        const serviceId = req.params.id;

        const service = await Service.findByPk(serviceId);

        if (!service) {
            throw new AppError("Service not found", 404);
        }

        const reviews = await Review.findAll({
            where: { serviceId }
        });

        sendSuccess(res, 200, reviews);
    })
);

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
                email: user.email,
                role: user.role
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

// UPLOAD PROFILE PICTURE
app.post(
    "/users/profile-picture",
    authenticateToken,
    upload.single("profileImage"),
    catchAsync(async (req, res) => {
        if (!req.file) {
            throw new AppError("Please upload a profile image.", 400);
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const user = await User.findByPk(req.user.userId);

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        user.profileImage = result.secure_url;
        await user.save();

        sendSuccess(res, 200, {
            message: "Profile picture uploaded successfully!",
            profileImage: user.profileImage
        });
    })
);

// GET CURRENT USER PROFILE
app.get(
    "/users/profile",
    authenticateToken,
    catchAsync(async (req, res) => {
        const user = await User.findByPk(req.user.userId, {
            attributes: ["id", "email", "profileImage", "role"]
        });

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        sendSuccess(res, 200, {
            user
        });
    })
);

// GET All Services
app.get(
    "/services",
    catchAsync(async (req, res) => {
        const services = await Service.findAll();
        sendSuccess(res, 200, services);
    })
);

// GET Service by ID
app.get(
    "/services/:id",
    catchAsync(async (req, res) => {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            throw new AppError("Service not found", 404);
        }
        sendSuccess(res, 200, service);
    })
);

// CREATE Service
app.post(
    "/services",
    authenticateToken,
    authorizeRoles("admin"),
    validate(serviceSchema),
    catchAsync(async (req, res) => {
        const { name, description } = req.body;
        const service = await Service.create({ name, description });
        sendSuccess(res, 201, {
            message: "Service created successfully!",
            service
        });
    })
);

// UPDATE Service
app.put(
    "/services/:id",
    authenticateToken,
    authorizeRoles("admin"),
    validate(serviceSchema),
    catchAsync(async (req, res) => {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            throw new AppError("Service not found", 404);
        }
        const { name, description } = req.body;
        service.name = name;
        service.description = description;
        await service.save();
        sendSuccess(res, 200, {
            message: "Service updated successfully!",
            service
        });
    })
);

// DELETE Service
app.delete(
    "/services/:id",
    authenticateToken,
    authorizeRoles("admin"),
    catchAsync(async (req, res) => {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            throw new AppError("Service not found", 404);
        }
        // Need to verify if bookings are handled properly. 
        // Sequelize default is usually SET NULL or CASCADE.
        await service.destroy();
        sendSuccess(res, 200, {
            message: "Service deleted successfully!"
        });
    })
);

app.all("/{*any}", (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

module.exports = app;