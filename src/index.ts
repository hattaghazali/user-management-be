import express, { Application, NextFunction, Request, Response } from "express";

import configs from "./configs/configs";
import connectDB from "./configs/connect-db";
import { notFoundHandler } from "./middlewares/not-found";
import basic from "./routes/route-basic";

const app: Application = express();

// START: Initialize MongoDB connection
connectDB();

// START: Middleware

// START: Routes
app.use("/api/user", basic);

// START: Route not found
app.use(notFoundHandler);

// START: Server
app.listen(configs.port, async () => {
  console.log(`LOG: Server started on PORT:::${configs.port} ${configs.bruh}`);
});
