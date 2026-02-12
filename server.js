const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const contactRoutes = require("./routes/contact.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

/* --------------------------
   CORS CONFIGURATION
--------------------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "https://primecaremedicaltransport-frontend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS not allowed"), false);
      }

      return callback(null, true);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  })
);

// Important for Vercel preflight
app.options("*", cors());

app.use(express.json());

/* --------------------------
   ROUTES
--------------------------- */

app.use("/api/contact", contactRoutes);
app.use("/api/booking", bookingRoutes);

/* --------------------------
   MONGODB CONNECTION
--------------------------- */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect immediately
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* --------------------------
   LOCAL DEVELOPMENT ONLY
--------------------------- */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

/* --------------------------
   EXPORT FOR VERCEL
--------------------------- */

module.exports = app;
