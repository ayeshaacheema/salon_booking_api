const AppError = require("../utils/AppError");

const validate = (schema) => {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            const messages = result.error.issues.map(
                issue => issue.message
            );

            return next(
                new AppError(
                    messages.join(", "),
                    400
                )
            );

        }

        next();

    };

};

module.exports = validate;