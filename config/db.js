const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME, // 🔑 per client
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
