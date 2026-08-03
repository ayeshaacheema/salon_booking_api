const { sendError } = require("../utils/response");

const errorHandler = (err, req, res, next) => {

    // Malformed JSON
    if (err.type === "entity.parse.failed") {
        return sendError(
            res,
            400,
            "Malformed JSON in request body"
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
    console.error(err);

    return sendError(
        res,
        500,
        "Something went wrong"
    );
};

module.exports = errorHandler;