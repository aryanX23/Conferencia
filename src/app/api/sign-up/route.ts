import bcrypt from "bcryptjs";
import { isEmpty } from "lodash";
import { v4 as generateId } from "uuid";

import connectDatabase from "@/lib/databaseConnectService";
import UserModel from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";
import { signupSchema } from "@/schemas/signupSchema";
import zodErrorFormatter from "@/utils/zodErrorFormatter";

export const revalidate = 0;

export async function POST(req: Request) {
  await connectDatabase();

  try {
    const requestBody = await req?.json();

    const parseResult = signupSchema.safeParse(requestBody);

		if (!parseResult.success) {
			const formattedErrors = zodErrorFormatter(parseResult.error);
      return Response.json(
        {
          success: false,
					message: "Request body validation error",
					code: "INVALID_REQUEST_BODY",
					errors: formattedErrors,
        },
        { status: 400 },
      );
    }

    const { username, email, password, fullname } = parseResult.data;

    const verifiedUserExists =
      (await UserModel.findOne({
        userName: username,
        email,
        emailVerified: true,
      }).lean()) || {};

    if (!isEmpty(verifiedUserExists)) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 },
      );
    }

    const userExists =
      (await UserModel.findOne({
        userName: username,
        email,
        emailVerified: false,
      }).lean()) || {};
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (!isEmpty(userExists)) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.updateOne(
        { userName: username, email, emailVerified: false },
        {
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: new Date(Date.now() + 3600000),
        },
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = "USER-" + generateId();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        userId,
        userName: username,
        password: hashedPassword,
        email,
        fullName: fullname,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();
    }

    // Send verification email
    const subject = "signup-verfication";
    const emailResponse = await sendEmail(email, username, subject, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
        code: "VERIFICATION_REQUIRED"
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error Registering User! ", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User, Please try again",
      },
      { status: 500 },
    );
  }
}
