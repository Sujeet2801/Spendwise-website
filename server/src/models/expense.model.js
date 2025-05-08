import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        enum: 
        [   
            "Food",  "Transport", "Utilities",  "Entertainment", "Health",
            "Education",  "Housing",  "Personal Care", "Shopping",
            "Travel", "Insurance",  "Gifts", "Donations", "Savings",
            "Investments", "Taxes", "Fees", "Childcare", "Pets",
            "Other"
        ],
        default: "Other",
    },
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

export const Expense = mongoose.model("Expense", expenseSchema);