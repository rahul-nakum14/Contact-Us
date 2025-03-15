import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { json, urlencoded } from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { connectKafka } from "./config/kafka";
import { connectRedis } from "./config/redis";
import authRoutes from "./routes/auth.routes";
import formRoutes from "./routes/form.routes";
import submissionRoutes from "./routes/submission.routes";
import userRoutes from "./routes/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan("dev"));

// Body Parsers
app.use(json());
app.use(urlencoded({ extended: true }));

// Database & Caching Initialization
connectDB();
connectKafka();
connectRedis();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
