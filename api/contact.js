import { connectDB } from "../config/db.js";
import Contact from "../models/Contact.js";
import transporter from "../config/mailer.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message, timezone: userTZ } = req.body;

    const tz = userTZ || "UTC";
    const nowUTC = dayjs.utc();
    const nowUser = nowUTC.tz(tz);

    await Contact.create({
      name,
      email,
      message,
      submittedAt: nowUTC.toDate(),
    });

    const formattedTime = nowUser.format("DD MMM YYYY, hh:mm A z");

    /* ✅ ADMIN EMAIL (IMPORTANT FOR YOU) */
    await transporter.sendMail({
      from: `"Prime Care Website" <${process.env.EMAIL_USER}>`,
      to: "dispatch@primecaretransportations.com", // ✅ YOUR BUSINESS MAIL
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
        <p><b>Submitted At:</b> ${formattedTime}</p>
      `,
    });

    /* ✅ USER EMAIL */
    await transporter.sendMail({
      from: `"Prime Care Medical Transportation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your enquiry",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting Prime Care Medical Transportation.</p>
        <p>We will contact you shortly.</p>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("CONTACT ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}