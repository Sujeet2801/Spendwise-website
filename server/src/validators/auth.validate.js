import { z } from "zod";

const userRegistrationSchema = () => {
    return z.object({
        email: z
            .string()
            .trim()
            .nonempty("Email is required")
            .email("Invalid email"),
        password: z
            .string()
            .min(8, "Password should be at least 8 char")
            .max(12, "Password should not exceed 12 char"),
        name: z
            .string()
            .nonempty("Name is required"),
        phone: z
            .string()
            .trim()
            .nonempty("Phone no is required")
            .regex(/^\d{10}$/, "Phone number must be exactly 10 digits.")
    });
};

const userLoginSchema = () => {
    return z.object({
        email: z
            .string()
            .trim()
            .nonempty("Email is required")
            .email("Invalid email"),
        password: z
            .string()
            .min(8, "Password should be at least 8 char")
            .max(12, "Password should not exceed 12 char")
    });
};

export { userRegistrationSchema, userLoginSchema };
