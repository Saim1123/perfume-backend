import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Verify your email address",
    text: `Your verification code is: ${verificationToken}`,
    html: `<p>Your verification code is: <b>${verificationToken}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};
