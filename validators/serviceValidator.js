const { z } = require("zod");

const serviceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Service name is required")
        .max(100, "Service name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
});

module.exports = {
    serviceSchema
};