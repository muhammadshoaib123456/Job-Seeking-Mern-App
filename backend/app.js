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

// ✅ Allowed Frontend Origins (for CORS)
const allowedOrigins = [
  "https://job-seeking-mern-app.vercel.app",       // Production
  "http://localhost:3000",                          // Local development
];

// ✅ CORS configuration with dynamic origin check
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    },
    credentials: true,
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
  res.send("Backend running successfully ✅");
});

// ✅ API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// ✅ Connect to MongoDB
dbConnection();

// ✅ Global error handler
app.use(errorMiddleware);

// ✅ Export app for server.js or index.js
export default app;
