import { transporter } from "./mail.js";

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
