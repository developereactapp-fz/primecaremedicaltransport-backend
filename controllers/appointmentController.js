const Appointment = require("../models/Appointment");
const { transporter } = require("../utils/mailer");
const { verifyCaptcha } = require("../utils/verifyCaptcha");

exports.createAppointment = async (req, res) => {
  const {
    name,
    email,
    department,
    doctor,
    appointmentDate,
    phone,
    captchaToken
  } = req.body;

  if (!(await verifyCaptcha(captchaToken)))
    return res.status(400).json({ error: "Captcha failed" });

  const appointment = await Appointment.create({
    name,
    email,
    department,
    doctor,
    appointmentDate,
    phone
  });

  // Admin Email
  await transporter.sendMail({
    to: process.env.EMAIL_USER,
    subject: "New Appointment Request",
    html: `
      <h3>New Appointment</h3>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Department: ${department}</p>
      <p>Doctor: ${doctor}</p>
      <p>Date: ${appointmentDate}</p>
    `
  });

  // Customer Auto-Reply
  await transporter.sendMail({
    to: email,
    subject: "Appointment Request Received",
    html: `
      <p>Thank you for contacting Prime Care.</p>
      <p>We will confirm your appointment shortly.</p>
    `
  });

  res.status(201).json({ success: true });
};
