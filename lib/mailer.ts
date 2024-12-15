import nodemailer from "nodemailer";
const MY_EMAIL2 = process.env.MY_EMAIL2;
const PASS = process.env.PASSWORD;

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: MY_EMAIL2,
        pass: PASS,
      },
    });

    const mailOptions = {
      from: MY_EMAIL2,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};
