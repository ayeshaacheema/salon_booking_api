const { z } = require("zod");

const reviewSchema = z.object({
    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be greater than 5"),

    comment: z
        .string()
        .trim()
        .min(1, "Comment is required")
});

module.exports = { reviewSchema };