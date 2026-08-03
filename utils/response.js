const sendSuccess = (res, statusCode, data) => {
    res.status(statusCode).json({
        success: true,
        data,
        error: null
    });
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        data: null,
        error: {
            message
        }
    });
};

module.exports = {
    sendSuccess,
    sendError
};