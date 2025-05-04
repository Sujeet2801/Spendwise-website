class ApiError extends Error {
    
    constructor(statusCode, message = '', error = [], stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.error = error;

    if (stack) {
        this.stack = stack;
    } else {
        Error.captureStackTrace(this, this.constructor);
    }
}

    toJSON() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            message: this.message,
            error: this.error,
        };
    }
}

export { ApiError };