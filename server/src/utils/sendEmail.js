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
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for 587
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

export const sendInterviewReminderEmail = async ({ to, companyName, role, interviewDate, description, jobLink, icsFilePath }) => {
  try {
    const formattedDate = new Date(interviewDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const subject = `Interview Reminder: ${companyName} - ${role}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e40af;">Interview Reminder</h2>
        <p>You have an upcoming interview:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
          <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          ${description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>` : ''}
          ${jobLink ? `<p style="margin: 5px 0;"><strong>Job Link:</strong> <a href="${jobLink}" style="color: #1e40af;">View Job</a></p>` : ''}
        </div>
        <p style="color: #16a34a; font-weight: bold;">📅 The interview has been automatically added to your Google Calendar!</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          If the calendar event was not added automatically, please download the attached file and import it to your calendar.
        </p>
      </div>
    `;

    let mailOptions = {
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    if (icsFilePath && fs.existsSync(icsFilePath)) {
      mailOptions.attachments = [{
        filename: `${companyName.replace(/\s+/g, '_')}_interview.ics`,
        path: icsFilePath,
      }];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Interview reminder email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending interview reminder email:", error.message);
    return { success: false, error: error.message };
  }
};