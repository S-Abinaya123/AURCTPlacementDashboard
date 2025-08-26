import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const templatePath = path.join(
    __dirname,
    "..",
    "emailTemplates",
    "otpTemplate.html"
);
let templateHtml = "";
try {
    templateHtml = fs.readFileSync(templatePath, "utf8");
} catch (error) {
    console.error("Failed to read OTP template:", error.message);
    templateHtml = `<p>Hello {{name}},</p><p>Your OTP is: <b>{{otp}}</b></p>`;
}

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

        let finalHtml = templateHtml;
        for (const key in placeholders) {
            finalHtml = finalHtml.replace(`{{${key}}}`, placeholders[key]);
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
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

sendOtpEmail({
    to: "nj166307@gmail.com",
    name: "Sailash",
    registerNo: "950023104014",
    otp: "688144",
});
