import express, { Application } from 'express'
import connectDB from './configs/connect-db'
import configs from './configs/configs'
import route_admin from './routes/route-admin'
import { notFoundHandler } from './middlewares/not-found'

const app: Application = express()

// START: Initialize MongoDB connection
connectDB()

// START: Middleware
app.use(express.json())

// START: Routes
app.use('/api/user', route_admin)

// START: Route not found
app.use(notFoundHandler)

// START: Server
app.listen(configs.port, async () => {
    console.log(`LOG: Server started on PORT:::${configs.port} ${configs.bruh}`)
})
