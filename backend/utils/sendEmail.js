import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `Sijgeria UCS Sangha <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message, // Plain text fallback for email clients that don't support HTML
    html: options.htmlBody, // <-- This is the fix that adds your stylish HTML
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
