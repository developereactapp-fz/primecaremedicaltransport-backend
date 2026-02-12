const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const contactRoutes = require("./routes/contact.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/booking", bookingRoutes);

/* --------------------------
   Mongo Connection
--------------------------- */

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* --------------------------
   Local Only Listen
--------------------------- */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

module.exports = app;
