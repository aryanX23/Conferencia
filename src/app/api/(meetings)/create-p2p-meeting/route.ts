import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";

import connectDatabase from "@/lib/databaseConnectService";
import { meetingSchema } from "@/schemas/meetingSchema";
import zodErrorFormatter from "@/utils/zodErrorFormatter";
import MeetingModel from "@/models/Meeting";

export async function POST(req: NextRequest) {
  await connectDatabase();

  try {
    const token = await getToken({ req });
    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Forbidden User",
          code: "FORBIDDEN",
        },
        { status: 500 },
      );
    }

    const { userId: meetingOwnerId, userName: meetingOwnerUsername } = token;
    const requestBody = await req?.json();
    const parseResult = meetingSchema.safeParse(requestBody);

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

    // Duration will always be in minutes
    const { meetingCapacity, meetingDuration } = parseResult.data;

    const meetingId = uuid();
    const meetingDurationTimestamp = new Date(Date.now() + (meetingDuration * 60 * 1000));

    const newMeeting = new MeetingModel({
      meetingId,
      meetingOwnerId,
      meetingOwnerUsername,
      meetingCapacity,
      meetingDuration: meetingDurationTimestamp
    });
    await newMeeting.save();

    return Response.json(
      {
        success: true,
        data: {
          message: "Meeting Created Successfully",
          meetingId
        }
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error Creating Meeting -> ", error);
    return Response.json(
      {
        success: false,
        message: "Error Creating Meeting, Please try again",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
