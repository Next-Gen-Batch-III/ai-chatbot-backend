import AppError from "./appError.js";

class UnauthorisedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export default UnauthorisedError;