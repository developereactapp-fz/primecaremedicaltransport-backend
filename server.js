require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const contactRoutes = require("./routes/contact.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/booking", bookingRoutes);

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
