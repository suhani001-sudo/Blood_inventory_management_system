import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000", 
  "https://blood-inventory-management-system.vercel.app", 
  process.env.CLIENT_URL, 
].filter(Boolean);

// CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    const normalizedAllowedOrigins = allowedOrigins.map((o) =>
      o.replace(/\/$/, "")
    );

    if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.error(`❌ CORS blocked request from: ${origin}`);
    return callback(
      new Error(`CORS policy does not allow access from origin: ${origin}`)
    );
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "Blood Bank API is running successfully 🚀",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode`,
  );
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});
