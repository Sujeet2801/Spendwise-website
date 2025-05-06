import { ApiError } from "../utils/api-error.js";
import { ZodError } from "zod";

export const validateUsingZodError = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
        const formattedErrors = err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
        console.log(formattedErrors);
        
        throw new ApiError(400, "Validation failed", formattedErrors);
        } else {
        throw new ApiError(500, "Unexpected error during validation");
        }
    }
};
