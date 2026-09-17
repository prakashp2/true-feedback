import nodemailer from "nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { render } from "@react-email/render";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("📧 Sending OTP to:", email);

    if (!process.env.GMAIL_USER) {
      return {
        success: false,
        message: "GMAIL_USER is missing",
      };
    }

    if (!process.env.GMAIL_APP_PASSWORD) {
      return {
        success: false,
        message: "GMAIL_APP_PASSWORD is missing",
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const emailHtml = await render(
      VerificationEmail({
        username,
        otp: verifyCode,
      })
    );

    await transporter.sendMail({
      from: `"True Feedback" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify your True Feedback account",
      html: emailHtml,
    });

    console.log("✅ OTP email sent successfully");

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send verification email",
    };
  }
}