const { sendError } = require("../utils/response");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {

    // Malformed JSON
    if (err.type === "entity.parse.failed") {
        return sendError(
            res,
            400,
            "Malformed JSON in request body"
        );
    }

    // Multer errors
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            return sendError(
                res,
                400,
                "File size must not exceed 5 MB."
            );
        }

        return sendError(
            res,
            400,
            err.message
        );
    }

    // Invalid file type
    if (err.message === "Only JPG, PNG, and WEBP images are allowed.") {
        return sendError(
            res,
            400,
            err.message
        );
    }

    // Sequelize duplicate entry
    if (err.name === "SequelizeUniqueConstraintError") {
        return sendError(
            res,
            409,
            "Duplicate value"
        );
    }

    // Sequelize validation error
    if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map(e => e.message).join(", ");

        return sendError(
            res,
            400,
            messages
        );
    }

    // Our own AppError
    if (err.isOperational) {
        return sendError(
            res,
            err.statusCode,
            err.message
        );
    }

    // Unexpected errors
    logger.error(
    {
        err,
        method: req.method,
        url: req.originalUrl,
    },
    "Unexpected server error"
);

    return sendError(
        res,
        500,
        "Something went wrong"
    );
};

module.exports = errorHandler;