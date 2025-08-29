import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const otpTemplatePath = path.join(
  __dirname,
  "..",
  "emailTemplates",
  "otpTemplate.html"
);

const resetTemplatePath = path.join(
  __dirname,
  "..",
  "emailTemplates",
  "resetPasswordTemplate.html"
);
const welcomeTemplatePath = path.join(
  __dirname,
  "..",
  "emailTemplates",
  "accountCreationTemplate.html"
);

let otpTemplateHtml = "";
let resetTemplateHtml = "";
let welcomeTemplateHtml = "";

try {
  otpTemplateHtml = fs.readFileSync(otpTemplatePath, "utf8");
} catch (error) {
  console.error("Failed to read OTP template:", error.message);
  otpTemplateHtml = `<p>Hello {{name}},</p><p>Your OTP is: <b>{{otp}}</b></p>`;
}

try {
  resetTemplateHtml = fs.readFileSync(resetTemplatePath, "utf8");
} catch (error) {
  console.error("Failed to read Reset Password template:", error.message);
  resetTemplateHtml = `<p>Hello {{name}},</p><p>Click here to reset: <a href="{{resetLink}}">Reset Password</a></p>`;
}

try {
  welcomeTemplateHtml = fs.readFileSync(welcomeTemplatePath, "utf8");
} catch (error) {
  console.error("Failed to read Welcome template:", error.message);
  welcomeTemplateHtml = `<p>Hello {{name}},</p><p>Welcome to the Placement Portal 🎉</p>`;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async ({ to, name, registerNo, otp }) => {
  try {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const placeholders = {
      date: formattedDate,
      name,
      registerNo,
      otp,
      year: new Date().getFullYear(),
    };

    let finalHtml = otpTemplateHtml;
    for (const key in placeholders) {
      finalHtml = finalHtml.replace(`{{${key}}}`, placeholders[key]);
    }

    const mailOptions = {
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP for Placement Portal",
      html: finalHtml,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const sendPasswordResetEmail = async ({
  to,
  name,
  registerNo,
  resetLink,
}) => {
  try {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const placeholders = {
      date: formattedDate,
      name,
      registerNo,
      resetLink,
      year: new Date().getFullYear(),
    };

    let finalHtml = resetTemplateHtml;
    for (const key in placeholders) {
      finalHtml = finalHtml.replace(
        new RegExp(`{{${key}}}`, "g"),
        placeholders[key]
      );
    }

    const mailOptions = {
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password - Placement Portal",
      html: finalHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending reset password email:", error.message);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async ({ to, name }) => {
  try {
	const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const placeholders = {
      name,
	  date: formattedDate,
      year: new Date().getFullYear(),
    };

    let finalHtml = welcomeTemplateHtml;
    for (const key in placeholders) {
      finalHtml = finalHtml.replace(
        new RegExp(`{{${key}}}`, "g"),
        placeholders[key]
      );
    }

    const mailOptions = {
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to AURCT Placement Portal",
      html: finalHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    return { success: false, error: error.message };
  }
};