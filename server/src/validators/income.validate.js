import { z }from 'zod';

export const incomeSchema = () => {

    return z.object({

        amount: z
            .number({ invalid_type_error: "Amount must be a number"})
            .positive("Amount must be greater than 0"),

        source: z
            .string()
            .nonempty("Source is required"),

        date: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),

        notes: z
            .string()
            .max(300, "Note should not be greater than 300 char")
            .optional()
    })
}