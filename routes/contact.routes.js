const express = require("express");
const router = express.Router();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezonePlugin = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const Contact = require("../models/Contact");
const transporter = require("../config/mailer");

router.post("/", async (req, res) => {
  try {
    const { name, email, message, timezone } = req.body;

    // ✅ fallback timezone
    const userTimezone = timezone || "UTC";

    // ✅ store UTC time
    const nowUTC = dayjs.utc();

    // ✅ convert for display
    const nowUser = nowUTC.tz(userTimezone);
    /* =========================
       SAVE TO DATABASE
    ========================= */
    await Contact.create({
      name,
      email, 
      message,
      submittedAt: nowUTC.toDate(),
    });
    
    const formattedTime = nowUser.format("DD MMM YYYY, hh:mm A z");

console.log("sender admin mail to", process.env.ADMIN_EMAIL)
console.log("User Timezone", userTimezone)
    
/* =========================
       1️⃣ ADMIN EMAIL (YOU RECEIVE)
    ========================= */
    await transporter.sendMail({
      from: `"Prime Care Website" <${process.env.EMAIL_USER}>`, // ✅ ALWAYS business mail
      to: "dispatch@primecaretransportations.com", // ✅ YOU receive here
      replyTo: email, // ✅ reply goes to user
      subject: "New Contact Form Submission",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
        <p><b>Submitted At:</b> ${formattedTime}</p>
      `,
    });

    /* =========================
       2️⃣ USER EMAIL (THANK YOU MAIL)
    ========================= */
    await transporter.sendMail({
      from: `"Prime Care Medical Transportation" <${process.env.EMAIL_USER}>`, // ✅ still business mail
      to: email, // 👤 goes to user
      subject: "We received your enquiry",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting <b>Prime Care Medical Transportation</b>.</p>
        <p>We have received your enquiry and will contact you shortly.</p>
        <br/>
        <p><b>Your Message:</b></p>
        <p>${message}</p>
        <br/>
        <p>Best Regards,<br/>Prime Care Team</p>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;