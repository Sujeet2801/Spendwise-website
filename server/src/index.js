import express from 'express'
import app from "./app.js";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDB from "./database/db.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000

app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true, // to enable storing cookie
        methods: ["GET", "POST", "DELETE", "OPTIONS"], // not case sensitive
        allowedHeaders: ["Content-Type", "Authorization"], // case sensitive
    })
);

app.use(express.json()); // to accept json data
app.use(express.urlencoded({ extended: true })); // to accept data from url
app.use(cookieParser());

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
    .catch((err) => {
        console.error("Mongodb connection error", err)
        process.exit(1);
    })