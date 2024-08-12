import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface SendVerificationEmailOptions {
  email: any;
  otp: any;
  subject: 'Email Verification' | 'Reset Password OTP';
}

export const sendVerificationEmail = async ({
  email,
  otp,
  subject,
}: SendVerificationEmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let html: string;

  switch (subject) {
    case 'Email Verification':
      html = `<p>Hello,</p>
              <p>Thank you for signing up. Your OTP for email verification is: <strong>${otp}</strong></p>
              <p>Please enter this OTP to verify your email address.</p>
              <p>Best regards,<br>CuteCatCoin</p>`;
      break;
    case 'Reset Password OTP':
      html = `<p>Hello,</p>
              <p>You have requested to reset your password. Your OTP for resetting the password is: <strong>${otp}</strong></p>
              <p>Please enter this OTP to reset your password.</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,<br>CuteCatCoin</p>`;
      break;
    default:
      throw new Error('Invalid email subject');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};
