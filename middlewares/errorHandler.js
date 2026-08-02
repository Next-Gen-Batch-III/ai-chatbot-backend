const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err.stack || "No stack trace");

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        error: {
            message: err.message || "An unexpected error occurred on the server.",
        }
    });
};

export default errorHandler;
