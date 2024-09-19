import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;

const initializeTransporter = async () => {
  if (process.env.NODE_ENV === "development") {
    // Configuration Ethereal pour le développement (inchangée)
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // Configuration pour staging et production
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

export const sendEmail = async ({ to, subject, text }) => {
  if (!transporter) {
    await initializeTransporter();
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } else {
    console.log("Message sent: %s", info.messageId);
  }

  return info;
};

initializeTransporter();
