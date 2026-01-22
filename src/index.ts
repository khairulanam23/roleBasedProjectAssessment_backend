import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import projectRoutes from "./routes/project";
import errorHandler from "./middlewares/error";
import loggerMiddleware from "./middlewares/logger";

dotenv.config();

const app = express();

// Security headers (helmet)
app.use(helmet());

// CORS - allow frontend origin in prod
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rbpafrontend.netlify.app",
      "https://rbpafrontend.vercel.app/",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());
app.use(loggerMiddleware); // Request logging

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() }),
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
