import { config } from "dotenv";
config(); // Loads the environment variables from .env file into process.env

import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, text) => {
  try {
    const transporter = createTransport({
      service:"Gmail",
      auth:{
        user:process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
    const mailOptions = {
      from:"Sharanu SB",
      to : email,
      subject,
      text
    }
    await transporter.sendMail(mailOptions)
    console.log("Mail sent Successfully")
  } catch (error) {
    console.log("Error While Sending the Mail")
  }
};
