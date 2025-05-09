import mongoose, { Schema } from "mongoose";

const incomeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    source: {
        type: String,
        require: true,
        trim: true
    },
    amount: {
        type: Number,
        require: true,
        min: 0
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
        trim: true
    }
});

export const Income = mongoose.model('Income', incomeSchema);