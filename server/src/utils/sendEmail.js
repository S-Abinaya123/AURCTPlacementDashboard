// import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// const otpTemplatePath = path.join(
//   __dirname,
//   "..",
//   "emailTemplates",
//   "otpTemplate.html"
// );

// const resetTemplatePath = path.join(
//   __dirname,
//   "..",
//   "emailTemplates",
//   "resetPasswordTemplate.html"
// );
// const welcomeTemplatePath = path.join(
//   __dirname,
//   "..",
//   "emailTemplates",
//   "accountCreationTemplate.html"
// );

// let otpTemplateHtml = "";
// let resetTemplateHtml = "";
// let welcomeTemplateHtml = "";

// try {
//   otpTemplateHtml = fs.readFileSync(otpTemplatePath, "utf8");
// } catch (error) {
//   console.error("Failed to read OTP template:", error.message);
//   otpTemplateHtml = `<p>Hello {{name}},</p><p>Your OTP is: <b>{{otp}}</b></p>`;
// }

// try {
//   resetTemplateHtml = fs.readFileSync(resetTemplatePath, "utf8");
// } catch (error) {
//   console.error("Failed to read Reset Password template:", error.message);
//   resetTemplateHtml = `<p>Hello {{name}},</p><p>Click here to reset: <a href="{{resetLink}}">Reset Password</a></p>`;
// }

// try {
//   welcomeTemplateHtml = fs.readFileSync(welcomeTemplatePath, "utf8");
// } catch (error) {
//   console.error("Failed to read Welcome template:", error.message);
//   welcomeTemplateHtml = `<p>Hello {{name}},</p><p>Welcome to the Placement Portal 🎉</p>`;
// }

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: parseInt(process.env.SMTP_PORT) || 587,
//   secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// export const sendOtpEmail = async ({ to, name, registerNo, otp }) => {
//   try {
//     const today = new Date();
//     const formattedDate = today.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//     const placeholders = {
//       date: formattedDate,
//       name,
//       registerNo,
//       otp,
//       year: new Date().getFullYear(),
//     };

//     let finalHtml = otpTemplateHtml;
//     for (const key in placeholders) {
//       finalHtml = finalHtml.replace(`{{${key}}}`, placeholders[key]);
//     }

//     const mailOptions = {
//       from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Your OTP for Placement Portal",
//       html: finalHtml,
//     };
//     const info = await transporter.sendMail(mailOptions);
//     console.log("OTP email sent:", info.messageId);
//     return {
//       success: true,
//       messageId: info.messageId,
//     };
//   } catch (error) {
//     console.error("Error sending OTP email:", error.message);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// export const sendPasswordResetEmail = async ({
//   to,
//   name,
//   registerNo,
//   resetLink,
// }) => {
//   try {
//     const today = new Date();
//     const formattedDate = today.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//     const placeholders = {
//       date: formattedDate,
//       name,
//       registerNo,
//       resetLink,
//       year: new Date().getFullYear(),
//     };

//     let finalHtml = resetTemplateHtml;
//     for (const key in placeholders) {
//       finalHtml = finalHtml.replace(
//         new RegExp(`{{${key}}}`, "g"),
//         placeholders[key]
//       );
//     }

//     const mailOptions = {
//       from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Reset Your Password - Placement Portal",
//       html: finalHtml,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Password reset email sent:", info.messageId);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error("Error sending reset password email:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// export const sendWelcomeEmail = async ({ to, name }) => {
//   try {
//   	const today = new Date();
//     const formattedDate = today.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//     const placeholders = {
//       name,
//  	  date: formattedDate,
//       year: new Date().getFullYear(),
//     };

//     let finalHtml = welcomeTemplateHtml;
//     for (const key in placeholders) {
//       finalHtml = finalHtml.replace(
//         new RegExp(`{{${key}}}`, "g"),
//         placeholders[key]
//       );
//     }

//     const mailOptions = {
//       from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Welcome to AURCT Placement Portal",
//       html: finalHtml,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Welcome email sent:", info.messageId);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error("Error sending welcome email:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// export const sendInterviewReminderEmail = async ({ to, companyName, role, interviewDate, description, jobLink, icsFilePath }) => {
//   try {
//     const formattedDate = new Date(interviewDate).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     const subject = `Interview Reminder: ${companyName} - ${role}`;
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//         <h2 style="color: #1e40af;">Interview Reminder</h2>
//         <p>You have an upcoming interview:</p>
//         <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
//           <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
//           <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
//           <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
//           ${description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>` : ''}
//           ${jobLink ? `<p style="margin: 5px 0;"><strong>Job Link:</strong> <a href="${jobLink}" style="color: #1e40af;">View Job</a></p>` : ''}
//         </div>
//         <p style="color: #16a34a; font-weight: bold;">📅 The interview has been automatically added to your Google Calendar!</p>
//         <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
//           If the calendar event was not added automatically, please download the attached file and import it to your calendar.
//         </p>
//       </div>
//     `;

//     let mailOptions = {
//       from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     if (icsFilePath && fs.existsSync(icsFilePath)) {
//       mailOptions.attachments = [{
//         filename: `${companyName.replace(/\s+/g, '_')}_interview.ics`,
//         path: icsFilePath,
//       }];
//     }

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Interview reminder email sent:", info.messageId);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error("Error sending interview reminder email:", error.message);
//     return { success: false, error: error.message };
//   }
// };


import nodemailer from "nodemailer";

/**
 * 1. HARDCODED TEMPLATES
 * Cloudflare has a read-only filesystem; we store templates as variables 
 * to avoid using 'fs.readFileSync'.
 */
const templates = {
  otp: `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #1e40af;">Your OTP</h2>
      <p>Hello {{name}},</p>
      <p>Your OTP for the Placement Portal is: <b style="font-size: 1.2em;">{{otp}}</b></p>
      <p>Registration No: {{registerNo}}</p>
      <p>Date: {{date}}</p>
      <hr/>
      <p style="font-size: 0.8em; color: #6b7280;">© {{year}} AURCT Placement Portal</p>
    </div>`,
  reset: `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #1e40af;">Password Reset</h2>
      <p>Hello {{name}},</p>
      <p>You requested a password reset for Registration No: {{registerNo}}.</p>
      <p>Click the link below to reset your password:</p>
      <div style="margin: 20px 0;">
        <a href="{{resetLink}}" style="background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </div>
      <p style="font-size: 0.8em; color: #ef4444;">If you didn't request this, please ignore this email.</p>
    </div>`,
  welcome: `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #16a34a;">Welcome to AURCT 🎉</h2>
      <p>Hello {{name}},</p>
      <p>Your account has been successfully created in the Placement Portal.</p>
      <p>You can now log in and explore job opportunities.</p>
      <p>Date: {{date}}</p>
    </div>`
};

/**
 * 2. LAZY TRANSPORTER INITIALIZATION
 * CRITICAL: This MUST be inside a function to avoid the "Global Scope" error.
 * Cloudflare forbids generating random values (crypto) during file load.
 */
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * 3. HELPERS
 */
const getFormattedDate = () => new Date().toLocaleDateString("en-GB", {
  day: "2-digit", month: "short", year: "numeric",
});

const fillTemplate = (html, data) => {
  let final = html;
  for (const key in data) {
    final = final.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }
  return final;
};

/* =================================
   EXPORTED EMAIL FUNCTIONS
================================= */

// SEND OTP
export const sendOtpEmail = async ({ to, name, registerNo, otp }) => {
  try {
    const transporter = getTransporter();
    const html = fillTemplate(templates.otp, {
      name, registerNo, otp, 
      date: getFormattedDate(), 
      year: new Date().getFullYear()
    });

    const info = await transporter.sendMail({
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP for Placement Portal",
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("OTP Email Error:", error.message);
    return { success: false, error: error.message };
  }
};

// SEND PASSWORD RESET
export const sendPasswordResetEmail = async ({ to, name, registerNo, resetLink }) => {
  try {
    const transporter = getTransporter();
    const html = fillTemplate(templates.reset, {
      name, registerNo, resetLink, 
      year: new Date().getFullYear()
    });

    const info = await transporter.sendMail({
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password - Placement Portal",
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Reset Email Error:", error.message);
    return { success: false, error: error.message };
  }
};

// SEND WELCOME EMAIL
export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    const transporter = getTransporter();
    const html = fillTemplate(templates.welcome, {
      name, 
      date: getFormattedDate()
    });

    const info = await transporter.sendMail({
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to AURCT Placement Portal",
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Welcome Email Error:", error.message);
    return { success: false, error: error.message };
  }
};

// SEND INTERVIEW REMINDER (WITH ICS ATTACHMENT)
export const sendInterviewReminderEmail = async ({ 
  to, companyName, role, interviewDate, description, jobLink, icsContent 
}) => {
  try {
    const transporter = getTransporter();
    const formattedDate = new Date(interviewDate).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    const html = `
      <div style="font-family: Arial; max-width: 600px; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
        <h2 style="color: #1e40af;">Interview Reminder</h2>
        <p>You have an upcoming interview details below:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          ${description ? `<p><strong>Note:</strong> ${description}</p>` : ''}
          ${jobLink ? `<p><a href="${jobLink}" style="color: #1e40af; font-weight: bold;">View Job Details</a></p>` : ''}
        </div>
        <p style="font-size: 0.9em; color: #4b5563;">
          📅 A calendar invite (.ics file) has been attached to this email. You can open it to add this event to your calendar.
        </p>
      </div>
    `;

    let mailOptions = {
      from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Interview Reminder: ${companyName} - ${role}`,
      html,
    };

    // Attach ICS content if provided (String-based content, no FS path)
    if (icsContent) {
      mailOptions.attachments = [{
        filename: `${companyName.replace(/\s+/g, '_')}_interview.ics`,
        content: icsContent,
        contentType: 'text/calendar',
      }];
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Interview Email Error:", error.message);
    return { success: false, error: error.message };
  }
};