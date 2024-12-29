import { isEmpty } from "lodash";

import connectDatabase from "@/lib/databaseConnectService";
import UserModel from "@/models/User";
import zodErrorFormatter from "@/utils/zodErrorFormatter";
import { pinValidationSchema } from "@/schemas/pinValidationSchema";
import { sendEmail } from "@/utils/sendEmail";

export const revalidate = 0;

export async function POST(req: Request) {
  await connectDatabase();

  try {
    const requestBody = await req?.json();
    const parseResult = pinValidationSchema.safeParse(requestBody);

    if (!parseResult.success) {
      const formattedErrors = zodErrorFormatter(parseResult.error);
      return Response.json(
        {
          success: false,
          message: "Request body validation error",
          code: "INVALID_ARGUMENTS",
          errors: formattedErrors,
        },
        { status: 400 },
      );
    }

    const { email, pin, resetOtp = false } = parseResult.data;

    const unverifiedUserExists = await UserModel.findOne({
      email,
      emailVerified: false,
    }).lean();

    if (isEmpty(unverifiedUserExists)) {
      return Response.json(
        {
          success: false,
          message: "User not found",
          code: "NOT_FOUND"
        },
        { status: 404 },
      );
    }

    const { verifyCode, verifyCodeExpiry, userName: username } = unverifiedUserExists;
    const currentTime = new Date(Date.now());

    if (currentTime >= verifyCodeExpiry || resetOtp) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

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

      await UserModel.updateOne(
        { email, emailVerified: false },
        {
          verifyCode,
          verifyCodeExpiry: new Date(Date.now() + 3600000),
        },
      );

      return Response.json(
        {
          success: false,
          message: "Verify Code Resent, Code expired",
          code: "VERIFICATION_CODE_RESENT",
        },
        { status: 200 },
      );
    }

    if (verifyCode !== pin) {
      return Response.json(
        {
          success: false,
          message: "Incorrect OTP Entered",
          code: "INVALID_ARGUMENTS",
        },
        { status: 400 },
      );
    }

    await UserModel.updateOne(
      { email },
      {
        emailVerified: true,
      },
    );

    return Response.json(
      {
        success: true,
        message: "User Verified",
        code: "VERIFICATION_COMPLETE",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error Verifying User! ", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying User, Please try again",
        code: "INTERNAL_SERVER_ERROR"
      },
      { status: 500 },
    );
  }
}
