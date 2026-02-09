const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const Booking = require("../models/Booking");
const transporter = require("../config/mailer");

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      pickupDateTime,
      pickupLocation,
      dropLocation,
      serviceType,
      notes,
    } = req.body;

    const date = dayjs(pickupDateTime);
    const pickupDate = date.format("DD MMM YYYY");
    const pickupTime = date.format("hh:mm A");
    const submittedAt = dayjs().format("DD MMM YYYY, hh:mm A");

    // Save to DB
    await Booking.create({
      name,
      phone,
      pickupDate,
      pickupTime,
      pickupLocation,
      dropLocation,
      serviceType,
      notes,
      submittedAt,
    });

    /* ADMIN EMAIL */
    await transporter.sendMail({
      from: `"Prime Care Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Booking Request",
      html: `
        <h3>New Booking Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${serviceType}</p>
        <p><b>Pickup Date:</b> ${pickupDate}</p>
        <p><b>Pickup Time:</b> ${pickupTime}</p>
        <p><b>Pickup Location:</b> ${pickupLocation}</p>
        <p><b>Drop Location:</b> ${dropLocation}</p>
        <p><b>Notes:</b> ${notes || "-"}</p>
        <p><b>Submitted At:</b> ${submittedAt}</p>
      `,
    });

    /* CUSTOMER AUTO REPLY */
    await transporter.sendMail({
      from: `"Prime Care Medical Transportation" <${process.env.EMAIL_USER}>`,
      to: `${phone}@sms.gateway.com`, // OPTIONAL (email if provided)
      subject: "Booking Request Received",
      html: `
        <p>Hi ${name},</p>
        <p>Your booking request has been submitted successfully.</p>
        <p>Our team will contact you shortly to confirm availability.</p>
        <br/>
        <p>Thank you,<br/>Prime Care Team</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
