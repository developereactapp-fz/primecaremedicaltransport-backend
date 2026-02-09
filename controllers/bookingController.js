const Booking = require("../models/Booking");

exports.submitBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, message: "Booking submitted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
