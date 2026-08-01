import AppError from "./appError.js";

class UnauthorisedError extends Error {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export default UnauthorisedError;