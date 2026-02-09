const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    pickupDate: String,
    pickupTime: String,
    pickupLocation: String,
    dropLocation: String,
    serviceType: String,
    notes: String,
    submittedAt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
