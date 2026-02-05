import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
export const sendVerificationEmail = async (token, email, userName) => {
  try {
    // 🔗 Frontend link
    const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

    // 📄 Read Email template file
    const templatePath = path.join(
      process.cwd(),
      "utils/emailTemplates/template.hbs",
    );
    const templateSource = fs.readFileSync(templatePath, "utf8");

    // 📝 Compile template with handlebars
    const template = handlebars.compile(templateSource);

    const htmlToSend = template({
      userName,
      verifyLink,
      year: new Date().getFullYear(),
    });

    // Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email configuration
    const mailConfiguration = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify your email",
      html: htmlToSend,
    };

    await transporter.sendMail(mailConfiguration);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("EMAIL ERROR 👉 ", error);
    throw error;
  }
};
