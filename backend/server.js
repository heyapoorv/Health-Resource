// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const morgan = require('morgan');
// const connectDB = require('./config/db');
// const errorMiddleware = require('./middlewares/errorMiddleware');

// dotenv.config();
// //connectDB();

// const app = express();
// app.use(express.json());

// app.use(morgan('dev'));


// //for security and blocking attacks 
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');

// app.use(mongoSanitize()); // prevent MongoDB query injection
// app.use(xss()); // sanitize input to prevent XSS attacks

// //for no.of requests

// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// // Rate limiting (apply globally or per route)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per 15 mins
//   message: { success: false, message: 'Too many requests, try again later.' }
// });

// app.use('/api/', apiLimiter);

// const allowedOrigins = [
//   'http://localhost:3000',   // frontend dev
//   'http://localhost:5173'
// ];




// // Security headers
// app.use(helmet());

//  // Apply to all API endpoints

// const authLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 5, // max 5 attempts
//   message: { success: false, message: 'Too many login attempts, try later.' }
// });
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);

// app.use(helmet({
//   contentSecurityPolicy: false, // (if needed for APIs)
//   crossOriginEmbedderPolicy: false
// }));



// // ✅ API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/medical-services', require('./routes/medicalServiceRoutes'));
// app.use('/api/locations', require('./routes/locationRoutes'));
// app.use('/api/offerings', require('./routes/serviceOfferingRoutes'));
// app.use('/api/availability', require('./routes/availabilityRoutes'));
// app.use('/api/appointments', require('./routes/appointmentRoutes'));
// app.use('/api/medicine-requests', require('./routes/medicineRequestRoutes'));


// // ✅ Error Middleware
// app.use(errorMiddleware);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// ===== CORS FIRST =====
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ===== Core Middleware =====
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Security =====
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// ===== FIX for express-mongo-sanitize =====
// Instead of replacing req.query, sanitize body, params, query individually
// app.use((req, res, next) => {
//   try {
//     if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: "_" });
//     if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: "_" });
//     if (req.query) {
//       // Create a copy to avoid overwriting getter
//       const cleanQuery = { ...req.query };
//       mongoSanitize.sanitize(cleanQuery, { replaceWith: "_" });
//       req.query = cleanQuery;
//     }
//   } catch (err) {
//     console.error("Sanitize error:", err);
//   }
//   next();
// });

// ===== Logger =====
app.use(morgan("dev"));

// ===== Rate limiting =====
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, try again later." },
});
app.use("/api/", apiLimiter);

// ===== Routes =====
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import medicalServiceRoutes from "./routes/medicalServiceRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import serviceOfferingRoutes from "./routes/serviceOfferingRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicineRequestRoutes from "./routes/medicineRequestRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medical-services", medicalServiceRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/offerings", serviceOfferingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicine-requests", medicineRequestRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===== Database Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});
