const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendVerificationEmail = async (email, name, code) => {
  await transporter.sendMail({
    from: `"Flight Booking" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h2>Hello ${name},</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 8px; color: #4F46E5;">${code}</h1>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you did not register, ignore this email.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };