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
        
        return res.status(400).json( new ApiError(400, "Validation failed", formattedErrors));

        } else {
            return res.status(500).json( new ApiError(500, "Unexpected error during validation" ));
        }
    }
};
