import { transporter } from "./mail.js";
import dotenv from "dotenv";
dotenv.config();

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  console.log(resetUrl);

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Click the following link to reset your password:</p>
           <a href="${resetUrl}">Reset Password</a>`,
  };

  await transporter.sendMail(mailOptions);
};
