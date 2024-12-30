"use client";
import callApi from "@/utils/callApiService";

export const callCreateMeetingService = async (payload: {
  meetingCapacity: string;
  meetingDuration: number | null;
}): Promise<any> => {
  try {
    const successResponse = await callApi.post(
      "/api/create-p2p-meeting",
      payload,
    );

    return successResponse?.data;
  } catch (err: any) {
    const errResponse = err?.response?.data;
    return errResponse;
  }
};
