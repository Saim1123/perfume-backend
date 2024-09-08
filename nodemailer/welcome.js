import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export const sendWelcomeEmail = async (email, firstName, lastName) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Email Verified",
    text: `welcome ${firstName} ${lastName} 😊`,
    html: `<p>welcome: <b>${firstName} ${lastName} 😊</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};
