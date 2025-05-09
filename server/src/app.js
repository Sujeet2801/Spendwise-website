import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

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

import healthCheckRoute from './routes/healthCheck.route.js'
import authRoute from './routes/auth.route.js'
import expenseRoute from './routes/expense.route.js'
import incomeRoutes from "./routes/income.route.js"
import dashboardRoutes from './routes/dashboard.route.js'

app.use("/api/v1/users", healthCheckRoute)
app.use("/api/v1/users", authRoute)
app.use("/api/v1/users", expenseRoute)
app.use("/api/v1/users", incomeRoutes)
app.use("/api/v1/users", dashboardRoutes)

export default app;