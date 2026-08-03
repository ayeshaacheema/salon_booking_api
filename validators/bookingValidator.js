const { z } = require("zod");

const bookingSchema = z.object({
    service: z
        .string()
        .min(1, "Service is required")
        .max(50, "Service name cannot exceed 50 characters"),

    date: z
        .string()
        .min(1, "Date is required"),

    time: z
        .string()
        .min(1, "Time is required"),

    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    phone: z
        .string()
        .length(11, "Phone number must be exactly 11 digits"),

    notes: z.string().optional()
});

module.exports = {
    bookingSchema
};