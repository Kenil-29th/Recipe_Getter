const nodemailer = require('nodemailer');

/**
 * @desc    Send contact form message via email
 * @route   POST /api/contact
 * @access  Public
 */
const sendContactMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'First name, email, subject, and message are required.',
      });
    }

    // Create transporter using Gmail SMTP (or any SMTP provider)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,       // Your Gmail address
        pass: process.env.SMTP_PASSWORD,    // Gmail App Password (not your regular password)
      },
    });

    // Email to you (site owner)
    const mailOptions = {
      from: `"${firstName} ${lastName || ''}" <${email}>`, // Shows customer's name & email as sender
      to: process.env.CONTACT_RECEIVE_EMAIL, // Your email where you receive messages
      replyTo: email, // When you hit Reply, it goes to the customer
      subject: `[Virtual Chef Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3a5f23; border-bottom: 2px solid #3a5f23; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #333;">Name:</td>
              <td style="padding: 8px 12px; color: #555;">${firstName} ${lastName || ''}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 8px 12px; color: #555;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #333;">Subject:</td>
              <td style="padding: 8px 12px; color: #555;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            This message was sent from the Virtual Chef contact form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact email error:', error);
    next(error);
  }
};

module.exports = { sendContactMessage };
