import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Plan Renewal Demo" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};
