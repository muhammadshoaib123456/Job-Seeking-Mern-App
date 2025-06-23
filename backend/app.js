import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// ✅ Load env variables
config({ path: "./config/config.env" });

const app = express();

// ✅ CORS — Very important for Vercel/Netlify
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://job-seeking-mern-app.vercel.app",
    credentials: true, // ✅ Allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ✅ Test route
app.get("/check", (req, res) => {
  res.send("Backend running successfully");
});

// ✅ API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// ✅ Connect to MongoDB
dbConnection();

// ✅ Global error middleware
app.use(errorMiddleware);

// ✅ Export app
export default app;
