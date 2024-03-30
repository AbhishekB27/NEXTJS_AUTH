import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

interface MailParameters {
  email: string;
  emailType: string;
  userId: string;
}

export const sendMail = async ({
  email,
  emailType,
  userId,
}: MailParameters) => {
  try {
    // TODO configure mail for usage
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2ea2a8bea486c3", //❌
        pass: "a8e24189cec49d", // ❌
      },
    });

    const mailOption = {
      from: "abhi23@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password", // Subject line
      // text: "Hello world?", // plain text body
      html: `<p>click <a href='${
        process.env.DOMAIN
      }/verifyEmail?token=${hashedToken}'>here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link in your browser.</p> </br> 
      ${process.env.DOMAIN}/verifyEmail?token=${hashedToken}
      `, // html body
    };

    const mailResponse = await transporter.sendMail(mailOption);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
