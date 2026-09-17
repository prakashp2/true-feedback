import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    console.log("🔥 SIGNUP API CALLED");

    await dbConnect();
    console.log("✅ DATABASE CONNECTED");

    const { username, email, password } = await request.json();

    console.log("👤 Username:", username);
    console.log("📧 Email:", email);

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });

    const verifyCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verifyCodeExpiry = new Date(
      Date.now() + 60 * 60 * 1000
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      }

      existingUser.password = hashedPassword;
      existingUser.verifyCode = verifyCode;
      existingUser.verifyCodeExpiry = verifyCodeExpiry;

      await existingUser.save();

      console.log("✅ Existing unverified user updated");
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();

      console.log("✅ New user created");
    }

    console.log("📧 Calling Resend...");

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log("📧 Email response:", emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 SIGNUP ERROR:");
    console.error(error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Signup failed",
      },
      { status: 500 }
    );
  }
}