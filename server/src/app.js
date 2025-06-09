import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json()); // to accept json data
app.use(express.urlencoded({ extended: true })); // to accept data from url
app.use(cookieParser());

// Allowed origins from .env (comma-separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

// Enable CORS with multiple allowed origins
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

import healthCheckRoute from './routes/healthCheck.route.js'
import authRoute from './routes/auth.route.js'
import expenseRoute from './routes/expense.route.js'
import incomeRoutes from './routes/income.route.js'
import dashboardRoutes from './routes/dashboard.route.js'

app.use("/api/v1/users", healthCheckRoute)
app.use("/api/v1/users", authRoute)
app.use("/api/v1/users", expenseRoute)
app.use("/api/v1/users", incomeRoutes)
app.use("/api/v1/users", dashboardRoutes)

export default app;