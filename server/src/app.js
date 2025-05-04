import express from 'express'

const app = express()

import healthCheckRoute from './routes/healthCheck.route.js'

app.use("/api/v1/users", healthCheckRoute)

export default app;