import { z } from "zod";
import { isEmpty } from "lodash";
import { NextRequest } from "next/server";

import connectDatabase from "@/lib/databaseConnectService";
import { usernameSchema } from "@/schemas/signupSchema";
import UserModel from "@/models/User";

const usernameValidationSchema = z.object({
  username: usernameSchema,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    const result = usernameValidationSchema.safeParse({ username });

    if (result.success === false) {
      const errorMessage = result.error.format().username?._errors[0];
      return Response.json(
        { success: false, message: errorMessage },
        { status: 400 },
      );
    }
    
    await connectDatabase();
    const userExists = await UserModel.exists({ userName: username }).lean() || {};

    if (!isEmpty(userExists)) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 },
      );
    }

    return Response.json({ success: true, message: "Username is available" });
  } catch (error) {
    console.log("Error in Verifying username -> ", error);
    return Response.json(
      { success: false, message: "Error fetching username validation" },
      { status: 500 },
    );
  }
}
