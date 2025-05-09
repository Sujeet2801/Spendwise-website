import { z } from "zod";

const expenseSchema = () => {
    return z.object({
        amount: z
            .number({ invalid_type_error: "Amount must be a number" })
            .positive("Amount must be greater than 0"),

        category: z
            .string()
            .nonempty("Category is required")
            .refine(
                (val) =>
                    [
                        "Food", "Transport", "Utilities", "Entertainment", "Health",
                        "Education", "Housing", "Personal Care", "Shopping",
                        "Travel", "Insurance", "Gifts", "Donations", "Savings",
                        "Investments", "Taxes", "Fees", "Childcare", "Pets", "Other"
                    ].includes(val),
                { message: "Invalid category" }
            ),

        date: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),

        notes: z
            .string()
            .optional()
            .max(300, "Notes cannot exceed 300 characters")
    });
};

export { expenseSchema };
