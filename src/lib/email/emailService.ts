import nodemailer from 'nodemailer';

// This is a placeholder for a real email service like SendGrid or Mailgun.
// In a real application, you would configure your chosen email provider here.

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn('Email service not configured. Skipping email sending.');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent to ${options.to} with subject: ${options.subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${options.to}:`, error);
  }
}
