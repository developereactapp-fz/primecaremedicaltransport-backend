const Contact = require("../models/Contact");

exports.submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: "Message sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
