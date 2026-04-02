import { connectDB } from "../config/db.js";
import Booking from "../models/Booking.js";
import transporter from "../config/mailer.js";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const data = req.body;

    await Booking.create(data);

    /* ✅ ADMIN EMAIL */
    await transporter.sendMail({
      from: `"Prime Care Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Booking Request",
      html: `<h3>New Booking Received</h3><p>${JSON.stringify(data)}</p>`,
    });

    /* ✅ USER EMAIL */
    await transporter.sendMail({
      from: `"Prime Care Medical Transportation" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Booking Request Received",
      html: `<p>Hi ${data.name}, your booking is received.</p>`,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    return res.status(500).json({ success: false });
  }
}